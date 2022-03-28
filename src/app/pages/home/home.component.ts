import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Post, PostService } from 'src/app/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  posts: Post[] = [];
  isLoading = true;

  constructor(private postService: PostService, private title: Title) {
    title.setTitle('Главная Non&Meron');
    postService.getPosts().subscribe(posts => {
      this.isLoading = true;
      this.posts = posts.sort((a, b) =>
        a.timestamp.toDate().getTime() > b.timestamp.toDate().getTime() ? -1 : 1
      );
      this.isLoading = false;
    });
  }
}
