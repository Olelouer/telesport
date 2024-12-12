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

  // Get the data of a single country
  getSingleCountry(countryName: string | null): Country {
    const countries = this.olympics$.value ?? [];
    let country: Country[] = countries.filter((country) => { 
      return country.country.trim().toLowerCase() == countryName?.trim().toLowerCase();
    });
    return country[0];
  }

  // Get the number of participations of a country
  getSingleCountryNumberParticipations(countryName: string | null): number {
    const country = this.getSingleCountry(countryName);
    return country.participations?.length;
  }
  
  // Get the number of medals of a country
  getSingleCountryMedals(countryName: string | null): number {
    const country = this.getSingleCountry(countryName);
    return country.participations?.reduce((sum, medals) => sum + medals.medalsCount, 0);
  }

  // Get the number of athletes of a country
  getSingleCountryAthletes(countryName: string | null): number {
    const country = this.getSingleCountry(countryName);
    return country.participations?.reduce((sum, athletes) => sum + athletes.athleteCount, 0);
  }
}
