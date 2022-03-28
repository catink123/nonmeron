import { Component } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
// import { checkPasswords } from 'src/app/customValidators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  error = '';
  registerForm = this.formBuilder.group({
    email: ['', [Validators.pattern(/^\S*$/), Validators.email, Validators.required]],
    nickname: ['', Validators.required],
    /* passwordGroup: new FormGroup({
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    }, checkPasswords) */
    password: ['', Validators.required]
  });

  constructor(
    private authService: AuthService, 
    private formBuilder: FormBuilder, 
    private router: Router, 
    private afs: AngularFirestore,
    private analytics: AngularFireAnalytics,
    private title: Title
  ) {
    title.setTitle('Регистрация');
  }

  onSubmit() {
    // const { email, passwordGroup, nickname } = this.registerForm.value;
    const { email, password, nickname } = this.registerForm.value;
    const transformedEmail = email.toLowerCase();
    this.authService.auth.createUserWithEmailAndPassword(transformedEmail, /* passwordGroup. */password)
      .then(() => {
        this.afs.collection('users').doc(transformedEmail).set({nickname}).then(() => {
          this.analytics.logEvent('registration');
          this.router.navigateByUrl('/account');
        });
      })
      .catch(reason => {
        switch(reason.code) {
          case 'auth/email-already-in-use':
            this.error = 'Этот Email уже используется.'
            break;
          case 'auth/invalid-email':
            this.error = 'Некорректный Email!';
            break;
          case 'auth/weak-password':
            this.error = 'Слабый пароль.';
            break;
          default:
            this.error = 'Неизвестная ошибка.'
            break;
        }
      })
  }

}
