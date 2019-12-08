import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

/**
 * Directive made to know if an element have been pressed for a 0.5s
 *
 * @export
 * @class LongPressDirective
 */
@Directive({ selector: '[hsLongPress]' })
export class LongPressDirective {
  /**
   * The emitter of the long press event
   *
   * @type {EventEmitter<any>}
   * @memberof LongPressDirective
   */
  @Output() longPressDetected: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Keep the timer of the press event
   *
   * @private
   * @type {number}
   * @memberof LongPressDirective
   */
  private pressTimer: number;

  constructor() { }

  /**
   * Start a timeout and emit the long press event after 0.5s
   *
   * @private
   * @param {Event} event
   * @memberof LongPressDirective
   */
  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  private onMouseDown(event: Event) {
    this.pressTimer = window.setTimeout(() => {
      event.preventDefault();
      this.longPressDetected.emit();
      clearTimeout(this.pressTimer);
    }, 500);
  }

  /**
   * Clear the timeout if the user release the press before the end of the timeout
   *
   * @private
   * @memberof LongPressDirective
   */
  @HostListener('touchend', ['$event'])
  @HostListener('mouseup', ['$event'])
  private onMouseUp() {
    clearTimeout(this.pressTimer);
  }
}
