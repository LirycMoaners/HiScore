import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/http-services/authentication.service';
import { HeaderService } from 'src/app/core/header/header.service';
import { MatDialog } from '@angular/material/dialog';
import { SignInDialogComponent } from './sign-in-dialog/sign-in-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { DeleteUserDialogComponent } from './delete-user-dialog/delete-user-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  newEmail: FormControl = new FormControl('', [Validators.required, Validators.email]);
  newPassword: FormControl = new FormControl('', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]);
  hide = true;

  constructor(
    public dialog: MatDialog,
    private readonly router: Router,
    private readonly headerService: HeaderService,
    public authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.headerService.title = 'Account';
    this.newEmail.patchValue(this.authenticationService.user.email);
  }

  async onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const [file]: [File] = event.target.files;
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        await this.authenticationService.updateProfile(this.authenticationService.user, null, file);
      }
    }
  }

  async onUsernameChange(event) {
    if (event.target.value) {
      await this.authenticationService.updateProfile(this.authenticationService.user, event.target.value, null);
    }
  }

  changeEmail() {
    if (this.newEmail.valid) {
      this.openSignInDialog().subscribe(async isSignedIn => {
        if (isSignedIn) {
          await this.authenticationService.updateEmail(this.authenticationService.user, this.newEmail.value);
        }
      });
    }
  }

  changePassword() {
    if (this.newPassword.valid) {
      this.openSignInDialog().subscribe(async isSignedIn => {
        if (isSignedIn) {
          await this.authenticationService.updatePassword(this.authenticationService.user, this.newPassword.value);
        }
      });
    }
  }

  deleteUser() {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent);
    dialogRef.afterClosed().subscribe((isUserDeleted) => {
      if (isUserDeleted) {
        this.router.navigate(['/game-list']);
      }
    });
  }

  private openSignInDialog() {
    const dialogRef = this.dialog.open(SignInDialogComponent, { data: { isSignUpButtonPresent: false }});
    return dialogRef.afterClosed();
  }

}
