import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NewTaskComponent } from '../new-task/new-task.component';
import { TaskService } from '../../../services/task.service';
import { PostgredatepipePipe } from '../../../pipes/postgredatepipe.pipe';


@Component({
  selector: 'app-user-tasks',
  imports: [CommonModule, RouterLink, NewTaskComponent, PostgredatepipePipe],
  templateUrl: './user-tasks.component.html',
  styleUrl: './user-tasks.component.css'
})
export class UserTasksComponent {
  tasks: any[] = [];

  realizadas = [
    { nome: 'Consulta de Maio' },
    { nome: 'Avaliação Psicológica' },
  ];

  pendentes = [
    { nome: 'Nutrição Junho' },
    { nome: 'Consulta Jurídica' },
  ];

  isOpen: boolean = false;
  user: any;
  email: any = '';
  userId: any = '';
  constructor(private auth: AuthService, private router: Router, private consultas: TaskService) {
    this.router.events.subscribe(() => {
      this.isOpen = this.router.url.includes('/tasks/new-task');
    });
  }
  ngOnInit() {
    this.user = this.auth.user()
    if (this.user) {
      console.log('Usuário logado:', this.user);
    }
    this.transformaId();
    this.consultas.getAllTasks(this.user?.payload.cpf).subscribe({
      next: (res: any) => {
        console.log(res)
        this.tasks = res.data
      }
    })
    this.consultas.wasTaskUpdated.subscribe(() => {
      this.consultas.getAllTasks(this.user?.payload.cpf).subscribe({
        next: (res: any) => {
          console.log(res)
          this.tasks = res.data
        }
      })
    })
  }
  transformaId() {
    this.email = this.user?.payload.email;
    this.email = this.email.split('@');
    this.userId = this.email[0]
    console.log(this.userId)
  }


  closeModal() {
    this.router.navigate(['/tasks']);
  }
}
