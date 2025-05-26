import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ManageEnderecoService } from '../../services/manage-endereco.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-manage-endereco',
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-endereco.component.html',
  styleUrl: './manage-endereco.component.css'
})
export class ManageEnderecoComponent {
  enderecos:any = [];
  user:any;
  typeUser: any;
  cpf:any;
  constructor(private auth: AuthService, private endereco: ManageEnderecoService){}
   ngOnInit(){
  this.user = this.auth.user()
  this.typeUser = this.user.payload.type;
  this.cpf = this.user.payload.cpf;
  this.endereco.getAll(this.cpf,this.typeUser).subscribe({
    next: (res: any) => {
      this.enderecos = res.data;
      console.log(res)
    }
  })
}

}
