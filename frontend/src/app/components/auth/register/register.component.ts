import { Component } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {


  email: string = '';
  password: string = '';
  typeUser: string = '';
  cpf: string = '';
  telefone: string = '';
  nome: string = '';
  regiao: string = '';
  tempo: string = '';

  constructor(private loginService: LoginService, private router: Router) { }

  onRegister() {
    console.log(this.typeUser)
    if (this.email.includes('@') && this.email.includes('.com')) {
      this.loginService.register(this.email, this.password, this.typeUser, this.nome, this.cpf, this.telefone, this.regiao, this.tempo).subscribe({
        next: (response) => {
          if (response.success == false) {
            console.log(response)
            this.router.navigate(['/']);
            return;
          }
          this.router.navigate(['../', 'login']);
          console.log('Res:', response)
          return;
        }
      })
    } else console.log('Email inválido.')
  }
}
