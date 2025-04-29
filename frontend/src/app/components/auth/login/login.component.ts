import { Component } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private loginService: LoginService, private router: Router) {}


  onLogin() {
    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        if(response.success == false){
          this.router.navigate(['/']);
          return;
        }
        console.log('Login sucesso:', response);
        localStorage.setItem('token', response.token); // salva token local
        this.router.navigate(['/']); // redireciona para a home
      },
      error: (error) => {
        if(error.error.error == 'Login inexistente.'){
          this.router.navigate(['/','register']);
        }
        console.error('Erro de login:', error.error.error); // mostra erro
      }
    });
  }
}