import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnderecoService } from '../../services/endereco.service';

@Component({
  selector: 'app-regiao',
  imports: [FormsModule, CommonModule],
  templateUrl: './regiao.component.html',
  styleUrl: './regiao.component.css'
})
export class RegiaoComponent {
  text: string = ''
  medicos: any[] = [];

  constructor( private endereco: EnderecoService ){}

  onSubmit(){
    this.endereco.regiao(this.text).subscribe({
      next: (res:any) => {
        console.log(res)
        this.medicos = res?.data
      },
      error: (err) => {
        this.medicos = [];
      }
    })
  }
}
