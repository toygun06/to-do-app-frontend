import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpService } from './http.service';
import { LocalStorageService } from './local-storage.service';
import { Observable, map, of, take } from 'rxjs';
import { SwalService } from './swal.service';
import { UserModel } from '../models/userModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private http: HttpService,
    private localStorage: LocalStorageService,
    private swal: SwalService
  ) { }

  isAuthenticated(): Observable<boolean> {
    const token: string | null = this.localStorage.getItem('token');

    if (!token) {
      this.router.navigateByUrl('/');
      return new Observable((observer) => observer.next(false));
    }

    const expired: boolean = this.isTokenExpired(token);

    if (expired) {
      this.router.navigateByUrl('/');
      return new Observable((observer) => observer.next(false));
    }
    return new Observable((observer) => observer.next(true));
  }

  private isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  getUserRole(): string | null {
    const token: string = this.localStorage.getItem('token');
    if (token) {
      const decodedToken: any = this.jwtHelper.decodeToken(token);
      console.log(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
      return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];  // JWT içindeki role claim'i kontrol edin

    }
    return null;
  }

  // isAdmin(): boolean {
  //   return this.getUserRole() === 'Admin';
  // }

  isUser(): boolean {
    return this.getUserRole() === 'User';
  }

  // isDoctor(): boolean {
  //   return this.getUserRole() === 'Doctor';
  // }

  getUserId(): string | null {
    const token: string = this.localStorage.getItem('token');
    if (token) {
      const decodedToken: any = this.jwtHelper.decodeToken(token);
      return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    }
    return null;
  }

logout() {
  this.swal.callSwal(
    'Çıkış Yapılacaktır',
    'Sistemden çıkmak istediğinize eminmisiniz?',
    () => {
      this.localStorage.clear();
      this.router.navigateByUrl('');
      this.swal.callToast('Çıkış işlemi başarılı.', 'success');
    },
    'Evet'
  );
}
  get isAuthenticatedByUserId(): number {
  return parseInt(this.localStorage.getItem('id') || '0');
}
}
