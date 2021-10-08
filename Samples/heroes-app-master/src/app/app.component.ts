import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NullValidationHandler, OAuthService, AuthConfig, OAuthErrorEvent } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tour of Heroes';
  public claims: any;
  public hasValidAccessToken: boolean = false;
  url: string;

  constructor(private router: Router,
    private oauthService: OAuthService) {
      this.url = window.location.origin;
      console.debug(this.url);
      this.configure();
      console.log("OAuth is configured");
    //this.setupAutomaticSilentRefresh();
  }

  public login() {
    if(false == this.oauthService.hasValidIdToken()) {
      this.oauthService.initCodeFlow();
      console.log("OAuth login is initiated");
    }
  }
  
  public logoff() {
    this.oauthService.logOut();
  }
  
  async configure() {
    let authConfig: AuthConfig = {
      issuer: 'http://142.93.208.231:7080/auth/realms/tomax',
      redirectUri: window.location.origin,
      logoutUrl: window.location.origin,
      clientId: 'tomax-oauth-client-id',
      //dummyClientSecret: '2ea5dc66-8e1c-4e7c-aac0-52a42594a6ac',
      scope: 'openid profile email',
      responseType: 'code',
      requireHttps: false,
      // at_hash is not present in JWT token
      disableAtHashCheck: true,
      //postLogoutRedirectUri: window.location.origin + "/heroes",
      showDebugInformation: true,
      useSilentRefresh: true,
    }
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.setupAutomaticSilentRefresh();
    await this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken()) {
        this.router.navigateByUrl("");
      } else {
        // init with requested URL so it can be retrieved on response from state
        this.oauthService.initCodeFlow();
      }
    });
  }

//   private setupAutomaticSilentRefresh() {
//     this.oauthService.setupAutomaticSilentRefresh();
//   }

//   public name() {
//      this.claims = this.oauthService.getIdentityClaims();
//      console.log(this.claims);
//     if (!this.claims) return null;
//     return this.claims;
// }

// public validAccessToken() {
//     this.hasValidAccessToken = this.oauthService.hasValidAccessToken();
//     console.log(this.hasValidAccessToken);
// }
}
