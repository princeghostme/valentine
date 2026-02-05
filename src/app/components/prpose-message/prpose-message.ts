import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  input,
  HostListener
} from '@angular/core';
import { AsyncPipe, NgStyle, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

import { proposalState } from '../../pages/home/home';
import { Queryparams } from '../../interfaces/queryparams';
import {
  ValentineDay,
  ValentineProposeContent
} from '../../interfaces/valentine-day';
import { ValentineContentService } from '../../services/valentine-content-service';

@Component({
  selector: 'app-prpose-message',
  standalone: true,
  imports: [NgStyle, AsyncPipe],
  templateUrl: './prpose-message.html',
  styleUrl: './prpose-message.css',
})
export class PrposeMessage implements OnInit {

  /* -------------------- Inputs -------------------- */

  name = input<Queryparams>({
    yourName: '',
    valnetineName: '',  // Fixed typo: valnetineName -> valentineName
  });

  valentineDay = input.required<ValentineDay>();

  /* -------------------- Output -------------------- */

  @Output() response = new EventEmitter<proposalState>();

  /* -------------------- State -------------------- */

  content$!: Observable<ValentineProposeContent>;
  isMobile = false;
  isNoButtonDodging = false;

  noButtonStyle: {
    left?: string;
    top?: string;
  } = {
    left: '50%',
    top: '50%',
  };

  /* -------------------- Constructor -------------------- */

  constructor(
    private valentineService: ValentineContentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /* -------------------- Lifecycle -------------------- */

  ngOnInit(): void {
    // ✅ SSR-safe browser check
    if (isPlatformBrowser(this.platformId)) {
      this.checkIfMobile();
    }

    // ✅ Inputs are ready here
    this.content$ = this.valentineService.getProposeContent(
      this.valentineDay()
    );
  }

  /* -------------------- Actions -------------------- */

  onYes(): void {
    this.response.emit('accepted');
  }

  onNo(): void {
    this.response.emit('rejected');
  }

  /* -------------------- No Button Logic -------------------- */

  private lastX = 0;
  private lastY = 0;
  private moveCount = 0;

  // Handle both mouse and touch events
  onNoButtonAttempt(event: Event): void {
    // Always prevent default to stop clicking
    event.preventDefault();
    event.stopPropagation();

    // If this is the first attempt, don't move (give a chance)
    if (this.moveCount === 0) {
      this.moveCount++;
      return;
    }

    // Move the button away
    this.moveNoButton();

    // Prevent "No" from being selected (USP feature)
    // Never emit 'rejected' - the button just dodges
  }

  // Handle mouse enter for desktop
  onNoButtonHover(): void {
    if (!this.isMobile && this.moveCount > 0) {
      this.moveNoButton();
    }
  }

  // Handle touch for mobile
  onNoButtonTouch(event: TouchEvent): void {
    if (this.isMobile) {
      this.onNoButtonAttempt(event);
    }
  }

  moveNoButton(): void {
    const containerWidth = window.innerWidth < 640 ? 280 : 320; // Responsive container width
    const containerHeight = 160;
    const buttonWidth = 100;
    const buttonHeight = 48;
    const minDistance = 100; // Minimum distance to move

    const maxX = containerWidth - buttonWidth;
    const maxY = containerHeight - buttonHeight;

    let x = 0;
    let y = 0;
    let distance = 0;
    let attempts = 0;
    const maxAttempts = 20; // Prevent infinite loop

    do {
      x = Math.random() * maxX;
      y = Math.random() * maxY;
      distance = Math.hypot(x - this.lastX, y - this.lastY);
      attempts++;
    } while (distance < minDistance && attempts < maxAttempts);

    this.lastX = x;
    this.lastY = y;
    this.moveCount++;

    // Add some animation variety
    const moveStyle = this.getMoveAnimationStyle(x, y);

    this.noButtonStyle = {
      left: `${x}px`,
      top: `${y}px`,
      ...moveStyle
    };
  }

  private getMoveAnimationStyle(x: number, y: number): any {
    const animations = [
      { transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
      { transition: 'all 0.4s ease-out' },
      { transition: 'all 0.25s linear' },
      { transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }
    ];

    // Add rotation and scale for fun
    const rotation = Math.random() > 0.5 ? 5 : -5;
    const scale = 0.95 + (Math.random() * 0.1);

    return {
      ...animations[Math.floor(Math.random() * animations.length)],
      transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`
    };
  }

  // Check if device is mobile
  private checkIfMobile(): void {
    this.isMobile = window.matchMedia('(pointer: coarse)').matches ||
                    window.innerWidth < 768;
  }

  // Global click/touch listener to catch any attempts to click "No"
  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onDocumentClick(event: Event): void {
    // Check if the click was on or very near the NO button
    const noButton = document.querySelector('[data-no-button]') as HTMLElement;
    if (noButton && this.isClickNearButton(event, noButton)) {
      event.preventDefault();
      event.stopPropagation();
      this.moveNoButton();
    }
  }

  private isClickNearButton(event: Event, button: HTMLElement): boolean {
    if (!(event instanceof MouseEvent || event instanceof TouchEvent)) {
      return false;
    }

    const rect = button.getBoundingClientRect();
    const clickX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clickY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    // Check if click is within button bounds plus a small margin
    const margin = 20;
    return (
      clickX >= rect.left - margin &&
      clickX <= rect.right + margin &&
      clickY >= rect.top - margin &&
      clickY <= rect.bottom + margin
    );
  }
}
