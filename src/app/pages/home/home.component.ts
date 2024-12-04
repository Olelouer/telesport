import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/core/models/Olympic'; // Adjust the path as needed

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$!: Observable<Country[] | null>;
  public pieChartData: { name: string; value: number }[] = [];

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    // Load initial data
    this.olympicService.loadInitialData().subscribe({
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
}
