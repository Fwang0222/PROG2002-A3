import { Routes } from '@angular/router';
import {Admin} from './admin/admin';
import {AdminCategories} from './admin/admin-categories/admin-categories';
import {AdminEvents} from './admin/admin-events/admin-events';

export const routes: Routes = [
  {
    path: '',
    component: Admin,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'categories',
      },
      {
        path: 'categories',
        component: AdminCategories
      },
      {
        path: 'events',
        component: AdminEvents
      },
    ]
  }
];
