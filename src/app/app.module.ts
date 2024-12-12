import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { CountryDetailComponent } from './pages/country-detail/country-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

// Components
import { BlockNumberComponent } from './components/block-number/block-number.component';
import { JoLoadingComponent } from './components/jo-loading/jo-loading.component';
import { RedirectHomeComponent } from './components/redirect-home/redirect-home.component';

@NgModule({
  declarations: [
    AppComponent, 
    HomeComponent, 
    CountryDetailComponent,
    NotFoundComponent,
    BlockNumberComponent,
    JoLoadingComponent,
    RedirectHomeComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    HttpClientModule, 
    NgxChartsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
