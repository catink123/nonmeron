import { Component } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiselectEntry } from 'src/app/components/multiselect/multiselect.component';
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
  });
  selectedTags: MultiselectEntry[] = [];

  constructor(
    private postService: PostService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    private analytics: AngularFireAnalytics,
    private title: Title,
    private router: Router
  ) {
    title.setTitle('Поиск');
    route.queryParams.subscribe(params => {
      this.isLoading = true;
      const tags = params['tag'];
      if (typeof tags === 'string') 
        this.tags = [tags];
      else if (typeof tags === 'undefined')
        this.tags = [];
      else
        this.tags = tags;
      
      postService.getTags().subscribe(tags => {
        this.selectedTags = tags.map(val => ({label: val, value: val, checked: this.tags.includes(val)}));
      });
      analytics.logEvent('search-used', {tags});
      if (this.tags.length > 0) {
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
      } else {
        this.isLoading = false;
      }
    })
  }

  submitSearch() {
    const tags = this.selectedTags.filter(val => val.checked).map(val => val.value);
    this.router.navigate(['search'], {
      queryParams: {
        tag: tags
      }
    })
  }

  help() {
    alert('Теги пишутся через запятую, в название вписывается название поста')
  }

  log(event: any) {
    console.log(event);
  }
}
