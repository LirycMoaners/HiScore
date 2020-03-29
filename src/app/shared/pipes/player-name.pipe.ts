import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PlayerService } from '../../core/services/player.service';
import { Player } from '../models/player.model';

/**
 * Pipe which return the name of the player if we gave the player id
 *
 * @export
 */
@Pipe({
  name: 'playerName'
})
export class PlayerNamePipe implements PipeTransform {

  constructor(
    private readonly playerService: PlayerService
  ) { }

  transform(value: string): Observable<string> {
    return this.playerService.getPlayerById(value)
      .pipe(
        map((player: Player) => player.name)
      );
  }
}
