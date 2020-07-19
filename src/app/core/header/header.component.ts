import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { HeaderService } from './header.service';

/**
 * Component of the application header
 *
 * @export
 */
@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent {
  constructor(
    public headerService: HeaderService,
    public router: Router
  ) { }

  public openMenu(): void {
    this.headerService.toggleMenu.emit();
  }
}
