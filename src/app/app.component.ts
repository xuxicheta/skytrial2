import { Component } from '@angular/core';
import { SwitchService } from './switch.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular 5';

  constructor(
    public switchService: SwitchService,
  ) {}
}
