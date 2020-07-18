import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { Player } from '../../shared/models/player.model';
import { FirstoreService } from './firestore.service';
import { UserService } from './user.service';

/**
 * Service for every action about non user players
 *
 * @export
 */
@Injectable()
export class NonUserPlayerService extends FirstoreService<Player> {

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly userService: UserService,
    auth: AngularFireAuth
  ) {
    super(
      auth,
      'nonUserPlayers',
      () => this.firestore
        .collection('userDatas')
        .doc(this.userService.user?.uid)
        .collection('nonUserPlayers'),
      () => this.firestore
        .collection('userDatas')
        .doc(this.userService.user?.uid)
        .collection('nonUserPlayers', ref => ref.orderBy('displayName')),
      (player: Player) => player,
      (p1: Player, p2: Player) => (!!p1.displayName ? p1.displayName : '').localeCompare(!!p2.displayName ? p2.displayName : '')
    );
  }
}
