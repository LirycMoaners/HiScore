import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly fireAuth: AngularFireAuth
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.fireAuth.user.pipe(
      first(),
      map(user => {
        const lastUrlFragment = route.url.pop();
        if (!user && lastUrlFragment && lastUrlFragment.path === 'account') {
          this.router.navigate(['/game-list']);
          return false;
        }
        return true;
      })
    );
  }
}
