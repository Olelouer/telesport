import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$!: Observable<Country[] | null>;
  public pieChartData: { name: string; value: number }[] = [];
  public totalCountries: number = 0;
  public numberOfOlympics: number = 0;

  constructor(
    private olympicService: OlympicService, 
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Load initial data
    this.olympicService.loadInitialData().subscribe({
      next: () => {
        this.totalCountries = this.olympicService.getNumberOfCountries();
        this.numberOfOlympics = this.olympicService.getNumberOfOlympics();
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

  // Route the user to the selected country
  selectCountry(country: { name: string; value: number; label: string }): void {
    this.router.navigate(['detail-pays', country.name]);
  }  
}
