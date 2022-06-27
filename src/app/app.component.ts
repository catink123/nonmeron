import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import {animate, animateChild, group, query, state, style, transition, trigger} from '@angular/animations';
import { ChildrenOutletContexts } from '@angular/router';

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
    /* trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter', [
          style({
            transform: 'translateX(-100%)'
          })
        ]),
        query(':leave', animateChild()),
        group([
          query(':leave', [
            animate('.25s ease', style({
              transform: 'translateX(100%)'
            }))
          ]),
          query(':enter', [
            animate('.25s ease', style({
              transform: 'translateX(0%)'
            }))
          ]),
          query('@*', animateChild())
        ])
      ])
    ]) */
  ]
})
export class AppComponent {
  isAdmin = false;
  showWelcomeWindow = false;
  constructor (private authService: AuthService, private contexts: ChildrenOutletContexts) {
    authService.auth.authState.subscribe(user => {
      if (user)
        authService.isCurrentUserAdmin.then(value => this.isAdmin = value);
      else 
        this.isAdmin = false;
    });
    const savedSWW = localStorage.getItem('nonmeron-welcomemsg-shown');
    if (!savedSWW) this.showWelcomeWindow = true;
  }

  confirmWelcomeWindow() {
    localStorage.setItem('nonmeron-welcomemsg-shown', JSON.stringify(true));
    this.showWelcomeWindow = false;
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
