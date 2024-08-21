import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { inject } from '@angular/core';
import { NotificacionService, TipoMessage } from './notification.service';

// Clase UserGuard
export class UserGuard {
  authService: AuthenticationService = inject(AuthenticationService);
  router: Router = inject(Router);
  noti: NotificacionService = inject(NotificacionService);
  auth: boolean = false;
  currentUser: any;

  constructor() {
    // Suscribirse a los cambios del usuario y autenticación
    this.authService.decodeToken.subscribe((user) => (this.currentUser = user));
    this.authService.isAuthenticated.subscribe((auth) => (this.auth = auth));
  }

  checkUserLogin(route: ActivatedRouteSnapshot): boolean {
    if (this.auth) {
      const userRole = this.currentUser.role;
      if (route.data['roles'].length && !route.data['roles'].includes(userRole)) {
        this.noti.mensajeRedirectTimed(
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
    this.noti.mensajeRedirectTimed(
      'User',
      'You must login to access this page',
      TipoMessage.warning,
      '/user/login'
    );
    this.router.navigate(['/user/login']);
    return false;
  }
}

// Exportar el guard como una función CanActivateFn
export const authGuard: CanActivateFn = (route, state) => {
  let guard = new UserGuard();
  return guard.checkUserLogin(route);
};
