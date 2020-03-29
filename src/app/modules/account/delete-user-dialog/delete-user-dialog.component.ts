import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthenticationService } from '../../../core/http-services/authentication.service';
import { SignInDialogComponent } from '../sign-in-dialog/sign-in-dialog.component';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.scss']
})
export class DeleteUserDialogComponent implements OnInit {

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void { }

  /**
   * Ask for log in before deleting the account
   */
  public validate() {
    const dialogRef = this.dialog.open(SignInDialogComponent, {data: {isSignUpButtonPresent: false}});
    dialogRef.afterClosed().subscribe(isSignedIn => {
      if (isSignedIn) {
        this.authenticationService.delete(this.authenticationService.user).then(
          () => this.dialogRef.close(true),
          (error) => this.openSnackBar(error)
        );
      } else {
        this.dialogRef.close();
      }
    });
  }

  /**
   * Open the error snackbar with a message
   */
  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 2000,
    });
  }
}
