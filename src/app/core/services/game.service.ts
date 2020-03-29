import { Injectable } from '@angular/core';

import { Game } from '../../shared/models/game.model';
import { Observable, of, BehaviorSubject, from } from 'rxjs';
import { map, first, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthenticationService } from '../http-services/authentication.service';

/**
 * Service for every action about games
 *
 * @export
 */
@Injectable()
export class GameService {
  /**
   * The current game id
   */
  public currentGameId: string;
  public gameListSubject: BehaviorSubject<Game[]>;

  private gameListSubscription: () => void;

  constructor(
    private readonly authenticationService: AuthenticationService
  ) {
    const games: Game[] = (JSON.parse(localStorage.getItem('games')) || [])
      .map((game: Game) => {
        game.date = new Date(game.date);
        return game;
      })
      .sort((g1: Game, g2: Game) => g1.date < g2.date ? 1 : -1) || [];
    this.gameListSubject = new BehaviorSubject<Game[]>(games);

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.syncGames();
      } else if (this.gameListSubscription) {
        this.stopSyncGames();
      }
    });
  }

  /**
   * Get an observable of a game find by its id
   */
  public getGameById(id: string): Observable<Game> {
    return this.gameListSubject.pipe(
      first(),
      map((gameList: Game[]) => gameList.find((game: Game) => game.id === id))
    );
  }

  /**
   * Create a new game
   */
  public createGame(game: Game): Observable<void> {
    game.isSynced = !!this.authenticationService.user;
    if (!game.isSynced) {
      return this.gameListSubject.pipe(
        first(),
        map((gameList: Game[]) => {
          gameList.push(game);
          localStorage.setItem('games', JSON.stringify(gameList));
        })
      );
    } else {
      game.creatorId = this.authenticationService.user.uid;
      return from(firebase.firestore().collection('games').doc(game.id).set({...game}));
    }
  }

  /**
   * Modify a game
   */
  public updateGame(newGame: Game): Observable<void> {
    newGame.isSynced = !!this.authenticationService.user;
    if (!newGame.isSynced) {
      return this.gameListSubject.pipe(
        first(),
        map((gameList: Game[]) => {
          const oldGame: Game = gameList.find((game: Game) => game.id === newGame.id);
          gameList.splice(gameList.indexOf(oldGame), 1, newGame);
          localStorage.setItem('games', JSON.stringify(gameList));
        })
      );
    } else {
      return from(firebase.firestore().collection('games').doc(newGame.id).set({...newGame}, { merge: true }));
    }
  }

  public syncGames() {
    if (!this.gameListSubscription) {
      this.pushNotSyncedGames().subscribe(() => {
        this.gameListSubscription = firebase.firestore().collection('games')
          .where('creatorId', '==', this.authenticationService.user.uid)
          .orderBy('date', 'desc')
          .onSnapshot((querySnapshot) => {
            const games = [];
            querySnapshot.forEach((doc) => {
              const game = doc.data();
              game.date = new Date(game.date.seconds * 1000);
              games.push(game);
            });
            localStorage.setItem('games', JSON.stringify(games));
            this.gameListSubject.next(games);
          });
      });
    }
  }

  public stopSyncGames() {
    this.gameListSubscription();
    this.gameListSubscription = null;
  }

  private pushNotSyncedGames() {
    return this.gameListSubject.pipe(
      first(),
      tap(async gameList => {
        const notSyncedGameList = gameList.filter(game => !game.isSynced).map(game => {
          game.isSynced = true;
          game.creatorId = this.authenticationService.user.uid;
          return game;
        });
        for (const game of notSyncedGameList) {
          await firebase.firestore().collection('games').doc(game.id).set({...game}, { merge: true });
        }
      })
    );
  }
}
