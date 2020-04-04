import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthenticationService } from '../../../core/http-services/authentication.service';
import { SignInDialogComponent } from '../sign-in-dialog/sign-in-dialog.component';
import { flatMap } from 'rxjs/operators';
import { of } from 'rxjs';

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
    dialogRef.afterClosed().pipe(
      flatMap(isSignedIn => isSignedIn ? this.authenticationService.delete(this.authenticationService.user) : of(null))
    ).subscribe(
      () => this.dialogRef.close(),
      (error) => this.openSnackBar(error)
    );
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
