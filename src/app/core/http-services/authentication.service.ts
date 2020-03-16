import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import { User, auth, storage } from 'firebase/app';

@Injectable()
export class AuthenticationService {
  user: User;

  constructor() {
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
    });
  }

  signUp(email: string, password: string, username: string, picture?: File) {
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

  updateEmail(user: User, email: string) {
    return user.updateEmail(email);
  }

  updatePassword(user: User, password: string) {
    return user.updatePassword(password);
  }

  signOut() {
    firebase.auth().signOut();
  }

  delete(user: User) {
    return user.delete();
  }

  async updateProfile(user: User, newUsername?: string, newPicture?: File) {
    const updatedProfile: any = {};
    if (newPicture) {
      updatedProfile.photoURL = await this.updateProfilePicture(user.uid, newPicture);
    }
    if (newUsername) {
      updatedProfile.displayName = newUsername;
    }
    return user.updateProfile(updatedProfile);
  }

  private updateProfilePicture(userId: string, file: File) {
    const storageRef = firebase.storage().ref();
    const path = `/profile/${userId}.jpg`;
    const ref = storageRef.child(path);

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
