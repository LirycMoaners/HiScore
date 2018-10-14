import { Injectable } from '@angular/core';

import { Game } from './game.model';
import { Observable } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { flatMap, map } from 'rxjs/operators';

/**
 * Service for every action about games
 *
 * @export
 * @class GameService
 */
@Injectable()
export class GameService {
  /**
   * The current game id
   *
   * @public
   * @type {string}
   * @memberof GameService
   */
  public currentGameId: string;

  constructor(
    protected localStorage: LocalStorage
  ) {}

  /**
   * Get an observable of all games in a list
   *
   * @returns {Observable<Game[]>}
   * @memberof GameService
   */
  public getGameList(): Observable<Game[]> {
    return this.localStorage.getItem<Game[]>('games')
      .pipe(
        map((gameList: Game[]) => gameList ? gameList.sort((g1: Game, g2: Game) => g1.date < g2.date ? 1 : -1) : [])
      );
  }

  /**
   * Get an observable of a game find by its id
   *
   * @param {string} id
   * @returns {Observable<Game>}
   * @memberof GameService
   */
  public getGameById(id: string): Observable<Game> {
    return this.getGameList()
      .pipe(
        map((gameList: Game[]) => gameList.find((game: Game) => game.id === id))
      );
  }

  /**
   * Create a new game
   *
   * @param {Game} game
   * @returns {Observable<boolean>}
   * @memberof GameService
   */
  public createGame(game: Game): Observable<boolean> {
    return this.getGameList()
      .pipe(
        flatMap((gameList: Game[]) => {
          gameList.push(game);
          return this.localStorage.setItem('games', gameList);
        })
      );
  }

  /**
   * Modify a game
   *
   * @param {Game} newGame
   * @returns {Observable<boolean>}
   * @memberof GameService
   */
  public updateGame(newGame: Game): Observable<boolean> {
    return this.getGameList()
      .pipe(
        flatMap((gameList: Game[]) => {
          const oldGame: Game = gameList.find((game: Game) => game.id === newGame.id);
          gameList.splice(gameList.indexOf(oldGame), 1, newGame);
          return this.localStorage.setItem('games', gameList);
        })
      );
  }
}
