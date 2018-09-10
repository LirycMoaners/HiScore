import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GameCategory } from './game-category.model';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map, flatMap } from 'rxjs/operators';

/**
 * Service for every action about game categories
 *
 * @export
 * @class GameCategoryService
 */
@Injectable()
export class GameCategoryService {
  constructor(
    protected localStorage: LocalStorage
  ) { }

  /**
   * Get an observable of all game categories in a list
   *
   * @returns {Observable<GameCategory[]>}
   * @memberof GameCategoryService
   */
  public getGameCategoryList(): Observable<GameCategory[]> {
    return this.localStorage.getItem<GameCategory[]>('gameCategories')
      .pipe(
        map((gameCategoryList: GameCategory[]) => gameCategoryList || [])
      );
  }

  /**
   * Get an observable of a game category find by its id
   *
   * @param {string} id
   * @returns {Observable<GameCategory>}
   * @memberof GameCategoryService
   */
  public getGameCategoryById(id: string): Observable<GameCategory> {
    return this.getGameCategoryList()
      .pipe(
        map((gameCategoryList: GameCategory[]) => gameCategoryList.find((gameCategory: GameCategory) => gameCategory.id === id))
      );
  }

  /**
   * Create a new game category
   *
   * @param {GameCategory} gameCategory
   * @returns {Observable<boolean>}
   * @memberof GameCategoryService
   */
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
