import { Injectable } from '@angular/core';

import { Player } from '../../shared/models/player.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Service for every action about players
 *
 * @export
 */
@Injectable()
export class PlayerService {

  constructor() { }

  /**
   * Return an observable of all the players in a list
   */
  public getPlayerList(): Observable<Player[]> {
    const players: Player[] = JSON.parse(localStorage.getItem('players'));
    return of(players ? players : []);
  }

  /**
   * Return an observable of a player find by its id
   */
  public getPlayerById(id: string): Observable<Player> {
    return this.getPlayerList()
      .pipe(
        map((playerList: Player[]) => playerList.find((player: Player) => player.id === id))
      );
  }

  /**
   * Return an observable of a player list filtered by a list of ids
   */
  public getPlayerListById(idList: string[]): Observable<Player[]> {
    return this.getPlayerList()
      .pipe(
        map((playerList: Player[]) => idList.map((id: string) => playerList.find((player: Player) => player.id === id)))
      );
  }

  /**
   * Create a new player
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
