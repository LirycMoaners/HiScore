import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User, storage } from 'firebase/app';
import { Observable, of, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Player } from '../../shared/models/player.model';
import { PlayerService } from './player.service';

@Injectable()
export class UserService {

  /**
   * Current logged in user
   */
  public user: User;

  constructor(
    private readonly fireAuth: AngularFireAuth,
    private readonly fireStorage: AngularFireStorage,
    private readonly firestore: AngularFirestore,
    private readonly playerService: PlayerService
  ) {
    this.fireAuth.user.subscribe(user => this.user = user);
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
    return obs.pipe(
      flatMap(() => this.playerService.deleteElement(new Player(user))),
      flatMap(() => from(this.firestore.collection('userDatas').doc(user.uid).delete())),
      flatMap(() => from(user.delete()))
    );
  }

  /**
   * Update username and/or user's picture
   */
  public updateProfile(user: User, newUsername?: string, newPicture?: File, isNewUser = false): Observable<void> {
    const updatedProfile: Player = new Player(user);
    let updatePhoto$: Observable<string>;
    if (newUsername) {
      updatedProfile.displayName = newUsername;
    }
    if (newPicture) {
      updatePhoto$ = this.updateProfilePicture(user.uid, newPicture);
    } else {
      updatePhoto$ = of(null);
    }
    return updatePhoto$.pipe(
      flatMap(photoURL => {
        if (photoURL) {
          updatedProfile.photoURL = photoURL;
        }
        return from(user.updateProfile(updatedProfile));
      }),
      flatMap(() =>
        isNewUser ? this.playerService.createElement(updatedProfile) : this.playerService.updateElement(updatedProfile)
      )
    );
  }

  /**
   * Check if user's providers contain the one in parameter
   */
  public isProvider(provider: string): boolean {
    return this.user.providerData.some(p => p.providerId === provider);
  }

  /**
   * Update user's picture
   */
  private updateProfilePicture(userId: string, file: File): Observable<string> {
    const ref = this.fireStorage.ref(`profile/${userId}/profile_picture.jpg`);

    return from(ref.put(file)).pipe(
      flatMap(snapshot => {
        if (snapshot.state === storage.TaskState.SUCCESS) {
          return ref.getDownloadURL();
        }
      })
    );
  }
}
