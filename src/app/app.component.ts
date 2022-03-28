import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { PostService } from './post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  tags: Observable<string[]>;
  isAdmin = false;
  constructor (private postService: PostService, private authService: AuthService) {
    this.tags = postService.getTags();
    authService.auth.authState.subscribe(user => {
      if (user)
        authService.isCurrentUserAdmin.then(value => this.isAdmin = value);
      else 
        this.isAdmin = false;
    })
  }
}
