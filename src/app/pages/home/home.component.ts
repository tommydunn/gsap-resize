import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { animationFrames, fromEventPattern, takeUntil } from 'rxjs';
import { DestroyService } from '../../shared/services/destroy.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [DestroyService],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('showreel') showreel?: ElementRef<HTMLVideoElement>;

  @HostListener('window:resize', ['$event'])
  onResize() {
    console.log(this.animations[0]);
    ScrollTrigger.refresh(true);
    console.log('progress: ', this.animations[0].scrollTrigger?.progress);
    this.animations[0].scrollTrigger?.refresh();
  }

  // Instantiate the Lenis object with specified properties
  lenis = new Lenis({
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    autoResize: true,
    infinite: false,
    touchMultiplier: 20,
  });

  private animations: GSAPAnimation[] = [];

  constructor(
    private readonly destroy$: DestroyService,
    private readonly changeDetector: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.changeDetector.markForCheck();
    gsap.registerPlugin(ScrollTrigger);
    this.initSmoothScrolling();
    this.initScrollTriggers();
  }

  private initSmoothScrolling(): void {
    // Update ScrollTrigger each time the user scrolls
    fromEventPattern(
      handler => {
        this.lenis.on('scroll', handler);
      },
      handler => {
        this.lenis.off('scroll', handler);
      },
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        ScrollTrigger.update();
      });

    animationFrames()
      .pipe(takeUntil(this.destroy$))
      .subscribe(animation => {
        this.lenis.raf(animation.elapsed);
      });
  }

  private initScrollTriggers(): void {
    this.animations.push(
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '#about',
            start: 'top top',
            end: 'bottom+=300% bottom',
            scrub: true,
            pin: true,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            markers: true,
            onEnter: () => {
              this.showreel?.nativeElement.play();
            },
            onEnterBack: () => {},
            onLeave: () => {},
            onLeaveBack: () => {},
          },
        })
        .to('#about .frame .wrapper', { yPercent: -100, duration: 3 })
        .fromTo(
          '#about #showreel',
          { scale: 0.8, yPercent: 40 },
          { scale: 1, yPercent: 0, duration: 1 },
        ),
    );
  }

  public ngOnDestroy(): void {
    this.lenis.destroy();
    this.animations.forEach(a => a.scrollTrigger?.kill());
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
