import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeather(city: string, eventDate: string): Observable<any> {
    // First, obtain the latitude and longitude based on the city
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

    return this.http.get<any>(geoUrl).pipe(
      switchMap(geo => {
        if (!geo.results || geo.results.length === 0) {
          throw new Error('City not found');
        }

        const { latitude, longitude } = geo?.results[0];
        const date = eventDate.split('T')[0]; // get yyyy-mm-dd part

        // Requesting weather data
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&start_date=${date}&end_date=${date}`;

        return this.http.get<any>(weatherUrl).pipe(
          map(weather => {
            const daily = weather.daily;
            if (!daily || daily.time.length === 0) {
              return { message: 'No daily data available' };
            }

            return {
              city,
              date: daily.time[0],
              temp_max: daily.temperature_2m_max[0],
              temp_min: daily.temperature_2m_min[0],
              precipitation: daily.precipitation_sum[0],
              weathercode: daily.weathercode[0]
            };
          })
        );
      })
    );
  }
}
