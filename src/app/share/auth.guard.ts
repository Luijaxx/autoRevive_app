import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { inject } from '@angular/core';
import { NotificacionService, TipoMessage } from './notification.service';

export class UserGuard {
  authService : AuthenticationService = inject(AuthenticationService);
  router: Router = inject(Router);
  noti: NotificacionService = inject(NotificacionService);
  auth: boolean = false;
  currentUser: any;
  constructor() {
    //current user assign
    this.authService.decodeToken.subscribe((user) => (this.currentUser = user));
    this.authService.isAuthenticated.subscribe((auth) => (this.auth = auth));

  }

  checkUserLogin(route:ActivatedRouteSnapshot): boolean {
    if(this.auth){
    const userRole = this.currentUser.role;
    //roles.leng && roles.indexOf(verify.role)===-1
    if(route.data['roles'].length && route.data['roles'].includes(userRole)===-1){
      this.noti.mensajeRedirect(
        'User',
        'You do not have permission to access this page',
        TipoMessage.warning,
        '/user/login'
      );
      this.router.navigate(['/user/login']);
      return false;
    }
    return true;
}
this.noti.mensajeRedirect(
'User',
'You must login to access this page',
TipoMessage.warning,
'/user/login'
);
this.router.navigate(['/user/login']);
return false;
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  return true;
};
