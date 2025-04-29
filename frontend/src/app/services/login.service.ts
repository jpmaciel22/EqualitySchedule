import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }


  register(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post('http://localhost:3000/login/register', body);
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post('http://localhost:3000/login/', body);
  }

}
