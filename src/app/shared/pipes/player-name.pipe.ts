import { Pipe, PipeTransform } from '@angular/core';
import { PlayerService } from '../../core/services/player.service';
import { Player } from '../models/player.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
    private playerService: PlayerService
  ) { }

  transform(value: string): Observable<string> {
    return this.playerService.getPlayerById(value)
      .pipe(
        map((player: Player) => player.name)
      );
  }
}
