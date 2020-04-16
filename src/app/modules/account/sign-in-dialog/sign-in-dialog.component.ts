import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { auth } from 'firebase/app';

import { AuthenticationService } from '../../../core/http-services/authentication.service';
import { SignUpDialogComponent } from '../sign-up-dialog/sign-up-dialog.component';

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss']
})
export class SignInDialogComponent implements OnInit {

  /**
   * Sign in form group
   */
  public signInForm: FormGroup;

  /**
   * Error message from log in
   */
  public errorMessage: string;

  /**
   * Used to show the password or not
   */
  public isPasswordHidden = true;

  /**
   * Provider for Google authentication
   */
  public googleProvider = new auth.GoogleAuthProvider();

  /**
   * Provider for Facebook authentication
   */
  public facebookProvider = new auth.FacebookAuthProvider();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { isSignUpButtonPresent: boolean },
    private readonly dialogRef: MatDialogRef<SignInDialogComponent>,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Log in with username & password
   */
  public signIn() {
    const email = this.signInForm.get('email').value;
    const password = this.signInForm.get('password').value;

    this.authenticationService.signIn(email, password).subscribe(
      () => this.dialogRef.close(true),
      () => this.errorMessage = 'Email or password incorrect'
    );
  }

  /**
   * Log in with a third party provider
   */
  public signInWithProvider(provider: 'facebook' | 'google') {
    this.authenticationService.signInWithProvider(provider).subscribe(
      () => this.dialogRef.close(true),
      (error) => this.errorMessage = error
    );
  }

  /**
   * Open the register account popup
   */
  public openSignUp() {
    this.dialog.open(SignUpDialogComponent);
    this.dialogRef.close();
  }

  /**
   * Redirect to terms page
   */
  public openTerms(event: Event) {
    event.preventDefault();
    this.router.navigate(['/terms']);
    this.dialogRef.close();
  }

  /**
   * Send an email to reset password
   */
  public forgotPassword() {
    const email = this.signInForm.get('email').value;

    if (email) {
      this.authenticationService.forgotPassword(email).then(
        () => this.snackBar.open('We send you an email to reset your password !', null, { duration: 3000 })
      );
    } else {
      this.snackBar.open('You need to provide an email address to reset you password !', null, { duration: 3000 })
    }
  }

  /**
   * Init the form group with form controls
   */
  private initForm() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }
}
