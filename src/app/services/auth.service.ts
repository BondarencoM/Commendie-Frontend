import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as Oidc from 'oidc-client';
import { environment } from 'src/environments/environment';
import { AuthenticatedUser } from '../models/AuthenticatedUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private manager = new Oidc.UserManager({
    authority: environment.authenticationAuthority,
    client_id: 'angular-app',
    redirect_uri: 'http://localhost:4200/auth-callback',
    post_logout_redirect_uri: window.origin + '/auth-signout-callback',
    response_type: 'code',
    automaticSilentRenew: true,
    scope: 'openid profile recommendation-service user-profile-service',
    filterProtocolClaims: true,
    loadUserInfo: true,
    silent_redirect_uri: 'http://localhost:4200/auth-silent-callback',
})

  UserChanged = new EventEmitter<AuthenticatedUser>()

  constructor(private router: Router) {
    if (!environment.production) { Oidc.Log.logger = console }

    this.manager.events.addUserLoaded( u => this.notifyUserChanged(u))
    this.manager.events.addUserUnloaded(() => this.notifyUserChanged())
   }

  private notifyUserChanged(user?: Oidc.User): void{
    this.UserChanged.emit(user ? new AuthenticatedUser(user) : null)
  }

  startAuthentication(returnUrl: string = null): void{
    this.saveRestorePath(returnUrl)
    this.manager.signinRedirect().catch(e => console.log({authenticationError: e}))
  }

  completeAuthentication = () => {
    if (window.location.hash){
      this.manager.signinRedirectCallback().then(() => this.restorePath())
    }
  }

  startRegistrationRedirect(): void {
    this.saveRestorePath()
    const callback = encodeURIComponent(window.location.origin + '/registration-callback')
    window.location.href = environment.authenticationAuthority + '/Account/Register?returnUrl=' + callback
  }

  startAuthenticationSilently(): void{
    this.manager.signinSilent()
    .then(this.restorePath)
    .catch(e => console.log({authenticationError: e}));
  }

  completeAuthenticationSilently = () => this.manager.signinSilentCallback()

  startSignOut(): void {
    // for now, returning to the same page after signout may conflict with auth guards
    this.saveRestorePath('/')
    this.manager.signoutRedirect()
  }

  completeSignOut = () => this.manager.signoutRedirectCallback().then(this.restorePath)

  async getAuthenticatedeUser(): Promise<AuthenticatedUser>{
    try{
      const user = await this.manager.getUser();
      return new AuthenticatedUser(user);
    }catch (ex){
      console.log({authenticationError: ex})
    }

  }

  private saveRestorePath = (returnUrl: string = null) => localStorage.setItem('restore-url', returnUrl || window.location.pathname)

  private restorePath = () => {
    this.router.navigateByUrl(localStorage.getItem('restore-url') || '/')
  }

}
