import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'painting-info',
    loadComponent: () => import('./painting-info/painting-info.page').then( m => m.PaintingInfoPage)
  },
];
