import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {
  loading = true;
  isLoggedIn = false;

  nickname = 'Загрузка...';

  constructor(private authService: AuthService, private router: Router, private title: Title) {
    title.setTitle('Аккаунт');
    authService.auth.authState.subscribe(user => {
      if (user) {
        authService.getUser(user.email!).then(usr => {
          this.isLoggedIn = true;
          if (usr) {
            this.nickname = usr.nickname;
          }
        })
      } else {
        this.isLoggedIn = false;
      }
      this.loading = false;
    })
  }

  login() {
    this.router.navigate(['login']);
  }

  logout() {
    this.authService.logout();
  }
}
