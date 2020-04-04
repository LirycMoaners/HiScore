import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { GameCategory } from '../../shared/models/game-category.model';
import { FirstoreService } from './firestore.service';
import { AuthenticationService } from './authentication.service';

/**
 * Service for every action about game categories
 *
 * @export
 */
@Injectable()
export class GameCategoryService extends FirstoreService<GameCategory> {

  constructor(
    private http: HttpClient,
    authenticationService: AuthenticationService,
    auth: AngularFireAuth,
    firestore: AngularFirestore
  ) {
    super(
      authenticationService,
      auth,
      'gameCategories',
      () => firestore
        .collection('userDatas')
        .doc(authenticationService.user.uid)
        .collection('gameCategories'),
      () => firestore
        .collection('userDatas')
        .doc(authenticationService.user.uid)
        .collection('gameCategories', ref => ref.orderBy('name')),
      (gameCategory: GameCategory) => gameCategory,
      (g1: GameCategory, g2: GameCategory) => g1.name.localeCompare(g2.name)
    );
  }

  public getCommonGameCategories(): Observable<GameCategory[]> {
    return this.http.get<GameCategory[]>('assets/data/common-game-categories.json');
  }
}
