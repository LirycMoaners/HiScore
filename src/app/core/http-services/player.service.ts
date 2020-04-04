import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

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
    authenticationService: AuthenticationService,
    auth: AngularFireAuth,
    firestore: AngularFirestore
  ) {
    super(
      authenticationService,
      auth,
      'nonUserPlayers',
      () => firestore
        .collection('userDatas')
        .doc(authenticationService.user.uid)
        .collection('nonUserPlayers'),
      () => firestore
        .collection('userDatas')
        .doc(authenticationService.user.uid)
        .collection('nonUserPlayers', ref => ref.orderBy('name')),
      (player: Player) => player,
      (p1: Player, p2: Player) => p1.name.localeCompare(p2.name)
    );
  }
}
