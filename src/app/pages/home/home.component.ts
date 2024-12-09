import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$!: Observable<Country[] | null>;
  public pieChartData: { name: string; value: number }[] = [];
  public totalCountries: number = 0;
  public totalEntries: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private olympicService: OlympicService, 
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Load initial data
    this.olympicService.loadInitialData().subscribe({
      next: () => {
        this.totalCountries = this.olympicService.getNumberOfCountries();
        this.totalEntries = this.olympicService.getNumberOfOlympics();
      },
      error: (err) => console.error('Failed to load initial data', err),
    });

    // Assign the observable
    this.olympics$ = this.olympicService.getOlympics();
    
    // Process data for the pie chart
    this.olympics$
      .pipe(
        map((countries) =>
          (countries || []).map((country) => ({
            name: country.country,
            value: country.participations.reduce(
              (sum, participation) => sum + participation.medalsCount,
              0
            ),
          }))
        )
      )
      .subscribe((data) => {
        this.pieChartData = data;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Route the user to the selected country
  selectCountry(country: { name: string; value: number; label: string }): void {
    const formattedName: string = country.name.toLowerCase();
    this.router.navigate(['detail-pays', encodeURIComponent(formattedName)]);
  }  
}
