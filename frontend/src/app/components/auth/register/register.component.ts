import { Component, } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule,NgbAlertModule],
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
  especificacao: string = '';
  error: string = '';
  constructor(private loginService: LoginService, private router: Router) { }

  onRegister() {
    if (this.email.includes('@') && this.email.includes('.com')) {
      this.loginService.register(this.email, this.password, this.typeUser, this.nome, this.cpf, this.telefone, this.regiao, this.especificacao).subscribe({
        next: (response) => {
          this.router.navigate(['../', 'login']);
          console.log('Res:', response)
          return;
        },
        error: (error) => {
          console.log('Erro de login: ',error)
          this.error = error.error.message
        }
      })
    } else console.log('Email inválido.')
  }
}

