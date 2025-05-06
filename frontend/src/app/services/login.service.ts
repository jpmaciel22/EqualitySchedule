import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }


  register(email: string, password: string, typeUser: string, nome: string, cpf: string, telefone: string, regiao?: string, tempo?: string): Observable<any> {
      const body: any = { email, password, typeUser, nome, cpf, telefone};
      if (regiao && tempo) {
        body.regiao = regiao;
        body.tempo = tempo;
      }
      return this.http.post('http://localhost:3000/login/register', body);
  }

  login(email: string, password: string, typeUser: string): Observable<any> {
    const body = { email, password, typeUser };
    return this.http.post('http://localhost:3000/login/', body);
  }

}
