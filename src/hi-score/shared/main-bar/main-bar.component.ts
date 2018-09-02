import { Component, OnInit } from '@angular/core';
import { MainBarService } from './main-bar.service';

@Component({
  selector: 'hs-main-bar',
  templateUrl: 'main-bar.component.html',
  styleUrls: ['main-bar.component.scss']
})

export class MainBarComponent implements OnInit {
  public title = '';
  public isOptionMenuVisible = false;

  constructor(
    private mainBarService: MainBarService
  ) { }

  ngOnInit() {
    this.mainBarService.getTitle()
      .subscribe((title: string) => this.title = title);
    this.mainBarService.getIsOptionMenuVisible()
      .subscribe((isOptionMenuVisible: boolean) => this.isOptionMenuVisible = isOptionMenuVisible);
  }
}
