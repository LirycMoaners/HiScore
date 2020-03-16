import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../http-services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const lastUrlFragment = route.url.pop();
    if (!this.authenticationService.user && lastUrlFragment && lastUrlFragment.path === 'account') {
      this.router.navigate(['/game-list']);
      return false;
    }
    return true;
  }
}
