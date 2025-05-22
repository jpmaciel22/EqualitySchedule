import { Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-new-task',
  imports: [CommonModule, FormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css'
})
export class NewTaskComponent {
  constructor(private auth:AuthService){}
  codigo: number = Number((Math.random()*1000000).toString().split('.').join(''))
  data: any;
  descricao: string = '';
  user: any;
  medico: any;
  ngOnInit(){
        this.user = this.auth.user();
        this.user = this.user.payload.cpf;
  }
  teste(){
    console.log(this.data,this.descricao,this.medico,this.user,this.codigo)
  }

}
