import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, first } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { AuthenticationService } from './authentication.service';
import { Game } from '../../shared/models/game.model';
import { FirstoreService } from './firestore.service';

/**
 * Service for every action about games
 *
 * @export
 */
@Injectable()
export class GameService extends FirstoreService<Game> {

  /**
   * Current game id
   */
  public currentGameId: string;

  constructor(
    authenticationService: AuthenticationService
  ) {
    super(
      authenticationService,
      'games',
      () => firebase.firestore().collection('games'),
      () => this.firestoreCollection()
        .where('creatorId', '==', authenticationService.user.uid)
        .orderBy('date', 'desc'),
      (game: Game) => {
        game.date = new Date(game.date);
        return game;
      },
      (g1: Game, g2: Game) => g1.date < g2.date ? 1 : -1,
      (game: Game) => {
        game.date = new Date((game.date as any).seconds * 1000);
        return game;
      },
      (game: Game) => {
        game.creatorId = this.authenticationService.user.uid;
        return game;
      }
    );
  }
}
