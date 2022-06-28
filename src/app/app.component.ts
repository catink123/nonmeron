import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import {animate, animateChild, group, query, state, style, transition, trigger} from '@angular/animations';
import { ChildrenOutletContexts } from '@angular/router';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('welcomeScreen', [
      transition(':enter', [
        style({
          opacity: 0
        }),
        query('div.message', [
          style({
            opacity: 0,
            transform: 'translateY(-100%)'
          })
        ]),
        group([
          animate('0.25s ease', style({
            opacity: 1
          })),
          query('div.message', [
            animate('0.25s ease-out', style({
              transform: 'translateY(0%)',
              opacity: 1
            }))
          ]),
        ])
      ]),
      transition(':leave', [
        style({
          opacity: 1
        }),
        group([
          query('div.message', [
            animate('0.25s ease-in', style({
              transform: 'translateY(100%)',
              opacity: 0
            })),
          ]),
          animate('0.25s ease', style({
            opacity: 0
          }))
        ])
      ])
    ]),
  ]
})
export class AppComponent {
  isAdmin = false;
  showWelcomeWindow = false;
  nickname = '';

  showToolbarLabels = true;
  constructor (
    private authService: AuthService, 
    private contexts: ChildrenOutletContexts, 
    private breakpointObserver: BreakpointObserver
  ) {
    authService.auth.authState.subscribe(user => {
      if (user) {
        authService.isCurrentUserAdmin.then(value => this.isAdmin = value);
        authService.getUser(user.email!).then(userData => {
          if (userData) this.nickname = userData.nickname;
        })
      }
      else {
        this.isAdmin = false;
        this.nickname = '';
      }
    });
    const savedSWW = localStorage.getItem('nonmeron-welcomemsg-shown');
    if (!savedSWW) this.showWelcomeWindow = true;

    // For toolbar labels
    breakpointObserver.observe('(max-width: 720px)').subscribe(bpState => 
      this.showToolbarLabels = !bpState.matches
    );
  }

  confirmWelcomeWindow() {
    localStorage.setItem('nonmeron-welcomemsg-shown', JSON.stringify(true));
    this.showWelcomeWindow = false;
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
