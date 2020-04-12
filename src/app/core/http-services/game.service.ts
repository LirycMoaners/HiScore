import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ReplaySubject } from 'rxjs';

import { Game } from '../../shared/models/game.model';
import { FirstoreService } from './firestore.service';
import { UserService } from './user.service';

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
  public currentGame: ReplaySubject<Game> = new ReplaySubject(1);

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly userService: UserService,
    auth: AngularFireAuth
  ) {
    super(
      auth,
      'games',
      () => this.firestore.collection('games'),
      () => this.firestore.collection(
        'games',
        ref => ref
          .where('userIds', 'array-contains', this.userService.user.uid)
          .orderBy('date', 'desc')
      ),
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
        game.adminIds = [this.userService.user.uid];
        const userIdIndex = game.userIds.findIndex(uid => uid === this.userService.user.uid);
        if (userIdIndex === -1) {
          game.userIds.push(this.userService.user.uid);
        }
        return game;
      }
    );
  }
}
