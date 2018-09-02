import { Injectable } from '@angular/core';

import { Player } from './player.model';
import { Observable, of, empty } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { flatMap, map } from 'rxjs/operators';

@Injectable()
export class PlayerService {
  // private playerList: Player[] = [
  //   {
  //     id: '1',
  //     name: 'Laëtitia'
  //   },
  //   {
  //     id: '2',
  //     name: 'Kévin'
  //   },
  //   {
  //     id: '3',
  //     name: 'Jean-Emanuel'
  //   },
  //   {
  //     id: '4',
  //     name: 'Ludovic'
  //   },
  //   {
  //     id: '5',
  //     name: 'Matthieu'
  //   },
  //   {
  //     id: '6',
  //     name: 'Aurélie'
  //   },
  //   {
  //     id: '7',
  //     name: 'Jessie'
  //   },
  //   {
  //     id: '8',
  //     name: 'Cyril'
  //   }
  // ];

  constructor(
    protected localStorage: LocalStorage
  ) { }

  public getPlayerList(): Observable<Player[]> {
    return this.localStorage.getItem<Player[]>('players');
    // return of(this.playerList);
  }

  public getPlayerById(id: string): Observable<Player> {
    return this.getPlayerList()
      .pipe(
        map((playerList: Player[]) => playerList.find((player: Player) => player.id === id))
      );
    // return of(this.playerList.find((player: Player) => player.id === id));
  }

  public getPlayerListById(idList: string[]): Observable<Player[]> {
    return this.getPlayerList()
      .pipe(
        map((playerList: Player[]) => playerList.filter((player: Player) => idList.includes(player.id)))
      );
    // return of(this.playerList.filter((player: Player) => idList.includes(player.id)));
  }

  public createPlayer(player: Player): Observable<boolean> {
    return this.getPlayerList()
      .pipe(
        flatMap((playerList: Player[]) => {
          if (playerList) {
            playerList.push(player);
          } else {
            playerList = [];
          }
          return this.localStorage.setItem('players', playerList);
        })
      );
    // this.playerList.push(player);
    // return of(player);
  }
}
