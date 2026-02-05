import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'valentinesmagic',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
