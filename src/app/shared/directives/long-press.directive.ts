import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

/**
 * Directive made to know if an element have been pressed for a 0.5s
 *
 * @export
 */
@Directive({ selector: '[appLongPress]' })
export class LongPressDirective {
  /**
   * The emitter of the long press event
   */
  @Output() longPressDetected: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Keep the timer of the press event
   */
  private pressTimer: number;

  constructor() { }

  /**
   * Start a timeout and emit the long press event after 0.5s
   */
  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: Event) {
    this.pressTimer = window.setTimeout(() => {
      event.preventDefault();
      this.longPressDetected.emit();
      clearTimeout(this.pressTimer);
    }, 500);
  }

  /**
   * Clear the timeout if the user release the press before the end of the timeout
   */
  @HostListener('touchend')
  @HostListener('mouseup')
  public onMouseUp() {
    clearTimeout(this.pressTimer);
  }
}
