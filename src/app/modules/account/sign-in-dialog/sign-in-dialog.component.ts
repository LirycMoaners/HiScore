import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthenticationService } from '../../../core/http-services/authentication.service';
import { SignUpDialogComponent } from '../sign-up-dialog/sign-up-dialog.component';

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss']
})
export class SignInDialogComponent {

  /**
   * Sign in form group
   */
  public signInForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
  });

  /**
   * Error message from log in
   */
  public errorMessage = '';

  /**
   * Used to show the password or not
   */
  public isPasswordHidden = true;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { isSignUpButtonPresent: boolean },
    private readonly dialogRef: MatDialogRef<SignInDialogComponent>,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService
  ) { }

  /**
   * Log in with username & password
   */
  public signIn(): void {
    const email = this.signInForm.get('email')?.value;
    const password = this.signInForm.get('password')?.value;

    if (!!email && !!password) {
      this.authenticationService.signIn(email, password).subscribe(
        () => this.signInSuccess(),
        () => this.errorMessage = 'Email or password incorrect'
      );
    }
  }

  /**
   * Log in with a third party provider
   */
  public signInWithProvider(provider: 'facebook' | 'google'): void {
    this.authenticationService.signInWithProvider(provider).subscribe(
      () => this.signInSuccess(),
      (error) => this.errorMessage = error
    );
  }

  /**
   * Open the register account popup
   */
  public openSignUp(): void {
    this.dialog.open(SignUpDialogComponent);
    this.dialogRef.close();
  }

  /**
   * Redirect to terms page
   */
  public openTerms(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/terms']);
    this.dialogRef.close();
  }

  /**
   * Send an email to reset password
   */
  public forgotPassword(): void {
    const email = this.signInForm.get('email')?.value;

    if (email) {
      this.authenticationService.forgotPassword(email).then(
        () => this.snackBar.open('We send you an email to reset your password !', undefined, { duration: 3000 })
      );
    } else {
      this.snackBar.open('You need to provide an email address to reset you password !', undefined, { duration: 3000 });
    }
  }

  /**
   * Show success message and close
   */
  private signInSuccess(): void {
    this.snackBar.open('Successfully logged in !', undefined, { duration: 3000 });
    this.dialogRef.close(true);
  }
}
