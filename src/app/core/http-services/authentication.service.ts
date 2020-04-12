import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { of, Observable, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserService } from './user.service';

/**
 * Service for every action about authentication & account
 *
 * @export
 */
@Injectable()
export class AuthenticationService {

  constructor(
    private readonly fireAuth: AngularFireAuth,
    private readonly userService: UserService
  ) { }

  /**
   * Create an email & password account
   */
  public signUp(email: string, password: string, username: string, picture?: File): Observable<void> {
    return from(this.fireAuth.createUserWithEmailAndPassword(email, password)).pipe(
      flatMap(res => this.userService.updateProfile(res.user, username, picture, true))
    );
  }

  /**
   * Log in with email & password
   */
  public signIn(email: string, password: string): Observable<auth.UserCredential> {
    return from(this.fireAuth.signInWithEmailAndPassword(email, password));
  }

  /**
   * Log in with Google account
   */
  public signInWithGoogle(): Observable<void> {
    return this.signInWithProvider(new auth.GoogleAuthProvider());
  }

  /**
   * Log out
   */
  public signOut() {
    this.fireAuth.signOut();
  }

  /**
   * Send an email when the user forgot his passowrd
   */
  public forgotPassword(email: string) {
    return this.fireAuth.sendPasswordResetEmail(email)
  }

  /**
   * Log in with a provider (Google, Facebook, ...)
   */
  private signInWithProvider(provider: auth.AuthProvider): Observable<void> {
    return from(this.fireAuth.signInWithPopup(provider)).pipe(
      flatMap(res => res.additionalUserInfo.isNewUser ? this.userService.updateProfile(res.user, null, null, true) : of(null))
    );
  }
}
