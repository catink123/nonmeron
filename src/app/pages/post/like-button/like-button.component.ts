import { Component } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { PostService } from 'src/app/post.service';

@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.scss']
})
export class LikeButtonComponent {
  isLoading = true;
  count = 0;
  isLoggedIn = false;
  showMessage = false;
  userID = '';
  likedBy: string[] = [];
  likedByCurrentUser = false;

  constructor(
    private authService: AuthService, 
    private postService: PostService, 
    private route: ActivatedRoute,
    private analytics: AngularFireAnalytics
  ) {
    authService.auth.authState.subscribe(user => {
      if (user) {
        this.userID = user.email!;
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
      const postID = route.snapshot.params['id'];
      postService.getLikes(postID).then(likesRef => {
        const likeSnapshotCallback = (likes: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
          this.likedBy = [];
          likes.forEach(like => {
            this.likedBy.push(like.id);
          });
          if (this.likedBy.find(user => user === this.userID))
            this.likedByCurrentUser = true;
          else
            this.likedByCurrentUser = false;
          this.isLoading = false;
        };

        likesRef.get().then(likes => {
          likeSnapshotCallback(likes);
          likesRef.onSnapshot(likeSnapshotCallback);
        })
      }).catch(reason => {
        if (reason === 'no-likes') {
          console.error('No likes Collection!');
        }
      })
    });
  }

  like() {
    if (!this.isLoggedIn) {
      this.showMessage = true;
      return;
    }
    this.showMessage = false;
    const postID = this.route.snapshot.params['id'];
    this.postService.setLiked(postID, !this.likedByCurrentUser).then(() => {
      if (!this.likedByCurrentUser)
        this.analytics.logEvent('new-like');
    });
    this.isLoading = true;
  }
}
