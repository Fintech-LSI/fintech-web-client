import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ActivityComponent } from './components/activity/activity.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import {PortfolioComponent} from './components/portfolio/portfolio.component';
import {StockchartComponent} from './components/stockchart/stockchart.component';
import {PredictionsComponent} from './components/predictions/predictions.component';

const routes: Routes = [

  { path: '', component: HomeComponent }, // Homepage route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'portfolio', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'stocks', component: StocksComponent },
      { path: 'activity', component: ActivityComponent },
      { path: 'portfolio', component: PortfolioComponent },
      { path: 'stockchart', component: StockchartComponent },
      { path: 'predictions', component: PredictionsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
