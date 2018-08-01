import { Injectable } from '@angular/core';

import { Player } from './player.model';
import { Observable, of } from 'rxjs';

@Injectable()
export class PlayerService {

  constructor() { }

  public getPlayerList(): Observable<Player[]> {
    const playerList: Player[] = [
      {
        name: 'Laëtitia'
      },
      {
        name: 'Kévin'
      },
      {
        name: 'Jean-Emanuel'
      },
      {
        name: 'Ludovic'
      },
      {
        name: 'Matthieu'
      },
      {
        name: 'Aurélie'
      },
      {
        name: 'Jessie'
      },
      {
        name: 'Cyril'
      }
    ];

    return of(playerList);
  }
}
