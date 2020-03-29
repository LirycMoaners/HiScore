import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, from } from 'rxjs';
import { map, first, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { AuthenticationService } from '../http-services/authentication.service';
import { Game } from '../../shared/models/game.model';

/**
 * Service for every action about games
 *
 * @export
 */
@Injectable()
export class GameService {

  /**
   * Current game id
   */
  public currentGameId: string;

  /**
   * Subject of all the games
   */
  public gameListSubject: BehaviorSubject<Game[]>;

  /**
   * The function to unsubscribe to the game checking from database
   */
  private gameListUnsubscribe: () => void;

  constructor(
    private readonly authenticationService: AuthenticationService
  ) {
    this.initGameListSubject();

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.syncGames();
      } else if (this.gameListUnsubscribe) {
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
      return from(
        firebase.firestore().collection('games').doc(newGame.id).set({...newGame}, { merge: true })
      );
    }
  }

  /**
   * Push all not synced games and begin check updates from database
   */
  public syncGames() {
    if (!this.gameListUnsubscribe) {
      this.pushNotSyncedGames().subscribe(() => {
        this.gameListUnsubscribe = firebase.firestore().collection('games')
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

  /**
   * Stop checking database updates
   */
  public stopSyncGames() {
    this.gameListUnsubscribe();
    this.gameListUnsubscribe = null;
  }

  /**
   * Initialize the gameListSubject with the local storage
   */
  private initGameListSubject() {
    const games: Game[] = (JSON.parse(localStorage.getItem('games')) || [])
      .map((game: Game) => {
        game.date = new Date(game.date);
        return game;
      })
      .sort((g1: Game, g2: Game) => g1.date < g2.date ? 1 : -1) || [];
    this.gameListSubject = new BehaviorSubject<Game[]>(games);
  }

  /**
   * Push all not synced games to the database
   */
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
