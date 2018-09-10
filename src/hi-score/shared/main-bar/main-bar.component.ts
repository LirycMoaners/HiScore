import { Component, OnInit } from '@angular/core';
import { MainBarService } from './main-bar.service';

/**
 * Component of the application main bar
 *
 * @export
 * @class MainBarComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'hs-main-bar',
  templateUrl: 'main-bar.component.html',
  styleUrls: ['main-bar.component.scss']
})
export class MainBarComponent implements OnInit {
  /**
   * Title shown in the main bar
   *
   * @memberof MainBarComponent
   */
  public title = '';

  /**
   * Specify if the option is visible
   *
   * @memberof MainBarComponent
   */
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
