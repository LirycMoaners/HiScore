import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { Player } from '../../shared/models/player.model';
import { AuthenticationService } from './authentication.service';
import { FirstoreService } from './firestore.service';

/**
 * Service for every action about players
 *
 * @export
 */
@Injectable()
export class PlayerService extends FirstoreService<Player> {

  /**
   * Subject of all the userPlayers
   */
  public userPlayerListSubject: BehaviorSubject<Player[]>;

  constructor(
    authenticationService: AuthenticationService
  ) {
    super(
      authenticationService,
      'nonUserPlayers',
      () => firebase.firestore()
        .collection('userDatas')
        .doc(authenticationService.user.uid)
        .collection('nonUserPlayers'),
      () => this.firestoreCollection().orderBy('name'),
      (player: Player) => player,
      (p1: Player, p2: Player) => p1.name.localeCompare(p2.name)
    );
  }
}
