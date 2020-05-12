import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { fromEvent, Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { SwitchService } from '../switch.service';
import { IConfig } from './config.interface';
import { DisplayWidth } from './display-width.type';
import { VIEWPORT_CONFIG } from './viewport.token';

@Injectable()
export class ViewportService {
  public viewportSize: Observable<DisplayWidth>;

  constructor(
    public switchService: SwitchService,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document,
    @Inject(VIEWPORT_CONFIG) config: IConfig,

    
  ) {
    const width = this.createWidth();
    this.viewportSize = this.createViewportSize(width, config)
  }

  private createWidth(): Observable<number> {
    // return ResizeObserver
    // return false
    // ? this.createResizeObserverListener()
    // : this.createResizeEventListener(this.document.defaultView)

    return this.switchService.switch.valueChanges.pipe(
      startWith(false),
      switchMap(value => {
        return value
          ? this.createResizeObserverListener()
          : this.createResizeEventListener(this.document.defaultView)
      })
    )
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

  public createResizeObserverListener(): Observable<number> {
    console.log('createResizeObserverListener')

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
    console.log('createResizeEventListener')

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
