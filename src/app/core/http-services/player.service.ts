import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, map } from 'rxjs/operators';

import { Player } from '../../shared/models/player.model';
import { FirstoreService } from './firestore.service';
import { UserService } from './user.service';

/**
 * Service for every action about players
 *
 * @export
 */
@Injectable()
export class PlayerService extends FirstoreService<Player> {

  constructor(
    private readonly firestore: AngularFirestore,
    auth: AngularFireAuth
  ) {
    super(
      auth,
      'players',
      () => this.firestore
        .collection('players'),
      () => this.firestore
        .collection('players', ref => ref.orderBy('displayName')),
      (player: Player) => player,
      (p1: Player, p2: Player) => p1.displayName.localeCompare(p2.displayName)
    );
  }

  public getElementListByName(name: string) {
    return this.elementListSubject.pipe(
      first(),
      map((elementList: Player[]) =>
        elementList.filter((element: Player) => element.displayName.toLowerCase().includes(name.toLowerCase()))
      )
    );
  }
}
