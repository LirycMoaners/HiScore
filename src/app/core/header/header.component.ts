import { Component } from '@angular/core';
import { HeaderService } from './header.service';
import { Router } from '@angular/router';

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

  openMenu() {
    this.headerService.toggleMenu.emit();
  }
}
