import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserTasksComponent } from './components/tasks/user-tasks/user-tasks.component';
import { EnderecoComponent } from './components/auth/endereco/endereco.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'register/endereco', component: EnderecoComponent },
    { path: '', component: HomeComponent, canActivate: [authGuard]},
    {path: 'tasks', component: UserTasksComponent},
    {path: '**', component: NotFoundComponent},
];
