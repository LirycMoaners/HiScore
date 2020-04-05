import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../header/header.service';
import { AuthenticationService } from '../http-services/authentication.service';

import { SignInDialogComponent } from '../../modules/account/sign-in-dialog/sign-in-dialog.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  /**
   * Sidenav menu links with name and icon
   */
  public menuItems = [
    { label: 'Home', link: '/game-list', icon: 'home' },
    { label: 'New game', link: '/game-edition', icon: 'add_circle' },
    { label: 'Help', link: '/help', icon: 'help' },
    { label: 'About', link: '/about', icon: 'info' }
  ];

  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    public headerService: HeaderService,
    public authenticationService: AuthenticationService
  ) { }

  /**
   * Open the log in popup
   */
  public openSignInDialog(): void {
    this.headerService.toggleMenu.emit();
    const dialogRef = this.dialog.open(SignInDialogComponent, { data: { isSignUpButtonPresent: true }});
    dialogRef.afterClosed().subscribe(isSignedIn => {
      if (isSignedIn) {
        this.router.navigate(['/game-list']);
      }
    });
  }

  /**
   * Log out
   */
  public signOut() {
    this.authenticationService.signOut();
    this.headerService.toggleMenu.emit();
    this.router.navigate(['/game-list']);
  }
}
