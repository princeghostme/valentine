import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'valentine',
    pathMatch: 'full'
  },
  {
    path: 'valentine',
    loadComponent: () => import('./pages/register/register').then(m => m.Register)
  },
  {
    path: 'valentinesmagic',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  }
];
