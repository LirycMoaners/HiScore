import { Component, OnInit, Input, Inject } from '@angular/core';
import { AuthenticationService } from '../../../core/http-services/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SignUpDialogComponent } from '../sign-up-dialog/sign-up-dialog.component';

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss']
})
export class SignInDialogComponent implements OnInit {

  signInForm: FormGroup;
  errorMessage: string;
  hide = true;

  constructor(
    private dialogRef: MatDialogRef<SignInDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isSignUpButtonPresent: boolean },
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private readonly authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  signIn() {
    const email = this.signInForm.get('email').value;
    const password = this.signInForm.get('password').value;

    this.authenticationService.signIn(email, password).then(
      () => this.dialogRef.close(true),
      () => this.errorMessage = 'Email or password incorrect'
    );
  }

  signInWithGoogle() {
    this.authenticationService.signInWithGoogle().then(
      () => this.dialogRef.close(true),
      (error) => this.errorMessage = error
    );
  }

  openSignUp() {
    const dialofRef = this.dialog.open(SignUpDialogComponent);
    dialofRef.afterClosed().subscribe(isSignedUp => {
      if (isSignedUp) {
        this.dialogRef.close();
      }
    });
  }
}
