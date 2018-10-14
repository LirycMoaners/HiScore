import { Component, OnInit } from '@angular/core';
import { MainBarService } from './shared/main-bar/main-bar.service';

/**
 * HiScore app main component
 *
 * @export
 * @class HiScoreComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'hs-root',
  templateUrl: './hi-score.component.html',
  styleUrls: ['./hi-score.component.scss']
})
export class HiScoreComponent implements OnInit {
  constructor(
    public mainBarService: MainBarService
  ) {}

  ngOnInit(): void {
    window.oncontextmenu = (e) => {
      if (e.button === 2) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
  }
}
