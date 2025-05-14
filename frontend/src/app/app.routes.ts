import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TasksComponent } from './components/tasks/tasks.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    { path: '', component: HomeComponent, canActivate: [authGuard]},
    {path: 'tasks', component: TasksComponent},
    {path: '**', component: NotFoundComponent},
];
