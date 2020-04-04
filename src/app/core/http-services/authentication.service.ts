import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { User, auth, storage } from 'firebase';
import { of, Observable, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';

/**
 * Service for every action about authentication & account
 *
 * @export
 */
@Injectable()
export class AuthenticationService {

  /**
   * Current logged in user
   */
  public user: User;

  constructor(
    private readonly fireAuth: AngularFireAuth,
    private readonly fireStorage: AngularFireStorage
  ) {
    this.fireAuth.user.subscribe(user => this.user = user);
  }

  /**
   * Create an email & password account
   */
  public signUp(email: string, password: string, username: string, picture?: File) {
    return new Promise<any>((resolve, reject) =>
      this.fireAuth.createUserWithEmailAndPassword(email, password).then(
        async res => {
          this.updateProfile(res.user, username, picture).then(
            () => {
              resolve(res);
            }, (error) => {
              reject(error);
            }
          );
        }, error => {
          reject(error);
        }
      )
    );
  }

  /**
   * Log in with email & password
   */
  public signIn(email: string, password: string) {
    return new Promise<any>((resolve, reject) =>
      this.fireAuth.signInWithEmailAndPassword(email, password).then(
        res => {
          resolve(res);
        }, error => {
          reject(error);
        }
      )
    );
  }

  /**
   * Log in with Google account
   */
  public signInWithGoogle() {
    return this.signInWithProvider(new auth.GoogleAuthProvider());
  }

  /**
   * Log out
   */
  public signOut() {
    this.fireAuth.signOut();
  }

  /**
   * Update account email address
   */
  public async updateEmail(user: User, email: string) {
    await user.updateEmail(email);
  }

  /**
   * Update account password
   */
  public async updatePassword(user: User, password: string) {
    await user.updatePassword(password);
  }

  /**
   * Delete user account
   */
  public delete(user: User): Observable<void> {
    const obs = of(null);
    if (user.photoURL && user.providerId === 'firebase') {
      const ref = this.fireStorage.ref(`profile/${user.uid}/profile_picture.jpg`);
      obs.pipe(flatMap(() => ref.delete()));
    }
    return obs.pipe(flatMap(() => from(user.delete())));
  }

  /**
   * Update username and/or user's picture
   */
  public async updateProfile(user: User, newUsername?: string, newPicture?: File) {
    const updatedProfile: any = {};
    if (newPicture) {
      updatedProfile.photoURL = await this.updateProfilePicture(user.uid, newPicture);
    }
    if (newUsername) {
      updatedProfile.displayName = newUsername;
    }
    return user.updateProfile(updatedProfile);
  }

  /**
   * Check if user's providers contain the one in parameter
   */
  public isProvider(provider: string) {
    return this.user.providerData.some(p => p.providerId === provider);
  }

  /**
   * Log in with a provider (Google, Facebook, ...)
   */
  private signInWithProvider(provider: auth.AuthProvider) {
    return new Promise<any>((resolve, reject) =>
      this.fireAuth.signInWithPopup(provider).then(
        res => {
          resolve(res);
        }, error => {
          reject(error);
        }
      )
    );
  }

  /**
   * Update user's picture
   */
  private updateProfilePicture(userId: string, file: File) {
    const ref = this.fireStorage.ref(`profile/${userId}/profile_picture.jpg`);

    return new Promise<any>((resolve, reject) =>
      ref.put(file).then(
        snapshot => {
          if (snapshot.state === storage.TaskState.SUCCESS) {
            resolve(ref.getDownloadURL());
          }
        },
        (error) => reject(error)
      )
    );
  }
}
