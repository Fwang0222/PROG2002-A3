import {Component, OnInit} from '@angular/core';
import {Navigation} from '../navigation/navigation';
import {Category, Event, EventService} from '../event-service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [Navigation, CommonModule, FormsModule, RouterModule],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit {
  events: Event[] = []
  categories: Category[] = []
  showListLoading = false
  showListError = false
  showListEmpty = false
  searchForm = {
    date_from: "",
    date_to: "",
    city: "",
    category: "",
  }


  constructor(private eventService: EventService) {
  }

  // init to get all categories
  ngOnInit(): void {
    this.eventService.getCategories().subscribe(res => {
      this.categories = res
    }, (error) => {
      console.log(error);
      this.clearMessage();
      this.showListEmpty = true;
    })
  }

  // clear all message
  clearMessage(): void {
    this.showListLoading = false
    this.showListError = false
    this.showListEmpty = false
  }

  // get event status
  getStatus(event: Event) {
    return new Date(event.end_datetime) < new Date() ? 'past' : 'upcoming'
  }

  // submit search form
  submit(): void {
    // clear message and show loading
    this.clearMessage()
    this.showListLoading = true

    // call service to search with parameters
    const { date_from, date_to, city, category } = this.searchForm
    this.eventService.searchEvents(date_from, date_to, city, category).subscribe(res => {
      this.clearMessage()
      if (!res.length) {
        this.showListEmpty = true
        this.events = []
      } else {
        this.events = res;
      }

    }, error => {
      this.clearMessage()
      this.showListError = true
    })
  }

  // clear search form input value, messages and events
  clearSearch(): void {
    this.searchForm = {
      date_from: "",
      date_to: "",
      city: "",
      category: "",
    }
    this.clearMessage()
    this.events = []
  }
}
