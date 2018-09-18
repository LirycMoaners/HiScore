import { Component } from '@angular/core';
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
export class MainBarComponent {
  constructor(
    public mainBarService: MainBarService
  ) { }
}
