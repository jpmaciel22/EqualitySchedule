import { CommonModule} from '@angular/common';
import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn: Observable<boolean>;
  show: boolean = false;
  user: any = '';
  type: any = '';
  constructor(public authService: AuthService) {
    this.isLoggedIn = authService.isLoggedIn();
  }
  ngOnInit(){
    this.authService.user$().subscribe(user => {
    this.user = user;
    this.type = user?.payload?.type || '';
  });
  }

}
