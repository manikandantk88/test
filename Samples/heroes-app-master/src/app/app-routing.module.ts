import { NgModule }             from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterModule, RouterStateSnapshot, Routes, UrlTree } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { HeroesComponent }      from './heroes/heroes.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';
import { Observable } from 'rxjs/internal/Observable';
import { OAuthService } from 'angular-oauth2-oidc';

class CanActivateRoute implements CanActivate {
  constructor(private oauthService: OAuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    let hasIdToken = this.oauthService.hasValidIdToken();
    let hasAccessToken = this.oauthService.hasValidAccessToken();
    var result = (hasIdToken && hasAccessToken);
    console.debug("Is Route activated:" + result);
    return result;
  }
}

const routes: Routes = [
  { path: '', redirectTo: '/heroes', pathMatch: 'full', canActivate: [CanActivateRoute] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [CanActivateRoute]  },
  { path: 'detail/:id', component: HeroDetailComponent, canActivate: [CanActivateRoute]  },
  { path: 'heroes', component: HeroesComponent, canActivate: [CanActivateRoute] }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { initialNavigation: false })],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
