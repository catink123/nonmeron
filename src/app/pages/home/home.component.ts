import { AfterViewChecked, AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PageScrollService } from 'src/app/page-scroll.service';
import { Post, PostService } from 'src/app/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewChecked {
  posts: Post[] = [];
  isLoading = true;

  constructor(private postService: PostService, private title: Title, private scrollService: PageScrollService) {
    title.setTitle('Главная Non&Meron');
    postService.getPosts().subscribe(posts => {
      this.isLoading = true;
      this.posts = posts.sort((a, b) =>
        a.timestamp.toDate().getTime() > b.timestamp.toDate().getTime() ? -1 : 1
      );
      this.isLoading = false;
      scrollService.restoreSavedPosition();
    });
  }

  ngAfterViewChecked(): void {
    this.scrollService.restoreSavedPosition();
  }
}
