import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Injector, NgZone } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';
import { IConfig } from './config.interface';
import { DisplayWidth } from './display-width.type';
import { VIEWPORT_CONFIG } from './viewport.token';

@Injectable()
export class ViewportService {
  private config;
  private width: Observable<number>;
  public viewportSize: Observable<DisplayWidth>;

  constructor(
    // @Inject(VIEWPORT_CONFIG) private config: IConfig,
    /** some stackblizt issue o.O, it doesn't with injected token */
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document,
    private ngZone: NgZone,
  ) {
    this.config = this.injector.get(VIEWPORT_CONFIG);
    this.width = this.createResize(this.document.defaultView);
    this.viewportSize = this.createViewportSize(this.width, this.config)
  }

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
        map(() => window.innerWidth),
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
