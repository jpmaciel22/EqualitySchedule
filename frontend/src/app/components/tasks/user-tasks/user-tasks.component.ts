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
  pendentes: any[] = [];
  realizadas: any[] = [];

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
      tap((res: any) => {
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
      return taskDate === todayDate && i.status == 'em-andamento'
    });
  }
  sortPendentes() {
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];
    this.pendentes = this.tasks.filter(i => {
      const taskDate = new Date(i.horario).toISOString().split('T')[0];
      return taskDate > todayDate
    })
  }

  sortRealizadas() {
    this.realizadas = this.tasks.filter(i => {
      console.log('cheguei')
      return i.status == 'realizado'
    })
  }

  onRealizada(codigo: string) {
    this.consultas.marcarRealizado(codigo).subscribe({
      next: (res) => {
        this.loadTasks().subscribe({
          next: () => {
            this.sortToday();
          }
        })
        this.loadTasks().subscribe({
          next: () => {
            this.sortRealizadas();
          }
        })
      },
      error: (err) => {
        console.error('Erro ao marcar como realizada:', err);
      }
    });
  }
  ngOnInit() {
    this.user = this.auth.user()
    if (this.user) {
      console.log('Usuário logado:', this.user);
    }
    forkJoin([
      this.loadTasks(),
    ]).subscribe({
      next: () => {
        this.sortToday();
        this.sortPendentes();
        this.sortRealizadas();
      }
    })
    this.consultas.wasTaskUpdated.subscribe(() => {
      forkJoin([
        this.loadTasks(),
      ]).subscribe({
        next: () => {
          this.sortToday();
          this.sortPendentes();
          this.sortRealizadas();
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
