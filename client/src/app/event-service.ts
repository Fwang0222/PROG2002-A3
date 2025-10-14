import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

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
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  HOST = 'http://localhost:3060'

  constructor(private http: HttpClient) {
  }


  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.HOST}/api/events`)
  }

  searchEvents(dateFrom: string, dateTo: string, location: string, category: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.HOST}/api/events`, {
      params: {
        date_from: dateFrom,
        date_to: dateTo,
        city: location,
        category_id: category,
      }
    })
  }

  getEventById(id: number): Observable<Event | null> {
    return  this.http.get<Event | null>(`${this.HOST}/api/events/${id}`)
  }
}
