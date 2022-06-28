import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, CollectionReference, DocumentData, QueryDocumentSnapshot, sortedChanges } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/compat/storage';
import { Timestamp } from '@angular/fire/firestore';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Comment {
  userID: string;
  text: string;
  timestamp: Timestamp;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  image: {
    thumbnail: string;
    full: string;
  };
  tags: string[];
  timestamp: Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsCollection: AngularFirestoreCollection<Post>;
  posts: Observable<Post[]>;
  currentPost: string = '';

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private storage: AngularFireStorage
  ) {
    this.postsCollection = afs.collection<Post>('posts');
    this.posts = this.postsCollection.valueChanges().pipe(map(posts => 
      posts.sort((a, b) =>
        a.timestamp.toDate().getTime() > b.timestamp.toDate().getTime() ? -1 : 1
      )
    ));
  }

  getPosts() { return this.posts }

  getTags() {
    /* 
     * Steps to get the tags and preserve the Observable:
     *   1. Get posts Observable -- [{ tags: [1, 2, 3] }, { tags: [1, 2, 4, 5] }]
     *   2. Use the pipe function of the Observable to process incoming stuff:
     *     2.1. Use map to get the tags -- [[1, 2, 3], [1, 2, 4, 5]]
     *     2.2. Flatten the array of arrays -- [1, 2, 3, 1, 2, 4, 5]
     *     2.3. Filter out the duplicates -- [1, 2, 3, 4, 5]
     */
    return this.posts.pipe(map(posts =>
      posts
        .map(post => post.tags)
        .reduce((acc, val) => acc.concat(val), [])
        .filter((item, pos, arr) =>
          arr.indexOf(item) == pos
        )
    ));
  }

  async getPost(id: string): Promise<QueryDocumentSnapshot<Post>> {
    try {
      const qSnapshot = await this.postsCollection.ref.where('id', '==', id).get();
      if (qSnapshot.empty) throw 'invalid-post';
      else return qSnapshot.docs[0];
    } catch (error) {
      throw (error);
    }
  }

  async getComments(postID: string): Promise<CollectionReference<DocumentData>> {
    const qSnapshot = await this.postsCollection.ref.where('id', '==', postID).get();
    return qSnapshot.docs[0].ref.collection('comments');
  }

  // Comments
  async postComment(postID: string, text: string): Promise<void> {
    const user = await this.authService.auth.currentUser;
    if (!user) throw 'not-logged-in';
    const snapshot = await this.postsCollection.ref.where('id', '==', postID).get();
    for (const docsnapshot of snapshot.docs) {
      await docsnapshot.ref.collection('comments').add({
        userID: user!.email,
        text: text,
        timestamp: Timestamp.fromDate(new Date(Date.now()))
      } as Comment);
      return;
    }
  }

  async editComment(postID: string, commentID: string, newText: string) {
    const snapshot = await this.postsCollection.ref.where('id', '==', postID).get();
    return await snapshot.docs[0].ref
      .collection('comments')
      .doc(commentID)
      .update({
        text: newText
      });
  }

  async deleteComment(postID: string, commentID: string) {
    const snapshot = await this.postsCollection.ref.where('id', '==', postID).get();
    return await snapshot.docs[0].ref.collection('comments').doc(commentID).delete();
  }

  async getLikes(postID: string): Promise<CollectionReference<DocumentData>> {
    const qSnapshot = await this.postsCollection.ref.where('id', '==', postID).get();
    return qSnapshot.docs[0].ref.collection('likes');
  }

  async setLiked(postID: string, state: boolean): Promise<void> {
    const qSnapshot = await this.postsCollection.ref.where('id', '==', postID).get();
    const user = await this.authService.auth.currentUser;
    if (!user) throw 'not-logged-in';
    const likeDoc = qSnapshot.docs[0].ref.collection('likes').doc(user!.email!);
    if (state === true)
      return await likeDoc.set({});
    else if (state === false)
      return await likeDoc.delete();
    else
      throw 'unknown-error';
  }

  searchPosts(tags: string[]) {
    return this.postsCollection.ref.where('tags', 'array-contains-any', tags);
  }

  getFullImage(postID: string) {
    return this.storage.ref(postID + '/full.jpg');
  }

  getThumbnailImage(postID: string) {
    return this.storage.ref(postID + '/thumbnail.jpg');
  }

  async getImages(postID: string): Promise<AngularFireStorageReference> {
    const snapshot = await this.postsCollection.ref.where('id', '==', postID).get();
    if (snapshot.empty || !snapshot.docs[0].exists) throw 'invalid-post';
    return this.storage.ref(postID);
  }

  async getRelativePost(postID: string, indexShift: number) {
    const postsSnapshot = await firstValueFrom(this.posts);
    const index = postsSnapshot.findIndex(post => post.id === postID);
    const newIndex = index + indexShift;
    if (newIndex > postsSnapshot.length - 1 || newIndex < 0) throw new Error('no-post-at-given-index');
    return postsSnapshot[newIndex];
  }
}
