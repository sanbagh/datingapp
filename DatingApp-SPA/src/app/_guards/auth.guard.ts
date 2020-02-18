import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertityService: AlertifyService
  ) {}
  canActivate() {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.alertityService.error('you can not pass it');
    this.router.navigate(['/home']);
    return false;
  }
}
