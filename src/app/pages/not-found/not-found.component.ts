import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {

    this.titleService.setTitle('404 - Télésport');

  }

}
