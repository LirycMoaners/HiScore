import { Component, OnInit } from '@angular/core';
import { MainBarService } from './shared/main-bar/main-bar.service';
declare const AndroidFullScreen;

@Component({
  selector: 'ks-root',
  templateUrl: './keep-score.component.html',
  styleUrls: ['./keep-score.component.scss']
})
export class KeepScoreComponent implements OnInit {
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

    AndroidFullScreen.immersiveMode();

    this.mainBarService.getIsLeftSide()
      .subscribe((isLeftSide: boolean) => this.isLeftSide = isLeftSide);
  }
}
