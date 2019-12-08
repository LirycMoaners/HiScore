import { Injectable } from '@angular/core';

import { Player } from '../../shared/models/player.model';
import { Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

/**
 * Service for every action about players
 *
 * @export
 * @class PlayerService
 */
@Injectable()
export class PlayerService {
  constructor() { }

  /**
   * Return an observable of all the players in a list
   *
   * @returns {Observable<Player[]>}
   * @memberof PlayerService
   */
  public getPlayerList(): Observable<Player[]> {
    const players: Player[] = JSON.parse(localStorage.getItem('players'));
    return of(players ? players : []);
  }

  /**
   * Return an observable of a player find by its id
   *
   * @param {string} id
   * @returns {Observable<Player>}
   * @memberof PlayerService
   */
  public getPlayerById(id: string): Observable<Player> {
    return this.getPlayerList()
      .pipe(
        map((playerList: Player[]) => playerList.find((player: Player) => player.id === id))
      );
  }

  /**
   * Return an observable of a player list filtered by a list of ids
   *
   * @param {string[]} idList
   * @returns {Observable<Player[]>}
   * @memberof PlayerService
   */
  public getPlayerListById(idList: string[]): Observable<Player[]> {
    return this.getPlayerList()
      .pipe(
        map((playerList: Player[]) => idList.map((id: string) => playerList.find((player: Player) => player.id === id)))
      );
  }

  /**
   * Create a new player
   *
   * @param {Player} player
   * @returns {Observable<void>}
   * @memberof PlayerService
   */
  public createPlayer(player: Player): Observable<void> {
    return this.getPlayerList()
      .pipe(
        map((playerList: Player[]) => {
          playerList.push(player);
          localStorage.setItem('players', JSON.stringify(playerList));
        })
      );
  }

  /**
   * Create multiple new players
   *
   * @param {Player[]} newPlayerList
   * @returns {Observable<void>}
   * @memberof PlayerService
   */
  public createPlayerList(newPlayerList: Player[]): Observable<void> {
    return this.getPlayerList()
      .pipe(
        map((playerList: Player[]) => {
          playerList.push(...newPlayerList);
          localStorage.setItem('players', JSON.stringify(playerList));
        })
      );
  }
}
