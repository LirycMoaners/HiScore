import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private readonly sanitizer: DomSanitizer,
    private readonly snackBar: MatSnackBar,
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
    const areTermsAccepted = this.signUpForm.get('areTermsAccepted').value;

    if (areTermsAccepted) {
      const reader  = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          this.authenticationService.signUp(email, password, username, img).subscribe(
            () => {
              this.router.navigate(['/game-list']);
              this.snackBar.open('Successfully registerd !', null, { duration: 3000 });
              this.dialogRef.close(true);
            },
            (error) => this.errorMessage = error
          );
        }
        img.src = e.target.result as string;
      }
      reader.readAsDataURL(picture);
    }
  }

  /**
   * Update user's picture
   */
  public onFileChange(event) {
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
   * Redirect to terms page
   */
  public openTerms(event: Event) {
    event.preventDefault();
    this.router.navigate(['/terms']);
    this.dialogRef.close();
  }

  /**
   * Init the form group with form controls
   */
  private initForm() {
    this.signUpForm = this.formBuilder.group({
      picture: ['', []],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      areTermsAccepted: ['', Validators.required]
    });
  }
}
