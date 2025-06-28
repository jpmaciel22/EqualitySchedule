import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserTasksComponent } from './components/tasks/user-tasks/user-tasks.component';
import { EnderecoComponent } from './components/auth/endereco/endereco.component';
import { NewTaskComponent } from './components/tasks/new-task/new-task.component';
import { ManageEnderecoComponent } from './components/manage-endereco/manage-endereco.component';
import { RegiaoComponent } from './components/regiao/regiao.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: HomeComponent, canActivate: [authGuard]},
    { path: 'register', component: RegisterComponent },
    { path: 'register/endereco', component: EnderecoComponent, canActivate: [authGuard] },
    {path: 'tasks', component: UserTasksComponent, canActivate: [authGuard], children:[
        {path:'new-task', component: NewTaskComponent, canActivate: [authGuard]}
    ]},
    {path: 'endereco', component: ManageEnderecoComponent, canActivate: [authGuard]},
    {path: 'regiao', component: RegiaoComponent, canActivate: [authGuard]},
    {path: '**', component: NotFoundComponent},
];
