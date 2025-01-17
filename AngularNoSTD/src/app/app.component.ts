import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false, // Ensure this is not standalone or remove the standalone option.
})

export class AppComponent {
  title = 'AngularNoSTD';
}
