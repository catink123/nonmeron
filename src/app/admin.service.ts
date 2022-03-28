import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Timestamp } from '@angular/fire/firestore';
import { concat, Observable } from 'rxjs';
import { finalize, concatWith } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { PostService } from './post.service';

interface AddPageInfo {
  id: string,
  title: string,
  description: string,
  fullImage: string,
  thumbnailImage: string,
  tags: string[]
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private postService: PostService, private afs: AngularFirestore, private authService: AuthService, private storage: AngularFireStorage) { }

  async addPost(info: AddPageInfo): Promise<Observable<number | undefined | void> | void> {
    const { id, title, description, fullImage, thumbnailImage, tags } = info;
    const isAdmin = await this.authService.isCurrentUserAdmin;
    if (!isAdmin) return;
    try {
      await this.postService.getPost(id);
    } catch (reason: any) {
      console.log("Couldn't get the post with reason:", reason);
      try {
        // Upload the full-size image
        return this.storage
          .ref(id)
          .child('full.jpg')
          .putString(fullImage, 'data-url')
          .percentageChanges()
          .pipe(
            concatWith(this.storage
              .ref(id)
              .child('thumbnail.jpg')
              .putString(fullImage, 'data-url')
              .percentageChanges(),
              this.afs.collection('posts').doc(id).set({
                id, title, description, tags,
                timestamp: Timestamp.fromDate(new Date(Date.now()))
              }))
          );
      } catch (reason) {
        throw reason;
      }
    }
  }
}
