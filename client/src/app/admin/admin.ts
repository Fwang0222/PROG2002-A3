import { Component } from '@angular/core';
import {Navigation} from '../navigation/navigation';

type Tab = 'categories' | 'events' | 'registrations';

@Component({
  selector: 'app-admin',
  imports: [Navigation],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  activeTab: Tab = 'categories';

  switchTab(tab: Tab) {
    this.activeTab = tab;
  }
}
