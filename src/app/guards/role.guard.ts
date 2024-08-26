import { inject, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = next.data['roles'] as Array<string>;
  console.log(allowedRoles)
  const userRole = authService.getUserRole();
  if (!userRole || !allowedRoles.includes(userRole)) {
    router.navigateByUrl('/register');
    return false;
  }

  return true;
};
