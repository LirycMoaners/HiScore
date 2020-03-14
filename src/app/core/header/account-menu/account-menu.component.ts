import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../http-services/authentication.service';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss']
})
export class AccountMenuComponent implements OnInit {

  constructor(
    private readonly authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  signOut() {
    this.authenticationService.signOut();
  }
}
