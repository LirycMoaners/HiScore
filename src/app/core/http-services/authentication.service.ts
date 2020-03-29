import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import { User, auth, storage } from 'firebase/app';

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

  constructor() {
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
    });
  }

  /**
   * Create an email & password account
   */
  public signUp(email: string, password: string, username: string, picture?: File) {
    return new Promise<any>((resolve, reject) =>
      firebase.auth().createUserWithEmailAndPassword(email, password).then(
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
      firebase.auth().signInWithEmailAndPassword(email, password).then(
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
    firebase.auth().signOut();
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
  public async delete(user: User) {
    if (user.photoURL && user.providerId === 'firebase') {
      const ref = firebase.storage().ref().child('profile').child(user.uid).child('profile_picture.jpg');
      await ref.delete();
    }
    await user.delete();
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
      firebase.auth().signInWithPopup(provider).then(
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
    const storageRef = firebase.storage().ref();
    const ref = storageRef.child('profile').child(userId).child('profile_picture.jpg');

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
