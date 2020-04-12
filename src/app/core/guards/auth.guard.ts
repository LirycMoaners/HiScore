import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';

import { UserService } from '../http-services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const lastUrlFragment = route.url.pop();
    if (!this.userService.user && lastUrlFragment && lastUrlFragment.path === 'account') {
      this.router.navigate(['/game-list']);
      return false;
    }
    return true;
  }
}
