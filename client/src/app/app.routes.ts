import { Routes } from '@angular/router';
import {Details} from './details/details';
import {Search} from './search/search';
import {Home} from './home/home';

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
  }
];
