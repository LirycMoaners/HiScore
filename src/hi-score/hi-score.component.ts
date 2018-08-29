import { Component, OnInit } from '@angular/core';
import { MainBarService } from './shared/main-bar/main-bar.service';
declare const AndroidFullScreen;

@Component({
  selector: 'hs-root',
  templateUrl: './hi-score.component.html',
  styleUrls: ['./hi-score.component.scss']
})
export class HiScoreComponent implements OnInit {
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

    AndroidFullScreen.immersiveMode();
  }
}
