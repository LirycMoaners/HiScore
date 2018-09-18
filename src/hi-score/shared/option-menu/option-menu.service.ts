import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

/**
 * Service to handle option menu actions
 *
 * @export
 * @class OptionMenuService
 */
@Injectable()
export class OptionMenuService {
  /**
   * Subject which handles each call to the last round edition
   *
   * @private
   * @type {Subject<null>}
   * @memberof OptionMenuService
   */
  public editLastRound$: Subject<null> = new Subject<null>();

  /**
   * Subject which handles each call to end the game
   *
   * @private
   * @type {Subject<null>}
   * @memberof OptionMenuService
   */
  public endGame$: Subject<null> = new Subject<null>();
}
