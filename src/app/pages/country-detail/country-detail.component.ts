import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/core/models/Olympic';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  // Component state management
  public isLoading: boolean = false;
  public error: boolean = false;

  // Country data from the service
  public country: Country | undefined;
  
  // Data structure for line chart visualization
  public lineChartData: { name: string; series: { name: string; value: number }[] }[] = [];
  
  // Statistics counters
  public totalEntries: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  
  // URL parameter for country name
  private countryName: string = '';
  
  // Subject for managing subscriptions
  private destroy$ = new Subject<void>();

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    /** Get and decode country name from URL parameters */
    this.countryName = decodeURIComponent(this.route.snapshot.paramMap.get('countryName') || '');

    /** Initializes component data by loading country details and preparing chart data */
    this.olympicService
    .loadInitialData()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.country = this.olympicService.getSingleCountry(this.countryName);

        if (!this.isValidCountry()) {
          this.router.navigate(['/']);
          return;
        }

        this.loadCountryStatistics();
        this.prepareChartData();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load country data', err)
        this.error = true;
        this.isLoading = false;
      }
    });    
  }

  /** Cleanup component */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Checks if country exists and has participations */
  private isValidCountry(): boolean {
    return !!this.country && this.country.participations.length > 0;
  }

  /** Loads statistical data for the country */
  private loadCountryStatistics(): void {
    this.totalEntries = this.olympicService.getSingleCountryNumberParticipations(this.countryName);
    this.totalMedals = this.olympicService.getSingleCountryMedals(this.countryName);
    this.totalAthletes = this.olympicService.getSingleCountryAthletes(this.countryName);
  }

  /** Prepares data for the line chart visualization */
  private prepareChartData(): void {
    if (!this.country) return;

    this.lineChartData = [{
      name: 'Médailles',
      series: this.country.participations.map((participation) => ({
        name: participation.year.toString(),
        value: participation.medalsCount,
      })),
    }];
  }
}