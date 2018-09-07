import { Injectable } from '@angular/core';

import { Player } from './player.model';
import { Observable } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { flatMap, map } from 'rxjs/operators';

@Injectable()
export class PlayerService {
  constructor(
    protected localStorage: LocalStorage
  ) { }

  public getPlayerList(): Observable<Player[]> {
    return this.localStorage.getItem<Player[]>('players')
      .pipe(
        map((playerList: Player[]) => playerList || [])
      );
  }

  public getPlayerById(id: string): Observable<Player> {
    return this.getPlayerList()
      .pipe(
        map((playerList: Player[]) => playerList.find((player: Player) => player.id === id))
      );
  }

  public getPlayerListById(idList: string[]): Observable<Player[]> {
    return this.getPlayerList()
      .pipe(
        map((playerList: Player[]) => idList.map((id: string) => playerList.find((player: Player) => player.id === id)))
      );
  }

  public createPlayer(player: Player): Observable<boolean> {
    return this.getPlayerList()
      .pipe(
        flatMap((playerList: Player[]) => {
          playerList.push(player);
          return this.localStorage.setItem('players', playerList);
        })
      );
  }

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
