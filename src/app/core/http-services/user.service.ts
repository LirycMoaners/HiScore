import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '@firebase/auth-types';
import { Observable, of, from, forkJoin } from 'rxjs';
import { flatMap, catchError } from 'rxjs/operators';

import { Player } from '../../shared/models/player.model';
import { PlayerService } from './player.service';
import { ImageResizer } from 'src/app/shared/tools/image-resizer';

@Injectable()
export class UserService {

  /**
   * Current logged in user
   */
  public user!: User | null;

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
  public async updateEmail(email: string): Promise<void> {
    await (!!this.user ? this.user.updateEmail(email) : Promise.resolve());
  }

  /**
   * Update account password
   */
  public async updatePassword(password: string): Promise<void> {
    await (!!this.user ? this.user.updatePassword(password) : Promise.resolve());
  }

  /**
   * Delete user account
   */
  public deleteProfile(): Observable<void> {
    if (!!this.user) {
      let obs = of(null);
      if (!!this.user.photoURL) {
        const ref = this.fireStorage.ref(`profile/${this.user.uid}/picture`);
        obs = obs.pipe(
          flatMap(() => ref.delete().pipe(catchError(() => of(null))))
        );
      }
      return obs.pipe(
        flatMap(() => !!this.user ? this.playerService.deleteElement(new Player(this.user)) : of()),
        flatMap(() => forkJoin([
          from(this.firestore.collection('userDatas').doc(this.user ? this.user.uid : undefined).collection('gameCategories').get()),
          from(this.firestore.collection('userDatas').doc(this.user ? this.user.uid : undefined).collection('nonUserPlayers').get())
        ])),
        flatMap(([gameCategoriesQuerySnapshot, nonUserPlayersQuerySnapshot]) => forkJoin([
          ...gameCategoriesQuerySnapshot.docs.map(doc => from(doc.ref.delete())),
          ...nonUserPlayersQuerySnapshot.docs.map(doc => from(doc.ref.delete())),
        ])),
        flatMap(() => from(this.firestore.collection('userDatas').doc(this.user ? this.user.uid : undefined).delete())),
        flatMap(() => from(this.user ? this.user.delete() : Promise.resolve()))
      );
    }
    return of();
  }

  /**
   * Update username and/or user's picture
   */
  public updateProfile(user: User, newUsername?: string, newImg?: HTMLImageElement, isNewUser = false): Observable<void> {
    const updatedProfile: Player = new Player(user);
    let updatePhoto$: Observable<string | undefined>;
    if (newUsername) {
      updatedProfile.displayName = newUsername;
    }
    if (newImg) {
      updatePhoto$ = this.updateProfilePicture(newImg);
    } else {
      updatePhoto$ = of(undefined);
    }
    return updatePhoto$.pipe(
      flatMap(photoURL => {
        if (!!photoURL) {
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
    return !!this.user && this.user.providerData.some(p => !!p && p.providerId === provider);
  }

  /**
   * Update user's picture
   */
  private updateProfilePicture(img: HTMLImageElement): Observable<string | undefined> {
    if (!!this.user) {
      const ref = this.fireStorage.ref(`profile/${this.user.uid}/picture`);

      return from(ref.putString(ImageResizer.resizeImage(img, 200, 200), 'data_url')).pipe(
        flatMap(snapshot => {
          if (snapshot.state === 'SUCCESS') {
            return ref.getDownloadURL();
          }
          return of(undefined);
        })
      );
    }
    return of(undefined);
  }
}
