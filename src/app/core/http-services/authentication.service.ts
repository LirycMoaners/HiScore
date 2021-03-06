import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { of, Observable, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Plugins, registerWebPlugin, WebPlugin } from '@capacitor/core';
import '@codetrix-studio/capacitor-google-auth';
import { FacebookLoginResponse, FacebookLogin } from '@capacitor-community/facebook-login';

import { UserService } from './user.service';
import { Authentication } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';

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
  public signUp(email: string, password: string, username: string, img?: HTMLImageElement): Observable<void | null> {
    return from(this.fireAuth.createUserWithEmailAndPassword(email, password)).pipe(
      flatMap(res => (!!res && !!res.user) ? this.userService.updateProfile(res.user, username, img, true) : of(null))
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
  public signOut(): void {
    this.fireAuth.signOut();
  }

  /**
   * Send an email when the user forgot his passowrd
   */
  public forgotPassword(email: string): Promise<void> {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  /**
   * Log in with a third party provider
   */
  public signInWithProvider(provider: 'facebook' | 'google'): Observable<void | null> {
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
  private signInWithGoogle(): Observable<void | null> {
    return from(Plugins.GoogleAuth.signIn({value: ''}) as Promise<{value: string, authentication: Authentication}>).pipe(
      flatMap((googleUser: {value: string, authentication: Authentication}) => {
        const credential = auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
        return from(this.fireAuth.signInAndRetrieveDataWithCredential(credential));
      }),
      flatMap((res) =>
        (!!res && !!res.user && !!res.additionalUserInfo && res.additionalUserInfo.isNewUser)
          ? this.userService.updateProfile(res.user, undefined, undefined, true)
          : of(null)
      )
    );
  }

  /**
   * Log in with Facebook provider
   */
  private signInWithFacebook(): Observable<void | null> {
    const facebookPermissions = ['email'];
    return (from(Plugins.FacebookLogin.login({ permissions: facebookPermissions })) as Observable<FacebookLoginResponse>).pipe(
      flatMap((facebookLoginResponse: FacebookLoginResponse) => {
        if (!!facebookLoginResponse && !!facebookLoginResponse.accessToken) {
          const credential = auth.FacebookAuthProvider.credential(facebookLoginResponse.accessToken.token);
          return from(this.fireAuth.signInAndRetrieveDataWithCredential(credential));
        }
        return of(null);
      }),
      flatMap((res) =>
        (!!res && !!res.user && !!res.additionalUserInfo && res.additionalUserInfo.isNewUser)
          ? this.userService.updateProfile(res.user, undefined, undefined, true)
          : of(null)
      )
    );
  }
}
