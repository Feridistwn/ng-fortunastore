import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    if (await this.authService.isAuthenticatedAsAdmin()) {
      return true;
    } else {
      if (await !this.authService.isAuthenticated()) this.router.navigate(['/login']);
      else this.router.navigate(['/id']);
      return false;
    }
  }
}