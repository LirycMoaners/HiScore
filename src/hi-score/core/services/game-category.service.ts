import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { GameCategory } from '../../shared/models/game-category.model';
import { map, flatMap } from 'rxjs/operators';

/**
 * Service for every action about game categories
 *
 * @export
 */
@Injectable()
export class GameCategoryService {
  constructor() { }

  /**
   * Get an observable of all game categories in a list
   */
  public getGameCategoryList(): Observable<GameCategory[]> {
    const gameCategories: GameCategory[] = JSON.parse(localStorage.getItem('gameCategories'));
    return of(gameCategories ? gameCategories : []);
  }

  /**
   * Get an observable of a game category find by its id
   */
  public getGameCategoryById(id: string): Observable<GameCategory> {
    return this.getGameCategoryList()
      .pipe(
        map((gameCategoryList: GameCategory[]) => gameCategoryList.find((gameCategory: GameCategory) => gameCategory.id === id))
      );
  }

  /**
   * Create a new game category
   */
  public createGameCategory(gameCategory: GameCategory): Observable<void> {
    return this.getGameCategoryList()
      .pipe(
        map((gameCategoryList: GameCategory[]) => {
          gameCategoryList.push(gameCategory);
          localStorage.setItem('gameCategories', JSON.stringify(gameCategoryList));
        })
      );
  }
}
