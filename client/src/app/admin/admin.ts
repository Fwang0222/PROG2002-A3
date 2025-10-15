import { Component } from '@angular/core';
import {Navigation} from '../navigation/navigation';
import {RouterModule} from '@angular/router';
import {Heart} from '../heart/heart';

type Tab = 'categories' | 'events' | 'registrations';

@Component({
  selector: 'app-admin',
  imports: [Navigation, RouterModule, Heart],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  activeTab: Tab = 'categories';

  switchTab(tab: Tab) {
    this.activeTab = tab;
  }
}
