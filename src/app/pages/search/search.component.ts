import { Component } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Post, PostService } from 'src/app/post.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  isLoading = true;
  filteredPosts: Post[] = [];
  tags: string[] = [];
  searchParamsForm = this.fb.group({
    title: [''],
    tags: ['']
  })

  constructor(
    private postService: PostService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    private analytics: AngularFireAnalytics,
    private title: Title
  ) {
    title.setTitle('Поиск');
    route.queryParams.subscribe(params => {
      this.isLoading = true;
      const tags = params['tag'];
      if (typeof tags === 'string') 
        this.tags = [tags];
      else 
        this.tags = tags;
      analytics.logEvent('search-used', {tags});
      postService.searchPosts(this.tags).onSnapshot(qSnapshot => {
        this.filteredPosts = [];
        qSnapshot.forEach(postSnapshot => {
          this.filteredPosts.push(postSnapshot!.data());
        });
        this.filteredPosts = this.filteredPosts.sort((a, b) =>
          a.timestamp.toDate().getTime() > b.timestamp.toDate().getTime() ? -1 : 1
        );
        this.isLoading = false;
      })
    })
  }

  submitSearch() {

  }

  help() {
    alert('Теги пишутся через запятую, в название вписывается название поста')
  }
}
