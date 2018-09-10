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
  /**
   * Specify that the main bar is on the left side
   *
   * @memberof HiScoreComponent
   */
  public isLeftSide = false;

  constructor(
    private mainBarService: MainBarService
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

    this.mainBarService.getIsLeftSide()
      .subscribe((isLeftSide: boolean) => {
        this.isLeftSide = isLeftSide;
      });
  }
}
