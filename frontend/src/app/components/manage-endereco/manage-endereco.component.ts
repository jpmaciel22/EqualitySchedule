import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
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
  enderecos: any = [];
  user: any;
  typeUser: any;
  cpf: any;
  tarefa: any;
  constructor(private auth: AuthService, private endereco: ManageEnderecoService,) { }
  ngOnInit() {
    this.user = this.auth.user()
    this.typeUser = this.user.payload.type;
    this.cpf = this.user.payload.cpf;
    this.endereco.getAll(this.cpf, this.typeUser).subscribe({
      next: (res: any) => {
        this.enderecos = res.data;
        console.log(res)
      }
    })
  }

  deleteOne(id:any) {
    this.endereco.deletar(id,this.cpf,this.typeUser).subscribe({
      next:(res) => {
        console.log(res)
        this.enderecos = this.enderecos.filter((e:any) => e.id_endereco !== id);
      }
    })
  }

}
