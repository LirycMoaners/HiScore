import { Pipe, PipeTransform } from '@angular/core';
import { PlayerService } from './player.service';
import { Player } from './player.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
