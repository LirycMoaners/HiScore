import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { EndingType } from './ending-type.enum';
import { GameCategory } from './game-category.model';
import { Goal } from './goal.enum';

@Injectable()
export class GameCategoryService {
  private gameCategoryList: GameCategory[] = [
    {
      name: 'Uno',
      endingType: EndingType.point,
      endingNumber: 500,
      goal: Goal.lowestScore
    },
    {
      name: '6 qui prend',
      endingType: EndingType.point,
      endingNumber: 66,
      goal: Goal.lowestScore
    },
    {
      name: 'Roi des nains',
      endingType: EndingType.round,
      endingNumber: 7,
      goal: Goal.highestScore
    }
  ];

  constructor() { }

  public getGameCategoryList(): Observable<GameCategory[]> {
    return of(this.gameCategoryList);
  }

  public createGameCategory(gameCategory: GameCategory): Observable<GameCategory> {
    this.gameCategoryList.push(gameCategory);
    return of(gameCategory);
  }
}
