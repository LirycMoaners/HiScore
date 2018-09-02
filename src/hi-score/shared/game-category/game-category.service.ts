import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GameCategory } from './game-category.model';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, flatMap } from 'rxjs/operators';

@Injectable()
export class GameCategoryService {
  constructor(
    protected localStorage: LocalStorage
  ) { }

  public getGameCategoryList(): Observable<GameCategory[]> {
    return this.localStorage.getItem<GameCategory[]>('gameCategories')
      .pipe(
        map((gameCategoryList: GameCategory[]) => gameCategoryList || [])
      );
  }

  public getGameCategoryById(id: string): Observable<GameCategory> {
    return this.getGameCategoryList()
      .pipe(
        map((gameCategoryList: GameCategory[]) => gameCategoryList.find((gameCategory: GameCategory) => gameCategory.id === id))
      );
  }

  public createGameCategory(gameCategory: GameCategory): Observable<boolean> {
    return this.getGameCategoryList()
      .pipe(
        flatMap((gameCategoryList: GameCategory[]) => {
          gameCategoryList.push(gameCategory);
          return this.localStorage.setItem('gameCategories', gameCategoryList);
        })
      );
  }
}
