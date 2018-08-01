import { Injectable } from '@angular/core';

import { Game } from './game.model';
import { EndingType } from '../game-category/ending-type.enum';
import { Goal } from '../game-category/goal.enum';
import { Observable, of } from 'rxjs';

@Injectable()
export class GameService {
  private gameList: Game[] = [
    {
      id: '0',
      gameCategory : {
        name: 'Uno',
        endingType: EndingType.point,
        endingNumber: 500,
        goal: Goal.lowestScore
      },
      scoreList: [
        {
          player: {
            name: 'Laëtitia'
          },
          roundScoreList: [
            13, 20, 0, 5, 14, 4
          ],
          total: 52
        },
        {
          player: {
            name: 'Kévin'
          },
          roundScoreList: [
            0, 62, 29, 17, 104, 91
          ],
          total: 212
        },
        {
          player: {
            name: 'Jean-Emanuel'
          },
          roundScoreList: [
            7, 4, 1, 15, 23, 76
          ],
          total: 50
        },
        {
          player: {
            name: 'Ludovic'
          },
          roundScoreList: [
            20, 18, 43, 6, 40, 4
          ],
          total: 127
        },
        {
          player: {
            name: 'Matthieu'
          },
          roundScoreList: [
            29, 15, 16, 55, 3, 2
          ],
          total: 118
        },
        {
          player: {
            name: 'Aurélie'
          },
          roundScoreList: [
            10, 0, 3, 36, 14, 0
          ],
          total: 63
        },
        {
          player: {
            name: 'Jessie'
          },
          roundScoreList: [
            8, 11, 15, 0, 0, 21
          ],
          total: 34
        },
        {
          player: {
            name: 'Cyril'
          },
          roundScoreList: [
            11, 0, 6, 8, 9, 0
          ],
          total: 34
        }
      ]
    },
    {
      id: '1',
      gameCategory : {
        name: 'Uno',
        endingType: EndingType.point,
        endingNumber: 500,
        goal: Goal.lowestScore
      },
      scoreList: [
        {
          player: {
            name: 'Laëtitia'
          },
          roundScoreList: [
            30, 10, 8, 15
          ],
          total: 63
        },
        {
          player: {
            name: 'Kévin'
          },
          roundScoreList: [
            0, 13, 20, 5
          ],
          total: 38
        },
        {
          player: {
            name: 'Jean-Emanuel'
          },
          roundScoreList: [
            1, 80, 56, 14
          ],
          total: 151
        },
        {
          player: {
            name: 'Ludovic'
          },
          roundScoreList: [
            15, 14, 4, 0
          ],
          total: 33
        }
      ]
    }
  ];

  constructor() { }

  public getGameList(): Observable<Game[]> {
    return of(this.gameList);
  }

  public getGameById(id: string): Observable<Game> {
    return of(this.gameList.find((game: Game) => game.id === id));
  }

  public saveGame(game: Game) {
    const gameToModify: Game = this.gameList.find((g: Game) => g.id === game.id);
    gameToModify.scoreList = game.scoreList;
  }
}
