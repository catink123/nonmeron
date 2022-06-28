import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { PostService } from 'src/app/post.service';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss']
})
export class CommentBoxComponent {
  isLoggedIn = false;
  comment = new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]);
  nickname = '...';

  showCommentBox = false;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private route: ActivatedRoute,
    private analytics: AngularFireAnalytics
  ) {
    authService.auth.authState.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        authService.getUser(user.email!).then(userData => {
          if (userData)
            this.nickname = userData!.nickname;
          else
            this.nickname = user.email!;
        })
      }
      this.isLoggedIn = user != null;
      if (!this.isLoggedIn) this.comment.disable();
    });
  }

  submit() {
    const postID = this.route.snapshot.params['id'];
    this.postService.postComment(postID, this.comment.value).then(() => {
      this.analytics.logEvent('new-comment');
      this.comment.patchValue('');
      this.showCommentBox = false;
    });
  }
}
