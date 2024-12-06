import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable,Subject, map } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/core/models/Olympic';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  public country : Country | undefined;
  public lineChartData: { name: string; series: { name: string; value: number }[] }[] = [];
  public totalEntries : number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;

  private countryName: string | null = "";
  private destroy$ = new Subject<void>();

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the country in the param of the router
    this.countryName = decodeURIComponent(this.route.snapshot.paramMap.get('countryName') || '');

    this.olympicService.loadInitialData().subscribe({
      next: () => {
        this.country = this.olympicService.getSingleCountry(this.countryName);
        
        // Redirect user to the homepage if the country doesn't exist
        if (!this.country) {
          this.router.navigate(['/']);
          return;
        }
        this.totalEntries = this.olympicService.getSingleCountryNumberParticipations(this.countryName);
        this.totalMedals = this.olympicService.getSingleCountryMedals(this.countryName);
        this.totalAthletes = this.olympicService.getSingleCountryAthletes(this.countryName);

        // Map data for ngx-charts
        this.lineChartData = [
          {
            name: 'Médailles',
            series: this.country.participations.map((participation) => ({
              name: participation.year.toString(),
              value: participation.medalsCount,
            })),
          },
        ];                
      },
      error: (err) => console.error('Failed to load initial data', err),
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe the services
    this.destroy$.next();
    this.destroy$.complete();
  }
}