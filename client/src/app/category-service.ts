import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Category, Event} from './event-service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  HOST = 'http://localhost:3060' // API HOST

  constructor(private http: HttpClient) {
  }

  // get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.HOST}/api/categories`)
  }

  // create category
  createCategory(body: { name: string, description: string }): Observable<any> {
    return this.http.post<any>(`${this.HOST}/api/categories`, body)
  }

  // update category
  updateCategory(eventId: number, body: { name: string, description: string }): Observable<any> {
    return this.http.put<any>(`${this.HOST}/api/categories/${eventId}`, body)
  }

  // delete categories by id
  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.HOST}/api/categories/${id}`)
  }
}
