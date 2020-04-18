import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { flatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { SignInDialogComponent } from '../sign-in-dialog/sign-in-dialog.component';
import { UserService } from '../../../core/http-services/user.service';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.scss']
})
export class DeleteUserDialogComponent {

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly userService: UserService
  ) { }

  /**
   * Ask for log in before deleting the account
   */
  public validate() {
    const dialogRef = this.dialog.open(SignInDialogComponent, {data: {isSignUpButtonPresent: false}});
    dialogRef.afterClosed().pipe(
      flatMap(isSignedIn => {
        if (isSignedIn) {
          return this.userService.deleteProfile();
        }
        return of(null)
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
