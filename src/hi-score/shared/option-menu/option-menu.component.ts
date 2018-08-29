import { Component, OnInit } from '@angular/core';
import { MainBarService } from '../main-bar/main-bar.service';

@Component({
  selector: 'hs-option-menu',
  templateUrl: 'option-menu.component.html',
  styleUrls: ['option-menu.component.scss']
})

export class OptionMenuComponent implements OnInit {
  public isHoriz: boolean;

  constructor(
    private mainBarService: MainBarService
  ) { }

  ngOnInit() {
    this.mainBarService.getIsLeftSide().subscribe(
      (isLeftSide: boolean) => this.isHoriz = isLeftSide
    );
  }
}
