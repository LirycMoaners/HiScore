import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { User, auth } from 'firebase/app';

@Injectable()
export class AuthenticationService {
  user: User;

  constructor() {
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
    });
  }

  signUp(email: string, password: string) {
    return new Promise<any>((resolve, reject) =>
      firebase.auth().createUserWithEmailAndPassword(email, password).then(
        res => {
          resolve(res);
        }, error => {
          reject(error);
        }
      )
    );
  }

  signIn(email: string, password: string) {
    return new Promise<any>((resolve, reject) =>
      firebase.auth().signInWithEmailAndPassword(email, password).then(
        res => {
          resolve(res);
        }, error => {
          reject(error);
        }
      )
    );
  }

  signInWithGoogle() {
    return this.signInWithProvider(new auth.GoogleAuthProvider());
  }

  signOut() {
    firebase.auth().signOut();
  }

  private signInWithProvider(provider: auth.AuthProvider) {
    return new Promise<any>((resolve, reject) =>
      firebase.auth().signInWithPopup(provider).then(
        res => {
          resolve(res);
        }, error => {
          reject(error);
        }
      )
    );
  }
}
