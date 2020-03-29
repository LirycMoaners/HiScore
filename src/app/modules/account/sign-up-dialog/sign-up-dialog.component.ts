import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';

import { AuthenticationService } from '../../../core/http-services/authentication.service';

@Component({
  selector: 'app-sign-up-dialog',
  templateUrl: './sign-up-dialog.component.html',
  styleUrls: ['./sign-up-dialog.component.scss']
})
export class SignUpDialogComponent implements OnInit {

  /**
   * Sign up form group
   */
  public signUpForm: FormGroup;

  /**
   * Error message from register an account
   */
  public errorMessage: string;

  /**
   * Used to show the password or not
   */
  public isPasswordHidden = true;

  /**
   * Picture in base 64 before upload
   */
  public picture: SafeUrl;

  constructor(
    private readonly dialogRef: MatDialogRef<SignUpDialogComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
    private readonly sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Create a username/password account
   */
  public signUp() {
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;
    const username = this.signUpForm.get('username').value;
    const picture = this.signUpForm.get('picture').value;

    this.authenticationService.signUp(email, password, username, picture).then(
      () => {
        this.router.navigate(['/game-list']);
        this.dialogRef.close(true);
      },
      (error) => this.errorMessage = error
    );
  }

  /**
   * Update user's picture
   */
  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const [file]: [File] = event.target.files;
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        this.signUpForm.patchValue({
          picture: file
        });
        this.picture = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      }
    }
  }

  /**
   * Init the form group with form controls
   */
  private initForm() {
    this.signUpForm = this.formBuilder.group({
      picture: ['', []],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }
}
