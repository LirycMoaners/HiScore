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
      date: new Date(2018, 6, 6, 14),
      scoreList: [
        {
          playerId: '1',
          roundScoreList: [
            13, 20, 0, 5, 14, 4
          ],
          total: 52
        },
        {
          playerId: '2',
          roundScoreList: [
            0, 62, 29, 17, 104, 91
          ],
          total: 212
        },
        {
          playerId: '3',
          roundScoreList: [
            7, 4, 1, 15, 23, 76
          ],
          total: 50
        },
        {
          playerId: '4',
          roundScoreList: [
            20, 18, 43, 6, 40, 4
          ],
          total: 127
        },
        {
          playerId: '5',
          roundScoreList: [
            29, 15, 16, 55, 3, 2
          ],
          total: 118
        },
        {
          playerId: '6',
          roundScoreList: [
            10, 0, 3, 36, 14, 0
          ],
          total: 63
        },
        {
          playerId: '7',
          roundScoreList: [
            8, 11, 15, 0, 0, 21
          ],
          total: 34
        },
        {
          playerId: '8',
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
      date: new Date(2018, 6, 7, 12),
      scoreList: [
        {
          playerId: '1',
          roundScoreList: [
            30, 10, 8, 15
          ],
          total: 63
        },
        {
          playerId: '2',
          roundScoreList: [
            0, 13, 20, 5
          ],
          total: 38
        },
        {
          playerId: '3',
          roundScoreList: [
            1, 80, 56, 14
          ],
          total: 151
        },
        {
          playerId: '4',
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

  public createGame(game: Game): Observable<Game> {
    this.gameList.push(game);
    this.gameList.sort((g1: Game, g2: Game) => g1.date < g2.date ? 1 : -1);
    return of(game);
  }
}
