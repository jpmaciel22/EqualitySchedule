import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap'; 

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, NgbCarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  // encapsulation: ViewEncapsulation.Emulated
})
export class HomeComponent {
  user: any;
  constructor(private auth: AuthService){}
  ngOnInit(){
    this.user = this.auth.user()
    if (this.user) {
      console.log('Usuário logado:', this.user);
    }
  }
}
