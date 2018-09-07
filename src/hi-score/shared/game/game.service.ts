import { Injectable } from '@angular/core';

import { Game } from './game.model';
import { Observable, ReplaySubject } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { flatMap, map } from 'rxjs/operators';

@Injectable()
export class GameService {
  private currentGameIdSubject: ReplaySubject<string> = new ReplaySubject<string>(1);
  private currentGameId$: Observable<string>;

  constructor(
    protected localStorage: LocalStorage
  ) {
    this.currentGameId$ = this.currentGameIdSubject.asObservable();
  }

  public getGameList(): Observable<Game[]> {
    return this.localStorage.getItem<Game[]>('games')
      .pipe(
        map((gameList: Game[]) => gameList ? gameList.sort((g1: Game, g2: Game) => g1.date < g2.date ? 1 : -1) : [])
      );
  }

  public getGameById(id: string): Observable<Game> {
    return this.getGameList()
      .pipe(
        map((gameList: Game[]) => gameList.find((game: Game) => game.id === id))
      );
  }

  public createGame(game: Game): Observable<boolean> {
    return this.getGameList()
      .pipe(
        flatMap((gameList: Game[]) => {
          gameList.push(game);
          return this.localStorage.setItem('games', gameList);
        })
      );
  }

  public updateGame(newGame: Game): Observable<boolean> {
    return this.getGameList()
      .pipe(
        flatMap((gameList: Game[]) => {
          const oldGame: Game = gameList.find((game: Game) => game.id === newGame.id);
          gameList.splice(gameList.indexOf(oldGame), 1, newGame);
          return this.localStorage.setItem('games', gameList);
        })
      );
  }

  public setCurrentGameId(currentGameId: string): void {
    this.currentGameIdSubject.next(currentGameId);
  }

  public getCurrentGameId(): Observable<string> {
    return this.currentGameId$;
  }
}
