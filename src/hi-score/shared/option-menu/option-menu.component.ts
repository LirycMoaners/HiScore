import { Component, OnInit } from '@angular/core';
import { MainBarService } from '../main-bar/main-bar.service';
import { OptionMenuService } from './option-menu.service';

@Component({
  selector: 'hs-option-menu',
  templateUrl: 'option-menu.component.html',
  styleUrls: ['option-menu.component.scss']
})

export class OptionMenuComponent implements OnInit {
  public isHoriz: boolean;
  public currentGameId: string;

  constructor(
    private mainBarService: MainBarService,
    private optionMenuService: OptionMenuService
  ) { }

  ngOnInit() {
    this.mainBarService.getIsLeftSide().subscribe(
      (isLeftSide: boolean) => this.isHoriz = isLeftSide
    );

    this.optionMenuService.getCurrentGameId().subscribe(
      (currentGameId: string) => this.currentGameId = currentGameId
    );
  }
}
