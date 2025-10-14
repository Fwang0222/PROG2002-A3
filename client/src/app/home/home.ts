import {Component, OnInit} from '@angular/core';
import {EventService, Event} from '../event-service';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Navigation} from '../navigation/navigation';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, Navigation],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  events: Event[] = []

  constructor(private eventService: EventService) {
  }

  // init to get events
  ngOnInit(): void {
    this.eventService.getEvents().subscribe(res => {
      this.events = res
    })
  }

  // get event status
  getStatus(event: Event) {
    return new Date(event.end_datetime) < new Date() ? 'past' : 'upcoming'
  }

  // get upcoming count (end time >= now)
  getUpcomingCount() {
    return this.events.filter(ev => new Date(ev.end_datetime) >= new Date()).length
  }
}
