import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

/**
 * Service to handle main bar actions
 *
 * @export
 * @class MainBarService
 */
@Injectable()
export class MainBarService {
  /**
   * Subject which handles each call to set the title
   *
   * @private
   * @type {Subject<string>}
   * @memberof MainBarService
   */
  private titleSubject: Subject<string> = new Subject<string>();

  /**
   * Observable to subscribe to get each modification to the title
   *
   * @private
   * @type {Observable<string>}
   * @memberof MainBarService
   */
  private title$: Observable<string>;

  /**
   * Subject which handles each call to set the position of the main bar
   *
   * @private
   * @type {Subject<boolean>}
   * @memberof MainBarService
   */
  private isLeftSideSubject: Subject<boolean> = new Subject<boolean>();

  /**
   * Observable to subscribe to get each call for modifying the main bar position
   *
   * @private
   * @type {Observable<boolean>}
   * @memberof MainBarService
   */
  private isLeftSide$: Observable<boolean>;

  /**
   * Subject which handles each call to set the visibility of the option menu
   *
   * @private
   * @type {Subject<boolean>}
   * @memberof MainBarService
   */
  private isOptionMenuVisibleSubject: Subject<boolean> = new Subject<boolean>();

  /**
   * Observable to subscribe to get each call for modifying the visibility of the option menu
   *
   * @private
   * @type {Observable<boolean>}
   * @memberof MainBarService
   */
  private isOptionMenuVisible$: Observable<boolean>;

  constructor() {
    this.title$ = this.titleSubject.asObservable();
    this.isLeftSide$ = this.isLeftSideSubject.asObservable();
    this.isOptionMenuVisible$ = this.isOptionMenuVisibleSubject.asObservable();
  }

  /**
   * Emit a new title to the title subject
   *
   * @param {string} title
   * @memberof MainBarService
   */
  public setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  /**
   * Get the observable of the title
   *
   * @returns {Observable<string>}
   * @memberof MainBarService
   */
  public getTitle(): Observable<string> {
    return this.title$;
  }

  /**
   * Emit a new change to the main bar position subject
   *
   * @param {boolean} isLeftSide
   * @memberof MainBarService
   */
  public setIsLeftSide(isLeftSide: boolean): void {
    this.isLeftSideSubject.next(isLeftSide);
  }

  /**
   * Get the observable of the main bar position
   *
   * @returns {Observable<boolean>}
   * @memberof MainBarService
   */
  public getIsLeftSide(): Observable<boolean> {
    return this.isLeftSide$;
  }

  /**
   * Emit a new value to the option menu visibility subject
   *
   * @param {boolean} isOptionMenuVisible
   * @memberof MainBarService
   */
  public setIsOptionMenuVisible(isOptionMenuVisible: boolean): void {
    this.isOptionMenuVisibleSubject.next(isOptionMenuVisible);
  }

  /**
   * Get the observable of the option menu visibility
   *
   * @returns {Observable<boolean>}
   * @memberof MainBarService
   */
  public getIsOptionMenuVisible(): Observable<boolean> {
    return this.isOptionMenuVisible$;
  }
}
