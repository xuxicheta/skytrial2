import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { coalesceViewportConfig } from './coalesce-config';
import { IConfig } from './config.interface';
import { IfViewportSizeDirective } from './if-viewport-size.directive';
import { ViewportService } from './viewport.service';
import { VIEWPORT_CONFIG } from './viewport.token';



@NgModule({
  declarations: [IfViewportSizeDirective],
  imports: [
    CommonModule
  ],
  exports: [
    IfViewportSizeDirective
  ]
})
export class ViewportModule {
  static forRoot(config?: Partial<IConfig>): ModuleWithProviders {
    return {
      ngModule: ViewportModule,
      providers: [
        {
          provide: VIEWPORT_CONFIG,
          useValue: coalesceViewportConfig(config),
        },
        ViewportService,
      ]
    };
  }
}
