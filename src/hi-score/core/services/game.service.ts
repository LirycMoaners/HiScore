import { Injectable } from '@angular/core';

import { Game } from '../../shared/models/game.model';
import { Observable, of } from 'rxjs';
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

  constructor() {}

  /**
   * Get an observable of all games in a list
   *
   * @returns {Observable<Game[]>}
   * @memberof GameService
   */
  public getGameList(): Observable<Game[]> {
    const games: Game[] = JSON.parse(localStorage.getItem('games'));
    return of(games
      ? games.map((game: Game) => {
        game.date = new Date(game.date);
        return game;
      }).sort((g1: Game, g2: Game) => g1.date < g2.date ? 1 : -1)
      : []
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
   * @returns {Observable<void>}
   * @memberof GameService
   */
  public createGame(game: Game): Observable<void> {
    return this.getGameList()
      .pipe(
        map((gameList: Game[]) => {
          gameList.push(game);
          localStorage.setItem('games', JSON.stringify(gameList));
        })
      );
  }

  /**
   * Modify a game
   *
   * @param {Game} newGame
   * @returns {Observable<void>}
   * @memberof GameService
   */
  public updateGame(newGame: Game): Observable<void> {
    return this.getGameList()
      .pipe(
        map((gameList: Game[]) => {
          const oldGame: Game = gameList.find((game: Game) => game.id === newGame.id);
          gameList.splice(gameList.indexOf(oldGame), 1, newGame);
          localStorage.setItem('games', JSON.stringify(gameList));
        })
      );
  }
}
