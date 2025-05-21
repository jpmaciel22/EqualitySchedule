import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { EnderecoService } from '../../../services/endereco.service';

@Component({
  selector: 'app-endereco',
  imports: [FormsModule, CommonModule,NgbAlertModule],
  templateUrl: './endereco.component.html',
  styleUrl: './endereco.component.css'
})
export class EnderecoComponent {
    constructor(private enderecoService: EnderecoService, private auth: AuthService) { }
  error: string = '';
  rua: string = '';
  cidade: string = '';
  estado: string = '';
  typeUser: string = '';
  user: any = '';
  cpf: string = '';

 ngOnInit(){
  this.user = this.auth.user()
  this.typeUser = this.user.payload.type;
  this.cpf = this.user.payload.cpf;
}

  onRegisterEndereco(){
    this.enderecoService.cadastrar(this.rua,this.cidade,this.estado,this.typeUser, this.cpf).subscribe({
      next: (res) => {
        console.log('Endereco cadastrado com sucesso.',res)
      },
      error: (error) => {
        console.error('Erro de cadastro:', error.error);
        this.error = error.error.message;
      }
    })
  }
}
