import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Country } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  // URL of the local mock JSON file containing Olympics data
  private olympicUrl = './assets/mock/olympic.json';

  // BehaviorSubject to store and observe the state of Olympics data
  private olympics$ = new BehaviorSubject<Country[] | []>([]);

  constructor(private http: HttpClient) {}

  /**
   * Loads initial data from the local JSON file and updates the BehaviorSubject.
   * @returns An observable of the array of countries.
   */
  loadInitialData(): Observable<Country[]> {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value as Country[])),
      catchError((error, caught) => {
        console.error('Error loading Olympics data:', error);
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  /**
   * Retrieves the Olympics data as an observable for subscribers to consume.
   * @returns An observable of the array of countries or null.
   */
  getOlympics(): Observable<Country[] | null> {
    return this.olympics$.asObservable();
  }

  /**
   * Calculates the total number of countries in the Olympics data.
   * @returns The number of countries or 0 if data is unavailable.
   */
  getNumberOfCountries(): number {
    const countries = this.olympics$.value;
    return countries ? countries.length : 0;
  }

  /**
   * Finds the highest number of participations among all countries.
   * @returns The maximum number of participations or 0 if data is unavailable.
   */
  getNumberOfOlympics(): number {
    const countries = this.olympics$.value;
    if (!countries) return 0;

    return countries.reduce(
      (max, country) => Math.max(max, country.participations.length),
      0
    );
  }

  /**
   * Retrieves the data for a specific country by name.
   * @param countryName - The name of the country to search for.
   * @returns The country object or null if not found.
   */
  getSingleCountry(countryName: string): Country {
    const countries = this.olympics$.value ?? [];
    const country = countries.filter((country) => {
      return country.country.trim().toLowerCase() == countryName?.trim().toLowerCase();
    });
    return country[0] || null;
  }

  /**
   * Helper function to calculate statistics (e.g., medals, athletes) for a specific country.
   * @param countryName - The name of the country to search for.
   * @param statKey - The key of the statistic to sum up (e.g., 'medalsCount').
   * @returns The sum of the specified statistic for the country or 0 if unavailable.
   */
  private calculateCountryStat(countryName: string, statKey: keyof Participation): number {
    const country = this.getSingleCountry(countryName);
    return country?.participations?.reduce(
      (sum, participation) => sum + Number(participation[statKey]),
      0
    ) || 0;
  }

  /**
   * Calculates the number of participations for a specific country.
   * @param countryName - The name of the country to search for.
   * @returns The number of participations or 0 if data is unavailable.
   */
  getSingleCountryNumberParticipations(countryName: string): number {
    const country = this.getSingleCountry(countryName);
    return country.participations?.length || 0;
  }

  /**
   * Calculates the total number of medals won by a specific country.
   * @param countryName - The name of the country to search for.
   * @returns The total number of medals or 0 if data is unavailable.
   */
  getSingleCountryMedals(countryName: string): number {
    return this.calculateCountryStat(countryName, 'medalsCount');
  }

  /**
   * Calculates the total number of athletes representing a specific country.
   * @param countryName - The name of the country to search for.
   * @returns The total number of athletes or 0 if data is unavailable.
   */
  getSingleCountryAthletes(countryName: string): number {
    return this.calculateCountryStat(countryName, 'athleteCount');
  }
}