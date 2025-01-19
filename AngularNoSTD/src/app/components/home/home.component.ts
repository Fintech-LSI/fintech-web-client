import { Component } from '@angular/core';
import { faExchangeAlt, faChartLine, faBriefcase, faDollarSign, faServer, faArrowRight, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent {
  faExchangeAlt = faExchangeAlt;
  faChartLine = faChartLine;
  faBriefcase = faBriefcase;
  faDollarSign = faDollarSign;
  faServer = faServer;
  faUsers = faUsers;
  faArrowRight = faArrowRight;

}

