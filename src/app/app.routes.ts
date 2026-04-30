import { Routes } from '@angular/router';
import { ListaComponent } from './lista/lista.component';
import { UserComponent } from './user/user.component';

export const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: 'tasks', component: ListaComponent },
  { path: 'users', component: UserComponent }
];
