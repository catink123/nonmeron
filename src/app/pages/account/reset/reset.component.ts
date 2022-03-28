import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { checkPasswords } from 'src/app/customValidators';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent {
  email = new FormControl('', [Validators.email, Validators.required]);
  isSubmitted = false;

  // resetForm = new FormGroup({
  //   resetCode: new FormControl('', Validators.required),
  //   newPassword: new FormGroup({
  //     password: new FormControl('', Validators.required),
  //     confirmPassword: new FormControl('', Validators.required)
  //   }, checkPasswords)
  // });

  constructor(private authService: AuthService, private router: Router, private title: Title) {
    title.setTitle('Сброс пароля');
  }

  submit() {
    this.authService.auth.sendPasswordResetEmail(this.email.value).then(() => {this.isSubmitted = true});
  }

  // reset() {
  //   const {resetCode, newPassword} = this.resetForm.value;
  //   this.authService.auth.confirmPasswordReset(resetCode, newPassword).then(() => this.router.navigateByUrl('/login'));
  // }

}
