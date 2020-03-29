import { Component } from '@angular/core';
import { HeaderService } from './header.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../http-services/authentication.service';
import { MatDialog } from '@angular/material/dialog';

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
    public authenticationService: AuthenticationService,
    public router: Router,
    public dialog: MatDialog
  ) { }

  openMenu() {
    this.headerService.toggleMenu.emit();
  }
}
