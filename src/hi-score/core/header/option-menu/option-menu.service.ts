import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Service to handle option menu actions
 *
 * @export
 */
@Injectable()
export class OptionMenuService {
  /**
   * Subject which handles each call to the last round edition
   */
  public editLastRound$: Subject<null> = new Subject<null>();

  /**
   * Subject which handles each call to end the game
   */
  public endGame$: Subject<null> = new Subject<null>();
}
