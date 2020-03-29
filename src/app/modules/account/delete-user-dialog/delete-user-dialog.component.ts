import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/http-services/authentication.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  ngOnInit(): void {
  }

  validate() {
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

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 2000,
    });
  }

}
