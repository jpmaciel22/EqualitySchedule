import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManageEnderecoService {

  constructor(private http: HttpClient) { }
  getAll(cpf: any, typeUser: any){
    const body = {cpf, typeUser};
    return this.http.post('http://localhost:3000/endereco/get', body)
  }
  deletar(id:any,cpf:any,typeUser:any){
    const body = {id,cpf,typeUser};
    return this.http.post('http://localhost:3000/endereco/delete',body)
  }
}
