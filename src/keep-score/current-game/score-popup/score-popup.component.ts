import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'ks-score-popup',
  templateUrl: 'score-popup.component.html',
  styleUrls: ['score-popup.component.scss']
})

export class ScorePopupComponent implements OnInit {
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() onValidate: EventEmitter<number> = new EventEmitter<number>();
  @Input() score: number;

  constructor() { }

  ngOnInit() { }

  public cancel(): void {
    this.onCancel.emit();
  }

  public validate(): void {
    this.onValidate.emit(this.score);
  }

  public modifyScore(addedScore: number): void {
    this.score += addedScore;
  }
}
