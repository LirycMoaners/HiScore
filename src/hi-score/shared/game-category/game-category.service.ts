import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { EndingType } from './ending-type.enum';
import { GameCategory } from './game-category.model';
import { Goal } from './goal.enum';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, flatMap } from 'rxjs/operators';

@Injectable()
export class GameCategoryService {
  // private gameCategoryList: GameCategory[] = [
  //   {
  //     id: '1',
  //     name: 'Uno',
  //     endingType: EndingType.point,
  //     endingNumber: 500,
  //     goal: Goal.lowestScore
  //   },
  //   {
  //     id: '2',
  //     name: '6 qui prend',
  //     endingType: EndingType.point,
  //     endingNumber: 66,
  //     goal: Goal.lowestScore
  //   },
  //   {
  //     id: '3',
  //     name: 'Roi des nains',
  //     endingType: EndingType.round,
  //     endingNumber: 7,
  //     goal: Goal.highestScore
  //   }
  // ];

  constructor(
    protected localStorage: LocalStorage
  ) { }

  public getGameCategoryList(): Observable<GameCategory[]> {
    return this.localStorage.getItem<GameCategory[]>('gameCategories');
    // return of(this.gameCategoryList);
  }

  public getGameCategoryById(id: string): Observable<GameCategory> {
    return this.getGameCategoryList()
      .pipe(
        map((gameCategoryList: GameCategory[]) => gameCategoryList.find((gameCategory: GameCategory) => gameCategory.id === id))
      );
    // return of(this.gameCategoryList.find((gameCategory: GameCategory) => gameCategory.id === id));
  }

  public createGameCategory(gameCategory: GameCategory): Observable<boolean> {
    return this.getGameCategoryList()
      .pipe(
        flatMap((gameCategoryList: GameCategory[]) => {
          if (gameCategoryList) {
            gameCategoryList.push(gameCategory);
          } else {
            gameCategoryList = [];
          }
          return this.localStorage.setItem('gameCategories', gameCategoryList);
        })
      );
    // this.gameCategoryList.push(gameCategory);
    // return of(gameCategory);
  }
}
