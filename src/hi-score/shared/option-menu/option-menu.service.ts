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
  private editLastRoundSubject: Subject<null> = new Subject<null>();

  /**
   * Observable to subscribe to get each call to last round edition
   *
   * @private
   * @type {Observable<null>}
   * @memberof OptionMenuService
   */
  private editLastRound$: Observable<null>;

  /**
   * Subject which handles each call to the new game creation
   *
   * @private
   * @type {Subject<null>}
   * @memberof OptionMenuService
   */
  private newGameSubject: Subject<null> = new Subject<null>();

  /**
   * Observable to subscribe to get each call to new game creation
   *
   * @private
   * @type {Observable<null>}
   * @memberof OptionMenuService
   */
  private newGame$: Observable<null>;

  constructor() {
    this.editLastRound$ = this.editLastRoundSubject.asObservable();
    this.newGame$ = this.newGameSubject.asObservable();
  }

  /**
   * Emit a new call to last round edition
   *
   * @memberof OptionMenuService
   */
  public setEditLastRound(): void {
    this.editLastRoundSubject.next();
  }

  /**
   * Get the observable of last round edition calling
   *
   * @returns {Observable<null>}
   * @memberof OptionMenuService
   */
  public getEditLastRound(): Observable<null> {
    return this.editLastRound$;
  }

  /**
   * Emit a new call to new game creation
   *
   * @memberof OptionMenuService
   */
  public setNewGame(): void {
    this.newGameSubject.next();
  }

  /**
   * Get the observable of nw game creation calling
   *
   * @returns {Observable<null>}
   * @memberof OptionMenuService
   */
  public getNewGame(): Observable<null> {
    return this.newGame$;
  }
}
