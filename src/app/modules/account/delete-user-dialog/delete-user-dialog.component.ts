import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { UserService } from '../../../core/http-services/user.service';
import { AuthenticationService } from '../../../core/http-services/authentication.service';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.scss']
})
export class DeleteUserDialogComponent {

  /**
   * Boolean to know if the provider of the current user is password or not
   */
  public isPasswordProvider = this.userService.user.providerData[0].providerId;

  /**
   * Boolean that indicates if we need to show the password the user wrotes or not
   */
  public isPasswordHidden = true;

  /**
   * The password wrote by the user
   */
  public password = '';

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService
  ) { }

  /**
   * Ask for log in before deleting the account
   */
  public validate() {
    let obs: Observable<any>;
    const provider: string = this.userService.user.providerData[0].providerId.replace('.com', '');
    switch (provider) {
      case 'google':
      case 'facebook':
        obs = this.authenticationService.signInWithProvider(provider);
        break;
      default:
        obs = this.authenticationService.signIn(this.userService.user.email, this.password);
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

  /**
   * Open the error snackbar with a message
   */
  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss', { duration: 2000 });
  }
}
