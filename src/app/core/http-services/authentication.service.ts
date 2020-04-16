import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { of, Observable, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Plugins, registerWebPlugin, WebPlugin } from '@capacitor/core';
import '@codetrix-studio/capacitor-google-auth';
import { FacebookLoginResponse, FacebookLogin } from '@rdlabo/capacitor-facebook-login';

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
  ) {
    registerWebPlugin(FacebookLogin as unknown as WebPlugin);
  }

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
   * Log in with a third party provider
   */
  public signInWithProvider(provider: 'facebook' | 'google'): Observable<void> {
    switch (provider) {
      case 'facebook':
        return this.signInWithFacebook();
      case 'google':
        return this.signInWithGoogle();
      default:
        return of(null);
    }
  }

  /**
   * Log in with Google provider
   */
  private signInWithGoogle(): Observable<void> {
    return from(Plugins.GoogleAuth.signIn()).pipe(
      flatMap((googleUser: any) => {
        const credential = auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
        return from(this.fireAuth.signInAndRetrieveDataWithCredential(credential));
      }),
      flatMap((res) => res.additionalUserInfo.isNewUser ? this.userService.updateProfile(res.user, null, null, true) : of(null))
    );
  }

  /**
   * Log in with Facebook provider
   */
  private signInWithFacebook(): Observable<void> {
    const facebookPermissions = ['email'];
    return from(Plugins.FacebookLogin.login({ permissions: facebookPermissions })).pipe(
      flatMap((facebookLoginResponse: FacebookLoginResponse) => {
        const credential = auth.FacebookAuthProvider.credential(facebookLoginResponse.accessToken.token);
        return from(this.fireAuth.signInAndRetrieveDataWithCredential(credential));
      }),
      flatMap((res) => res.additionalUserInfo.isNewUser ? this.userService.updateProfile(res.user, null, null, true) : of(null))
    );
  }
}
