import {Component, OnInit} from '@angular/core';
import {Navigation} from '../navigation/navigation';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {EventService, Event} from '../event-service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [Navigation, RouterModule, CommonModule],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details implements OnInit {
  event: Event | null = null;
  showLoading = false
  showNotFound = false;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // parse id from location href
    this.route.params.subscribe(params => {
      const id = params['id']

      if (id) {
        // request event API by id
        this.showLoading = true
        this.eventService.getEventById(id).subscribe(res => {
          this.showLoading = false

          if (res) {
            this.event = res.data
          } else {
            this.showNotFound = true
          }
        }, error => {
          this.showLoading = false
        })
      } else {
        this.showLoading = false
        this.showNotFound = true
      }

    })
  }

  // get event status
  getStatus(event: Event) {
    return new Date(event.end_datetime) < new Date() ? 'past' : 'upcoming'
  }

  // add event listener for register button
  register(): void {
    // alert("Registration is under construction.")
    this.router.navigate(['/registration', this.event?.id])
  }
}
