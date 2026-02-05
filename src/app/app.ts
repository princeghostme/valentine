import { RouterOutlet } from '@angular/router';
import { Footer } from "./components/footer/footer";
import { Header } from "./components/header/header";
import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initCursorEffect();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isBrowser) return;

    const dot = document.querySelector('.cursor-dot') as HTMLElement;
    const ring = document.querySelector('.cursor-ring') as HTMLElement;

    if (dot && ring) {
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;

      setTimeout(() => {
        ring.style.left = `${event.clientX}px`;
        ring.style.top = `${event.clientY}px`;
      }, 50);
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.isBrowser) return;
    this.createClickEffect(event.clientX, event.clientY);
  }

  private initCursorEffect(): void {
    // Check if we're in browser environment
    if (!this.isBrowser) return;

    // Create cursor elements if they don't exist
    if (!document.querySelector('.cursor-dot')) {
      const dot = document.createElement('div');
      dot.className = 'cursor-dot';
      document.body.appendChild(dot);
    }

    if (!document.querySelector('.cursor-ring')) {
      const ring = document.createElement('div');
      ring.className = 'cursor-ring';
      document.body.appendChild(ring);
    }
  }

  private createClickEffect(x: number, y: number): void {
    if (!this.isBrowser) return;

    const effect = document.createElement('div');
    effect.style.position = 'fixed';
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    effect.style.width = '0';
    effect.style.height = '0';
    effect.style.borderRadius = '50%';
    effect.style.background = 'radial-gradient(circle, rgba(244,63,94,0.4) 0%, transparent 70%)';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '9997';
    effect.style.transform = 'translate(-50%, -50%)';

    document.body.appendChild(effect);

    // Animate the effect
    effect.animate([
      { width: '0', height: '0', opacity: 1 },
      { width: '100px', height: '100px', opacity: 0 }
    ], {
      duration: 600,
      easing: 'ease-out'
    });

    // Remove after animation
    setTimeout(() => {
      if (effect.parentNode) {
        effect.parentNode.removeChild(effect);
      }
    }, 600);
  }
}
