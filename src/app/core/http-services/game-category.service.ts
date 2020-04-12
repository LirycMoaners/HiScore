import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { GameCategory } from '../../shared/models/game-category.model';
import { FirstoreService } from './firestore.service';
import { UserService } from './user.service';

/**
 * Service for every action about game categories
 *
 * @export
 */
@Injectable()
export class GameCategoryService extends FirstoreService<GameCategory> {

  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService,
    private readonly firestore: AngularFirestore,
    auth: AngularFireAuth
  ) {
    super(
      auth,
      'gameCategories',
      () => this.firestore
        .collection('userDatas')
        .doc(this.userService.user.uid)
        .collection('gameCategories'),
      () => this.firestore
        .collection('userDatas')
        .doc(this.userService.user.uid)
        .collection('gameCategories', ref => ref.orderBy('name')),
      (gameCategory: GameCategory) => gameCategory,
      (g1: GameCategory, g2: GameCategory) => g1.name.localeCompare(g2.name)
    );
  }

  public getCommonGameCategories(): Observable<GameCategory[]> {
    return this.http.get<GameCategory[]>('assets/data/common-game-categories.json');
  }
}
