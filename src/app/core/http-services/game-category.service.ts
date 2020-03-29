import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, flatMap, first } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { GameCategory } from '../../shared/models/game-category.model';
import { Goal } from '../../shared/models/goal.enum';
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
    authenticationService: AuthenticationService
  ) {
    super(
      authenticationService,
      'gameCategories',
      () => firebase.firestore()
        .collection('userDatas')
        .doc(authenticationService.user.uid)
        .collection('gameCategories'),
      () => this.firestoreCollection().orderBy('name'),
      (gameCategory: GameCategory) => gameCategory,
      (g1: GameCategory, g2: GameCategory) => g1.name.localeCompare(g2.name)
    );

    const noGameCategory: GameCategory = {
      id: 'no-category',
      name: 'A Game',
      goal: Goal.highestScore,
      endingNumber: null,
      endingType: null,
      isSynced: false
    };

    this.getElementById(noGameCategory.id).pipe(
      flatMap(gameCategory => !gameCategory ? this.createElement(noGameCategory) : of(null))
    ).subscribe();
  }
}
