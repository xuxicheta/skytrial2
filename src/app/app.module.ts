import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { TestComponent } from './test.component';
import { ViewportModule } from './viewport/viewport.module';

@NgModule({
  imports:      [ BrowserModule, FormsModule, ViewportModule.forRoot({
    medium: 800,
    large: 1280,
  }) ],
  declarations: [ AppComponent, HelloComponent, TestComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
