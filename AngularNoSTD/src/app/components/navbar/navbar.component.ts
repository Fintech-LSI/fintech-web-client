import { Component } from '@angular/core';
import { faHome, faInfoCircle, faEnvelope, faSignInAlt, faArrowRight, faClipboardList, faBars} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  faHome = faHome;
  faInfoCircle = faInfoCircle;
  faEnvelope = faEnvelope;
  faSignInAlt = faSignInAlt;
  faArrowRight = faArrowRight;
  faClipboardList = faClipboardList;
  faBars = faBars;
}
