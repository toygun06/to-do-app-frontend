import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AuthService } from './services/auth.service';
import { RoleGuard } from './guards/role.guard';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [()=>inject(AuthService).isAuthenticated(),()=>inject(AuthService),RoleGuard],
    data: { roles: ['User'] },
    children: [
      // {
      //   path: '',
      //   component: null,
      // },
    ],
  },
];
