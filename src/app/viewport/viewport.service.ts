import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { fromEvent, Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';
import { IConfig } from './config.interface';
import { DisplayWidth } from './display-width.type';
import { VIEWPORT_CONFIG } from './viewport.token';

@Injectable()
export class ViewportService {
  public viewportSize: Observable<DisplayWidth>;

  constructor(
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document,
    @Inject(VIEWPORT_CONFIG) config: IConfig,

  ) {
    const width = this.createWidth(this.document.defaultView, this.ngZone);
    this.viewportSize = this.createViewportSize(width, config);
  }

  private createWidth(window: Window, ngZone: NgZone): Observable<number> {
    return ResizeObserver
      ? this.createResizeObserverListener(window, ngZone)
      : this.createResizeEventListener(window, ngZone)
  }

  private createViewportSize(width: Observable<number>, config: IConfig): Observable<DisplayWidth> {
    return width.pipe(
      this.calcTypeSize(config),
      distinctUntilChanged(),
      shareReplay<DisplayWidth>(),
    )
  }

  private calcTypeSize(config: IConfig): OperatorFunction<number, DisplayWidth> {
    return map((width: number) => {
      if (width < config.medium) {
        return 'small';
      }
      if (width < config.large) {
        return 'medium';
      }
      return 'large';
    })

  }

  public createResizeObserverListener(window: Window, ngZone: NgZone): Observable<number> {
    return new Observable(observer => {
      const ro = new ResizeObserver(entries => {
        ngZone.run(() => observer.next(entries[0].contentRect.width));
      });
      ro.observe(window.document.documentElement);

      return () => {
        ro.unobserve(window.document.documentElement);
      }
    }).pipe(
      debounceTime<number>(50),
      startWith(window.innerWidth),
    );
  }

  private createResizeEventListener(window: Window, ngZone: NgZone): Observable<number> {
    return ngZone.runOutsideAngular(() => {
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


}
