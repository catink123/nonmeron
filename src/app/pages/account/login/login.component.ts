import { Component } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.required]
  });
  error = '';

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private router: Router, 
    private analytics: AngularFireAnalytics,
    private title: Title
  ) {
    title.setTitle('Вход');
    authService.auth.authState.subscribe(user => {
      if (user) router.navigateByUrl('/account');
    });
  }

  onSubmit() {
    const {email, password} = this.loginForm.value;
    this.authService.login(email, password)
      .then(() => {
        this.analytics.logEvent('log-in');
        this.router.navigateByUrl('/account');
      })
      .catch(reason => {
        switch(reason.code) {
          case 'auth/invalid-email':
            this.error = 'Некорректный Email!';
            break;
          case 'auth/wrong-password':
            this.error = 'Неправильный пароль!';
            break;
          case 'auth/too-many-requests':
            this.error = 'Слишком много попыток входа, аккаунт временно заблокирован. Попробуйте войти позже или сбросьте пароль.';
            break;
          default:
            this.error = 'Неизвестная ошибка.';
            break;
        }
      })
  }

}
