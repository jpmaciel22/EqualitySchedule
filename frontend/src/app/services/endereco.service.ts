import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {

  constructor(private http: HttpClient) { }

    cadastrar(rua: string, cidade: string , estado: string, typeUser: string, cpf: string): Observable<any> {
        const body: any = { rua, cidade, estado, typeUser, cpf};
        return this.http.post('http://localhost:3000/endereco', body);
    }
}
