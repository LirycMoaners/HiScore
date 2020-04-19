import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User, storage } from 'firebase/app';
import { Observable, of, from, forkJoin } from 'rxjs';
import { flatMap, catchError } from 'rxjs/operators';

import { Player } from '../../shared/models/player.model';
import { PlayerService } from './player.service';
import { UUID } from 'angular2-uuid';
import { ImageResizer } from 'src/app/shared/tools/image-resizer';

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
  public async updateEmail(email: string) {
    await this.user.updateEmail(email);
  }

  /**
   * Update account password
   */
  public async updatePassword(password: string) {
    await this.user.updatePassword(password);
  }

  /**
   * Delete user account
   */
  public deleteProfile(): Observable<void> {
    let obs = of(null);
    if (this.user.photoURL) {
      const ref = this.fireStorage.ref(`profile/${this.user.uid}/picture`);
      obs = obs.pipe(
        flatMap(() => ref.delete().pipe(catchError(() => of(null))))
      );
    }
    return obs.pipe(
      flatMap(() => this.playerService.deleteElement(new Player(this.user))),
      flatMap(() => forkJoin([
        from(this.firestore.collection('userDatas').doc(this.user.uid).collection('gameCategories').get()),
        from(this.firestore.collection('userDatas').doc(this.user.uid).collection('nonUserPlayers').get())
      ])),
      flatMap(([gameCategoriesQuerySnapshot, nonUserPlayersQuerySnapshot]) => forkJoin([
        ...gameCategoriesQuerySnapshot.docs.map(doc => from(doc.ref.delete())),
        ...nonUserPlayersQuerySnapshot.docs.map(doc => from(doc.ref.delete())),
      ])),
      flatMap(() => from(this.firestore.collection('userDatas').doc(this.user.uid).delete())),
      flatMap(() => from(this.user.delete()))
    );
  }

  /**
   * Update username and/or user's picture
   */
  public updateProfile(user: User, newUsername?: string, newImg?: HTMLImageElement, isNewUser = false): Observable<void> {
    const updatedProfile: Player = new Player(user);
    let updatePhoto$: Observable<string>;
    if (newUsername) {
      updatedProfile.displayName = newUsername;
    }
    if (newImg) {
      updatePhoto$ = this.updateProfilePicture(newImg);
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
  private updateProfilePicture(img: HTMLImageElement): Observable<string> {
    const ref = this.fireStorage.ref(`profile/${this.user.uid}/picture`);

    return from(ref.putString(ImageResizer.resizeImage(img, 200, 200), 'data_url')).pipe(
      flatMap(snapshot => {
        if (snapshot.state === storage.TaskState.SUCCESS) {
          return ref.getDownloadURL();
        }
      })
    );
  }
}
