import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef, AfterViewInit, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewportService } from './viewport.service';

@Directive({
  selector: '[ifViewportSize]'
})
export class IfViewportSizeDirective implements OnInit, OnDestroy {
  private sub = new Subscription();
  @Input() ifViewportSize: string

  constructor(
    private viewportService: ViewportService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) { }


  ngOnInit() {
    this.sub.add(this.toggleViewReaction());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private toggleViewReaction(): Subscription {
    return this.viewportService.viewportSize
      .subscribe(viewportSize => {
        if (viewportSize === this.ifViewportSize) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }
}
