import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { ActivityComponent } from './components/activity/activity.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { NgApexchartsModule } from 'ng-apexcharts'; // Correct import for NgApexchartsModule
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { StockchartComponent } from './components/stockchart/stockchart.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    FooterComponent,
    DashboardComponent,
    ProfileComponent,
    TransactionsComponent,
    StocksComponent,
    ActivityComponent,
    PortfolioComponent,
    StockchartComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule,
    NgApexchartsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
