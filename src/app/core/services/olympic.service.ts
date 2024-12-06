import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Country } from 'src/app/core/models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Country[] | null>(null);

  constructor(private http: HttpClient) {}

  // Load initial data from JSON file
  loadInitialData(): Observable<Country[]> {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value as Country[])),
      catchError((error, caught) => {
        console.error('Error loading Olympics data:', error);
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  // Get Olympics data as Observable
  getOlympics(): Observable<Country[] | null> {    
    return this.olympics$.asObservable();
  }

  // Get the number of countries
  getNumberOfCountries(): number {
    const countries = this.olympics$.value;
    return countries ? countries.length : 0;
  }

  // Get the count of the country with the highest number of participations
  getNumberOfOlympics(): number {
    const countries = this.olympics$.value;
    if (!countries) return 0;
  
    return countries.reduce(
      (max, country) => Math.max(max, country.participations.length),
      0
    );
  }  
}
