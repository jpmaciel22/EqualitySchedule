import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
  constructor(private router: Router, private loginService: LoginService,) { }

  private hasToken() : boolean { // apenas para inicializar
    return !!localStorage.getItem('token');
  }

  login(token: string) {
    localStorage.setItem('token', token);
    this.isLoginSubject.next(true);
  }

  logout() : void {
    localStorage.removeItem('token');
    this.isLoginSubject.next(false);
  }

  isLoggedIn() : Observable<boolean> { // o que de fato usaremos nos subscribers do servico.
    return this.isLoginSubject.asObservable();
   }

   authenticate(email: string, password: string): Observable<any> {
    return this.loginService.login(email, password);
  }
}
