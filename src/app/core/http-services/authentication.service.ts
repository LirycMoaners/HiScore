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
          let downloadUrl: string;
          if (picture) {
            downloadUrl = await this.updateProfilePicture(res.user.uid, picture);
          }
          res.user.updateProfile({
            displayName: username,
            photoURL: downloadUrl
          }).then(
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

  signOut() {
    firebase.auth().signOut();
  }

  updateProfilePicture(userId: string, file: File) {
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
