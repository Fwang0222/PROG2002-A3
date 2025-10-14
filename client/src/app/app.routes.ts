import { Routes } from '@angular/router';
import {Details} from './details/details';
import {Search} from './search/search';
import {Home} from './home/home';
import {Registration} from './registration/registration';
import {Admin} from './admin/admin';
import {AdminCategories} from './admin/admin-categories/admin-categories';
import {AdminEvents} from './admin/admin-events/admin-events';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'search',
    component: Search
  },
  {
    path: 'details/:id',
    component: Details
  },
  {
    path: 'registration/:id',
    component: Registration
  },
  {
    path: 'admin',
    component: Admin,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/admin/categories',
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
