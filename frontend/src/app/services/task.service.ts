import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  criarTask(codigo: number, data: any, descricao: string, user: string, medico: string){
    const body = {codigo, data, descricao, user, medico};
        return this.http.post('http://localhost:3000/tasks', body);

  }
}
