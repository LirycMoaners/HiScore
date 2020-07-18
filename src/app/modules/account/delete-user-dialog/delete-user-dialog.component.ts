import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User, UserCredential } from '@firebase/auth-types';

import { UserService } from '../../../core/http-services/user.service';
import { AuthenticationService } from '../../../core/http-services/authentication.service';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.scss']
})
export class DeleteUserDialogComponent implements OnInit {

  /**
   * Boolean to know if the provider of the current user is password or not
   */
  public isPasswordProvider = true;

  /**
   * Boolean that indicates if we need to show the password the user wrotes or not
   */
  public isPasswordHidden = true;

  /**
   * The password wrote by the user
   */
  public password = '';

  ngOnInit(): void {
    const user: User | null = this.userService.user;
    if (!!user && !!user.providerData && !!user.providerData[0] && !!user.providerData[0].providerId) {
      this.isPasswordProvider = user.providerData[0].providerId === 'password';
    }
  }

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService
  ) { }

  /**
   * Ask for log in before deleting the account
   */
  public validate(): void {
    const user: User | null = this.userService.user;
    if (!!user && !!user.providerData && !!user.providerData[0] && !!user.providerData[0].providerId && !!user.email) {
      let obs: Observable<void | null | UserCredential>;
      const provider: string = user.providerData[0].providerId.replace('.com', '');
      switch (provider) {
        case 'google':
        case 'facebook':
          obs = this.authenticationService.signInWithProvider(provider);
          break;
        default:
          obs = this.authenticationService.signIn(user.email, this.password);
          break;
      }
      obs.pipe(
        flatMap(() => {
          return this.userService.deleteProfile();
        })
      ).subscribe(
        () => this.dialogRef.close(true),
        (error) => this.openSnackBar(error)
      );
    }
  }

  /**
   * Open the error snackbar with a message
   */
  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 2000 });
  }
}
