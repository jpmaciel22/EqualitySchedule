import { Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { TaskService } from '../../../services/task.service';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-task',
  imports: [CommonModule, FormsModule, NgbAlert],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css'
})
export class NewTaskComponent {
  constructor(private auth:AuthService, private task: TaskService){}
  codigo: number = Number(Math.floor(Math.random()*10000).toString().split('.').join(''))
  data: any;
  descricao: string = '';
  user: any;
  medico_cpf: any;
  error: any;
  success: string = '';
  medicos: any[] = [];

  ngOnInit(){
        this.user = this.auth.user();
        this.user = this.user.payload.cpf;
        this.loadMedicos()
  }
  criarTask(){
    this.task.criarTask(this.codigo, this.data, this.descricao, this.user, this.medico_cpf).subscribe({
      next: (res: any) => {
        this.success = res.message;
        this.task.taskWasCreated();
        return;
      },error: (error) => {
          const msgSuccess = document.querySelector('.success');
          if(msgSuccess){
            msgSuccess.remove();
          }
          console.log('Erro de login: ',error)
          this.error = error.error.message
        }
    },)
  }
  loadMedicos(){
    this.task.getMedicos().subscribe({
      next: (res:any) => {
        this.medicos = res?.data
        console.log(res)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

}
