import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NewTaskComponent } from '../new-task/new-task.component';
import { TaskService } from '../../../services/task.service';
import { PostgredatepipePipe } from '../../../pipes/postgredatepipe.pipe';
import { forkJoin, Observable, tap } from 'rxjs';


@Component({
  selector: 'app-user-tasks',
  imports: [CommonModule, RouterLink, NewTaskComponent, PostgredatepipePipe],
  templateUrl: './user-tasks.component.html',
  styleUrl: './user-tasks.component.css'
})
export class UserTasksComponent {
  tasks: any[] = [];
  tasksToday: any[] = [];

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

 loadTasks(): Observable<any> {
  return this.consultas.getAllTasks(this.user?.payload.cpf, this.user?.payload.type).pipe(
    tap((res:any)=> {
      this.tasks = res.data;
      console.log(this.tasks)
    })
  );
}

  sortToday() {
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0]; // '2025-05-28'
    this.tasksToday = this.tasks.filter(i => {
      const taskDate = new Date(i.horario).toISOString().split('T')[0];
      return taskDate === todayDate;
    });
  }

  ngOnInit() {
    this.user = this.auth.user()
    if (this.user) {
      console.log('Usuário logado:', this.user);
    }
    this.loadTasks();
    this.transformaId();
    forkJoin([
      this.loadTasks()
    ]).subscribe({
      next: () => {
        this.sortToday();
      }
    })
    // this.consultas.wasTaskUpdated.subscribe(() => {
    //   this.loadTasks();
    // })
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
