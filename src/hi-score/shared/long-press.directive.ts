import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({ selector: '[hsLongPress]' })
export class LongPressDirective {
  @Output() longPressDetected: EventEmitter<any> = new EventEmitter<any>();
  private pressTimer: number;

  constructor() { }

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  private onMouseDown(event: Event) {
    this.pressTimer = window.setTimeout(() => {
      event.preventDefault();
      this.longPressDetected.emit();
      clearTimeout(this.pressTimer);
    }, 500);
  }

  @HostListener('touchend', ['$event'])
  @HostListener('mouseup', ['$event'])
  private onMouseUp() {
    clearTimeout(this.pressTimer);
  }
}
