import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
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
import { provideHttpClient, withFetch } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { StockchartComponent } from './components/stockchart/stockchart.component';
import { PredictionsComponent } from './components/predictions/predictions.component';
import { JwtModule } from '@auth0/angular-jwt';
import { NgModel } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { WalletComponent } from './components/wallet/wallet.component';
import { CurrencyComponent } from './components/currency/currency.component';
import { FavoriteCurrencyComponent } from './components/favorite-currency/favorite-currency.component';



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
    PredictionsComponent,
    WalletComponent,
    CurrencyComponent,
    FavoriteCurrencyComponent
    
  
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    HttpClientModule,
    JwtModule,
    FontAwesomeModule,
    FormsModule,
    

    
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
