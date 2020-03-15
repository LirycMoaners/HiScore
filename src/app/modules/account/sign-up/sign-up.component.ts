import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeaderService } from 'src/app/core/header/header.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/http-services/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup;
  errorMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private readonly router: Router,
    private headerService: HeaderService,
    private readonly authenticationService: AuthenticationService,
    private readonly cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.headerService.title = 'Sign up';
    this.initForm();
  }

  initForm() {
    this.signUpForm = this.formBuilder.group({
      picture: ['', []],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  signUp() {
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;
    const username = this.signUpForm.get('username').value;
    const picture = this.signUpForm.get('picture').value;

    this.authenticationService.signUp(email, password, username, picture).then(
      () => this.router.navigate(['/game-list']),
      (error) => this.errorMessage = error
    );
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.signUpForm.patchValue({
        picture: file
      });
    }
  }
}
