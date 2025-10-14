import { Component } from '@angular/core';
import {Event, EventService} from '../event-service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {Navigation} from '../navigation/navigation';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-registration',
  imports: [Navigation, RouterModule, CommonModule, FormsModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css'
})
export class Registration {
  event: Event | null = null;
  showLoading = false
  showNotFound = false;

  showError = false;
  showSubmitLoading = false;
  showSuccess = false;
  errorMsg = '';
  form = {
    full_name: '',
    email: '',
    phone: '',
    tickets_qty: 1
  };

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

  clearMessages(): void {
    this.showLoading = false;
    this.showError = false;
    this.errorMsg = '';
  }

  submit(): void {
    this.clearMessages();

    // remove empty space
    const full_name = this.form.full_name.trim();
    const email = this.form.email.trim();
    const phone = this.form.phone .trim();
    const qty = this.form.tickets_qty;

    // base validation
    if (!full_name || !email || !Number.isFinite(qty) || qty < 1) {
      this.showError = true;
      this.errorMsg = 'Please complete all required fields';
      return;
    }

    // show error message if the event is suspended
    if (this.event?.suspended === 1) {
      this.showError = true;
      this.errorMsg = 'Event is suspended. Registration is disabled.';
      return;
    }

    // show loading message
    this.showSubmitLoading = true;

    // call service to create registration
    this.eventService.createRegistration(this.event!.id, {
      full_name,
      email,
      phone: phone,
      tickets_qty: qty
    }).subscribe({
      next: (res: any) => {
        this.showSubmitLoading = false;
        // success
        this.showSuccess = true;
        // reset form value
        this.form = { full_name: '', email: '', phone: '', tickets_qty: 1 };
      },
      error: (err) => {
        console.log(err)
        this.showSubmitLoading = false;
        this.showError = true;
        this.errorMsg = err?.error?.error?.message || 'Unexpected error. Please try again later.';
      }
    });
  }
}
