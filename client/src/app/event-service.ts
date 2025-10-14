import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Registration {
  id: number;
  event_id: number;
  full_name: number;
  email: number;
  phone: number;
  tickets_qty: number;
  registration_datetime: Date;
  amount_paid: number;
}

export interface Event {
  id: number;
  category_id: number;
  name: string;
  short_description: string;
  description: string;
  start_datetime: Date;
  end_datetime: Date;
  location_city: string;
  location_venue: string;
  address_line: string;
  ticket_price: number;
  goal_amount: number;
  progress_amount: number;
  image_url: number;
  suspended: number;
  created_at: Date;
  updated_at: Date;
  registrations: Registration[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  HOST = 'http://localhost:3060' // API HOST

  constructor(private http: HttpClient) {
  }

  // get all events
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.HOST}/api/events`)
  }

  // search events
  searchEvents(dateFrom: string, dateTo: string, location: string, category: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.HOST}/api/events/search`, {
      params: {
        date_from: dateFrom,
        date_to: dateTo,
        city: location,
        category_id: category,
      }
    })
  }

  // get event by id
  getEventById(id: number): Observable<{ data: Event, error: string } | null> {
    return this.http.get<{ data: Event, error: string } | null>(`${this.HOST}/api/events/${id}`)
  }

  // get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.HOST}/api/categories`)
  }

  // create registration for event
  createRegistration(eventId: number, registration: { full_name: string, email: string, phone: string, tickets_qty: number }): Observable<any> {
    return this.http.post<any>(`${this.HOST}/api/events/${eventId}/registrations`, registration)
  }
}
