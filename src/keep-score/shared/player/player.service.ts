import { Injectable } from '@angular/core';

import { Player } from './player.model';
import { Observable, of } from 'rxjs';

@Injectable()
export class PlayerService {
  private playerList: Player[] = [
    {
      id: '1',
      name: 'Laëtitia'
    },
    {
      id: '2',
      name: 'Kévin'
    },
    {
      id: '3',
      name: 'Jean-Emanuel'
    },
    {
      id: '4',
      name: 'Ludovic'
    },
    {
      id: '5',
      name: 'Matthieu'
    },
    {
      id: '6',
      name: 'Aurélie'
    },
    {
      id: '7',
      name: 'Jessie'
    },
    {
      id: '8',
      name: 'Cyril'
    }
  ];

  constructor() { }

  public getPlayerList(): Observable<Player[]> {
    return of(this.playerList);
  }

  public getPlayerById(id: string): Observable<Player> {
    return of(this.playerList.find((player: Player) => player.id === id));
  }
}
