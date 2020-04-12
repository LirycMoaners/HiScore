import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { HeaderService } from '../../core/header/header.service';
import { SignInDialogComponent } from './sign-in-dialog/sign-in-dialog.component';
import { DeleteUserDialogComponent } from './delete-user-dialog/delete-user-dialog.component';
import { UserService } from 'src/app/core/http-services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  /**
   * Form control for the new user email address
   */
  public newEmail: FormControl = new FormControl('', [Validators.required, Validators.email]);

  /**
   * Form control for the new user password
   */
  public newPassword: FormControl = new FormControl('', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]);

  /**
   * Used to show the password or not
   */
  public isPasswordHidden = true;

  constructor(
    public userService: UserService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly headerService: HeaderService
  ) { }

  ngOnInit(): void {
    this.headerService.title = 'Account';
    this.newEmail.patchValue(this.userService.user.email);
  }

  /**
   * Update user's picture
   */
  public onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const [file]: [File] = event.target.files;
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        this.userService.updateProfile(this.userService.user, null, file).subscribe();
      }
    }
  }

  /**
   * Update username
   */
  public onUsernameChange(event) {
    if (event.target.value) {
      this.userService.updateProfile(this.userService.user, event.target.value, null).subscribe();
    }
  }

  /**
   * Update user's email address
   */
  public changeEmail() {
    if (this.newEmail.valid) {
      this.openSignInDialog().subscribe(async isSignedIn => {
        if (isSignedIn) {
          await this.userService.updateEmail(this.userService.user, this.newEmail.value);
        }
      });
    }
  }

  /**
   * Update user's password
   */
  public changePassword() {
    if (this.newPassword.valid) {
      this.openSignInDialog().subscribe(async isSignedIn => {
        if (isSignedIn) {
          await this.userService.updatePassword(this.userService.user, this.newPassword.value);
        }
      });
    }
  }

  /**
   * Delete user
   */
  public deleteUser() {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent);
    dialogRef.afterClosed().subscribe((isUserDeleted) => {
      if (isUserDeleted) {
        this.router.navigate(['/game-list']);
      }
    });
  }

  /**
   * Open log in popup
   */
  private openSignInDialog() {
    const dialogRef = this.dialog.open(SignInDialogComponent, { data: { isSignUpButtonPresent: false }});
    return dialogRef.afterClosed();
  }
}
