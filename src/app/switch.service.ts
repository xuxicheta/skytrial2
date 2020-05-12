import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SwitchService {
  public switch = new FormControl();

  constructor() { }
}
