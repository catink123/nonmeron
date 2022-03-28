import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GoogleAuthProvider } from 'firebase/auth';

export interface User {
  nickname: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth, private afs: AngularFirestore, private analytics: AngularFireAnalytics) { }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.auth.signOut();
    this.analytics.logEvent('log-out');
  }

  setNickname(nickname: string) {
    this.auth.currentUser.then(user => {
      if (user)
        return this.afs.collection('users').doc(user.email!).set({ nickname });
      else
        return null;
    })
  }

  getUser(email: string) {
    return new Promise<User | undefined>((resolve, reject) => {
      this.afs.collection<User>('users').doc(email).get().subscribe(snapshot => {
        resolve(snapshot.data());
      })
    });
  }

  get isCurrentUserAdmin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.auth.currentUser.then(user => {
          if (user)
            resolve(
              (
                user.email! === 'qwerty.qaz120@gmail.com'
                ||
                user.email! === 'sdohnuvmukah@gmail.com'
              )
              ? true : false
            )
          else
            reject('User is not logged in!')
      })
    })
  }
}
