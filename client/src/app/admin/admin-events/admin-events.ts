import { Component } from '@angular/core';
import {EventService} from '../../event-service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-admin-events',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-events.html',
  styleUrl: './admin-events.css'
})
export class AdminEvents {
  categories: any[] = [];
  events: any[] = [];

  loading = false;
  saving = false;
  error = '';
  success = '';

  // modal
  showModal = false;
  modalError = '';
  editingId: number | null = null;

  form: any = {
    category_id: null,
    name: '',
    short_description: '',
    description: '',
    start_datetime: '',
    end_datetime: '',
    location_city: '',
    location_venue: '',
    address_line: '',
    ticket_price: 0,
    goal_amount: 0,
    progress_amount: 0,
    image_url: '',
    suspended: 0
  };

  constructor(private eventService: EventService) {}

  // init to get categories and events
  ngOnInit(): void {
    this.getCategories();
    this.getEvents();
  }

  clearNotices() {
    this.error = '';
    this.success = '';
  }

  getCategories() {
    // call service to get categories
    this.eventService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.error?.message || 'Failed to load categories';
      }
    });
  }

  getEvents() {
    // call service to get events
    this.clearNotices();
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (res: any) => {
        this.events = res;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.error?.message || 'Failed to load events';
      }
    });
  }

  // open create modal
  openCreateModal() {
    this.modalError = '';
    this.editingId = null;
    // reset form value
    this.form = {
      category_id: null,
      name: '',
      short_description: '',
      description: '',
      start_datetime: '',
      end_datetime: '',
      location_city: '',
      location_venue: '',
      address_line: '',
      ticket_price: 0,
      goal_amount: 0,
      progress_amount: 0,
      image_url: '',
      suspended: 0
    };
    this.showModal = true;
  }

  // open edie modal
  openEditModal(e: any) {
    this.modalError = '';
    this.editingId = e.id;
    this.form = {
      category_id: e.category_id,
      name: e.name || '',
      short_description: e.short_description || '',
      description: e.description || '',
      start_datetime: e.start_datetime?.slice(0, 19).replace('T', ' '),
      end_datetime: e.end_datetime?.slice(0, 19).replace('T', ' '),
      location_city: e.location_city || '',
      location_venue: e.location_venue || '',
      address_line: e.address_line || '',
      ticket_price: e.ticket_price ?? 0,
      goal_amount: e.goal_amount ?? 0,
      progress_amount: e.progress_amount ?? 0,
      image_url: e.image_url || '',
      suspended: e.suspended ?? 0
    };
    this.showModal = true;
  }

  // close modal
  closeModal() {
    if (this.saving) {
      return;
    }
    this.showModal = false;
    this.modalError = '';
  }

  // submit form
  submit() {
    // validate required fields value
    if (!this.form.category_id || !this.form.name.trim() || !this.form.start_datetime) {
      this.modalError = 'Category, name and start time are required';
      return;
    }

    // show saving
    this.saving = true;

    // build request body
    const body = {
      category_id: this.form.category_id,
      name: this.form.name.trim(),
      short_description: this.form.short_description?.trim(),
      description: this.form.description,
      start_datetime: new Date(this.form.start_datetime),
      end_datetime: new Date(this.form.end_datetime),
      location_city: this.form.location_city?.trim(),
      location_venue: this.form.location_venue?.trim() ,
      address_line: this.form.address_line?.trim(),
      ticket_price: Number(this.form.ticket_price) || 0,
      goal_amount: Number(this.form.goal_amount) || 0,
      progress_amount: Number(this.form.progress_amount) || 0,
      image_url: this.form.image_url?.trim(),
      suspended: Number(this.form.suspended) ? 1 : 0
    };

    // create api observable according to editing flag
    const apiObservable = this.editingId
      ? this.eventService.updateEvent(this.editingId, body)
      : this.eventService.createEvent(body);

    apiObservable.subscribe({
      next: () => {
        // hide save and modal, show success message
        this.saving = false;
        this.showModal = false;
        this.success = this.editingId ? 'Updated successfully' : 'Created successfully';

        // reload events
        this.getEvents();
      },
      error: (e) => {
        this.saving = false;
        this.modalError = e?.error?.error?.message || (this.editingId ? 'Update failed' : 'Create failed');
      }
    });
  }

  // delete event
  delete(e: any) {
    // show confirm message
    if (confirm("Do you really want to delete the category?")) {
      // clear all notices
      this.clearNotices();

      // call service to delete
      this.eventService.deleteEvent(e.id).subscribe({
        next: () => {
          this.success = 'Deleted successfully';
          this.getEvents();
        },
        error: (er) => {
          this.error = er?.error?.error?.message || 'Delete failed';
        }
      });
    }
  }
}
