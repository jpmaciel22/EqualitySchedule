import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-tasks',
  imports: [],
  templateUrl: './user-tasks.component.html',
  styleUrl: './user-tasks.component.css'
})

export class UserTasksComponent {
  user: any;
  email: any =  '';
  userId: any = '';
  constructor(private auth: AuthService){
  }
   ngOnInit(){
    this.user = this.auth.user()
    if (this.user) {
      console.log('Usuário logado:', this.user);
    }
    this.transformaId();
  }
  transformaId(){
  this.email = this.user?.payload.email;
  this.email = this.email.split('@');
  this.userId = this.email[0]
  console.log(this.userId)
  }
}
