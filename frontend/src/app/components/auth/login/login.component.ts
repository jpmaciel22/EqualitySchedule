import { Component } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

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
  typeUser: string = '';

  constructor(private loginService: LoginService, private router: Router, private authService: AuthService) {}


  onLogin() {
    this.authService.authenticate(this.email, this.password, this.typeUser).subscribe({
      next: (response) => {
        if (response.success == false) {
          this.router.navigate(['/']);
          return;
        }
        console.log('Login sucesso:', response);
        this.authService.login(response.token);
        this.authService.user(response.nome, response.email)
        this.router.navigate(['/']); // redireciona para a home
      },
      error: (error) => {
        if (error.error.error === 'Login inexistente.') {
          this.router.navigate(['/register']);
        }
        console.error('Erro de login:', error.error.error);
        
      }
    });
  }
}