import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IfViewportSizeDirective } from './if-viewport-size.directive';
import { coalesceViewportConfig } from './coalesce-config';
import { IConfig } from './config.interface';
import { ViewportService } from './viewport.service';



export const VIEWPORT_CONFIG = new InjectionToken<IConfig>('VIEWPORT_CONFIG')

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
