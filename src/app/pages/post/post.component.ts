import { Component } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { Comment, PostService } from 'src/app/post.service';

export interface FormattedComment {
  email: string;
  nickname: string;
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  loading = true;
  id = '';
  title = '';
  body = '';
  timestamp: Date = new Date(0);
  // Comments
  commentsLoading = true;
  comments: { comment: FormattedComment, isAuthor: boolean, id: string }[] = [];
  // Image
  imageLoading = true;
  imageURL = '';

  tags: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    private authService: AuthService,
    private analytics: AngularFireAnalytics,
    private titleService: Title
  ) {
    titleService.setTitle('Пост');
    const id = route.snapshot.params['id'];
    this.id = id;
    (async () => {
      try {
        const doc = await postService.getPost(id);
        analytics.logEvent('post-opened');

        const val = doc.data();
        this.title = val!.title;
        if (this.title.length > 0) titleService.setTitle('Пост: ' + val!.title);
        this.body = val!.description;
        this.tags = val!.tags;
        this.timestamp = val!.timestamp.toDate();
        this.loading = false;

        // Get Comments
        const commsRef = await postService.getComments(id);
        const commsSnapshotCallback = async (comms: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
          this.comments = [];
          for (const comm of comms.docs) {
            const { userID, text, timestamp } = comm.data() as Comment;
            const commentID = comm.id;

            const user = await authService.getUser(userID);
            let nickname = 'Неизвестный пользователь';
            let email = userID;
            if (user) nickname = user!.nickname;
            else email = 'скрытый Email';
            const currentUser = await authService.auth.currentUser;

            this.comments.push({
              comment: {
                nickname, email, text,
                timestamp: timestamp.toDate() as Date
              },
              isAuthor: currentUser?.email === email ?? false,
              id: commentID
            });
            this.comments = this.comments.sort((a, b) =>
              a.comment.timestamp.getTime() > b.comment.timestamp.getTime() ? -1 : 1
            );
          }
          this.commentsLoading = false;
        };
        commsRef.onSnapshot(commsSnapshotCallback);

        const onFail = (reason?: any) => {
          if (reason) console.log("Couldn't load the image with reason:", reason);
          this.imageURL = '/assets/unknown.svg';
          this.imageLoading = false;
        };
        // Get full-sized image for display
        await postService
          .getFullImage(id)
          .getDownloadURL()
          .subscribe(url => {
            this.imageURL = url;
            this.imageLoading = false;
          }, onFail);
      } catch (error) {
        console.log('Cannot get post:', error);
        router.navigateByUrl('/404');
      }
    })();
  }
}
