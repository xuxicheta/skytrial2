import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Injector, NgZone } from '@angular/core';
import { fromEvent, Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay, startWith, tap } from 'rxjs/operators';
import { IConfig } from './config.interface';
import { DisplayWidth } from './display-width.type';
import { VIEWPORT_CONFIG } from './viewport.token';

@Injectable()
export class ViewportService {
  public viewportSize: Observable<DisplayWidth>;

  constructor(
    // @Inject(VIEWPORT_CONFIG) private config: IConfig,
    /** some stackblitz issue o.O, it doesn't work with injected token */
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document,
    private ngZone: NgZone,
  ) {
    const config = this.injector.get(VIEWPORT_CONFIG);
    const width = this.createWidth();
    this.viewportSize = this.createViewportSize(width, config)
  }

  private createWidth(): Observable<number> {
    return ResizeObserver
      ? this.createResizeObserverListener()
      : this.createResizeEventListener(this.document.defaultView)
  }

  private createViewportSize(width: Observable<number>, config: IConfig): Observable<DisplayWidth> {
    return width.pipe(
      this.calcTypeSize(config),
      distinctUntilChanged(),
      shareReplay<DisplayWidth>(),
    )
  }

  private calcTypeSize(config: IConfig): OperatorFunction<number, DisplayWidth > {
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

  public createResizeObserverListener(): Observable<number> {
    return new Observable(observer => {
      const ro = new ResizeObserver(entries => {
        observer.next(entries[0].contentRect.width);
      });
      ro.observe(this.document.documentElement);

      return () => {
        ro.unobserve(this.document.documentElement);
      }
    }).pipe(
      debounceTime<number>(50),
      startWith(this.document.defaultView.innerWidth)
    ); 
  }

  private createResizeEventListener(window: Window): Observable<number> {
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


}
