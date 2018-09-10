import { Injectable } from '@angular/core';

import { Player } from './player.model';
import { Observable } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { flatMap, map } from 'rxjs/operators';

/**
 * Service for every action about players
 *
 * @export
 * @class PlayerService
 */
@Injectable()
export class PlayerService {
  constructor(
    protected localStorage: LocalStorage
  ) { }

  /**
   * Return an observable of all the players in a list
   *
   * @returns {Observable<Player[]>}
   * @memberof PlayerService
   */
  public getPlayerList(): Observable<Player[]> {
    return this.localStorage.getItem<Player[]>('players')
      .pipe(
        map((playerList: Player[]) => playerList || [])
      );
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
   * @returns {Observable<boolean>}
   * @memberof PlayerService
   */
  public createPlayer(player: Player): Observable<boolean> {
    return this.getPlayerList()
      .pipe(
        flatMap((playerList: Player[]) => {
          playerList.push(player);
          return this.localStorage.setItem('players', playerList);
        })
      );
  }

  /**
   * Create multiple new players
   *
   * @param {Player[]} newPlayerList
   * @returns {Observable<boolean>}
   * @memberof PlayerService
   */
  public createPlayerList(newPlayerList: Player[]): Observable<boolean> {
    return this.getPlayerList()
      .pipe(
        flatMap((playerList: Player[]) => {
          playerList.push(...newPlayerList);
          return this.localStorage.setItem('players', playerList);
        })
      );
  }
}
