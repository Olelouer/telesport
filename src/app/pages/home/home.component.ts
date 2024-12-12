import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, map, takeUntil, switchMap } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  // Component state handling
  public isLoading: boolean = false;
  public error: string | null = null;

  // Data structure for pie chart visualization
  public pieChartData: { name: string; value: number }[] = [];
  public totalCountries: number = 0;
  public totalEntries: number = 0;

  // Subject for handling component cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private olympicService: OlympicService, 
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
  
    this.olympicService.loadInitialData()
    .pipe(
      takeUntil(this.destroy$),
      switchMap(() => {
        this.totalCountries = this.olympicService.getNumberOfCountries();
        this.totalEntries = this.olympicService.getNumberOfOlympics();
        return this.olympicService.getOlympics();
      }),
       // Transform country data to pie chart format
      map((countries) => {
        return (countries || []).map((country) => ({
          name: country.country,
          // Calculate total medals across all participations for each country
          value: country.participations.reduce(
            (sum, participation) => sum + participation.medalsCount,
            0
          ),
        }));
      })
    )
    .subscribe({
      next: (data) => {
        this.pieChartData = data;
        this.isLoading = false;
        // Show error if no data is available
        if (!data || data.length === 0) {
          this.error = 'Aucune donnée disponible pour les pays.';
        }
      },
      error: (err) => {
        console.error('Failed to process data', err);
        this.error = 'Impossible de charger les données des pays.';
        this.isLoading = false;
      }
    });
  }
  
  /** Cleanup to prevent memory leaks */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Navigates to the detailed view of a selected country
   * @param country - Object containing country information
   */
  selectCountry(country: { name: string; value: number; label: string }): void {
    const formattedName: string = country.name.toLowerCase();
    this.router.navigate(['detail-pays', encodeURIComponent(formattedName)]);
  }  
}
