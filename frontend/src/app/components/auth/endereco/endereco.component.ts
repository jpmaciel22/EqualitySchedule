import { Component } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-endereco',
  imports: [FormsModule, CommonModule,NgbAlertModule],
  templateUrl: './endereco.component.html',
  styleUrl: './endereco.component.css'
})
export class EnderecoComponent {
    constructor(private loginService: LoginService, private router: Router, private auth: AuthService) { }
  error: string = '';
  rua: string = '';
  cidade: string = '';
  estado: string = '';
  typeUser: string = '';
  user: any = '';

 ngOnInit(){
  this.user = this.auth.user()
  this.typeUser = this.user.payload.type;
}

  onRegisterEndereco(){
    console.log('porraaaa')
  }
}
