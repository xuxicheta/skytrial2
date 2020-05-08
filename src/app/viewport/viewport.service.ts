import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';
import { IConfig } from './config.interface';
import { DisplayWidth } from './display-width.type';
import { VIEWPORT_CONFIG } from './viewport.token';

@Injectable()
export class ViewportService {
  private width = this.createResize(this.document.defaultView);
  public viewportSize = this.createViewportSize(this.width, this.config);

  constructor(
    @Inject(VIEWPORT_CONFIG) private config: IConfig,
    @Inject(DOCUMENT) private document: Document,
    private ngZone: NgZone,
  ) { }

  private createResize(window: Window): Observable<number> {
    return this.ngZone.runOutsideAngular(() => {
      return fromEvent(
        window,
        'resize',
        {
          passive: true
        },
      ).pipe(
        debounceTime(50),
        startWith(0),
        map(() => window.outerWidth),
      )
    })
  }

  private createViewportSize(width: Observable<number>, config: IConfig): Observable<DisplayWidth> {
    return width.pipe(
      map<number, DisplayWidth>(width => {
        if (width < config.medium) {
          return 'small';
        }
        if (width < config.large) {
          return 'medium';
        }
        return 'large';
      }),
      distinctUntilChanged(),
      shareReplay<DisplayWidth>(),
    )
  }
}
