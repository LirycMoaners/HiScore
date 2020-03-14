import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/http-services/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss']
})
export class SignInDialogComponent implements OnInit {

  signInForm: FormGroup;
  errorMessage: string;

  constructor(
    private dialogRef: MatDialogRef<SignInDialogComponent>,
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
      () => this.dialogRef.close(),
      () => this.errorMessage = 'Email or password incorrect'
    );
  }

  signInWithGoogle() {
    this.authenticationService.signInWithGoogle().then(
      () => this.dialogRef.close(),
      (error) => this.errorMessage = error
    );
  }
}
