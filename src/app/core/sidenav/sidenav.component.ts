import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { HeaderService } from '../header/header.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../http-services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { SignInDialogComponent } from 'src/app/modules/account/sign-in-dialog/sign-in-dialog.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  menuItems = [
    { label: 'Home', link: '/game-list', icon: 'home' },
    { label: 'New game', link: '/game-edition', icon: 'add_circle' },
    { label: 'Help', link: '/help', icon: 'help' },
    { label: 'About', link: '/about', icon: 'info' },
  ];

  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    public headerService: HeaderService,
    public authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {}

  signOut() {
    this.authenticationService.signOut();
    this.headerService.toggleMenu.emit();
    this.router.navigate(['/game-list']);
  }

  openSignInDialog(): void {
    const dialogRef = this.dialog.open(SignInDialogComponent, { data: { isSignUpButtonPresent: true }});
    dialogRef.afterClosed().subscribe(isSignedIn => {
      if (isSignedIn) {
        this.headerService.toggleMenu.emit();
        this.router.navigate(['/game-list']);
      }
    });
  }

}
