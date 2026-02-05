import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  input,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit
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
export class PrposeMessage implements OnInit, AfterViewInit {

  /* -------------------- Inputs -------------------- */
  name = input<Queryparams>({
    yourName: '',
    valentineName: '',
  });

  valentineDay = input.required<ValentineDay>();

  /* -------------------- Output -------------------- */
  @Output() response = new EventEmitter<proposalState>();

  /* -------------------- View Refs -------------------- */
  @ViewChild('actionZone') actionZone?: ElementRef<HTMLElement>;

  /* -------------------- State -------------------- */
  content$!: Observable<ValentineProposeContent>;
  isMobile = false;

  noButtonStyle: {
    left?: string;
    top?: string;
    transform?: string;
    transition?: string;
  } = {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  };

  /* -------------------- Button Dimensions -------------------- */
  private buttonWidth = 100; // Approximate button width
  private buttonHeight = 48; // Approximate button height

  /* -------------------- Constructor -------------------- */
  constructor(
    private valentineService: ValentineContentService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private elementRef: ElementRef
  ) {}

  /* -------------------- Lifecycle -------------------- */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkIfMobile();
    }

    this.content$ = this.valentineService.getProposeContent(
      this.valentineDay()
    );
  }

  ngAfterViewInit(): void {
    // Initial button position
    setTimeout(() => {
      if (this.actionZone) {
        this.centerNoButton();
      }
    }, 100);
  }

  /* -------------------- Actions -------------------- */
  onYes(): void {
    this.response.emit('accepted');
  }

  /* -------------------- No Button Logic -------------------- */
  private moveCount = 0;
  private lastX = 0;
  private lastY = 0;

  onNoButtonAttempt(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.moveCount === 0) {
      this.moveCount++;
      return;
    }

    this.moveNoButtonFar();
  }

  onNoButtonHover(): void {
    if (!this.isMobile && this.moveCount > 0) {
      this.moveNoButtonFar();
    }
  }

  onNoButtonTouch(event: TouchEvent): void {
    if (this.isMobile) {
      this.onNoButtonAttempt(event);
    }
  }

  private centerNoButton(): void {
    if (!this.actionZone || !isPlatformBrowser(this.platformId)) return;

    const container = this.actionZone.nativeElement;
    const containerRect = container.getBoundingClientRect();

    const x = (containerRect.width - this.buttonWidth) / 2;
    const y = (containerRect.height - this.buttonHeight) / 2;

    this.lastX = x;
    this.lastY = y;

    this.noButtonStyle = {
      left: `${x}px`,
      top: `${y}px`,
      transform: 'translate(0, 0)',
      transition: 'all 0.3s ease-out'
    };
  }

  moveNoButtonFar(): void {
    if (!this.actionZone || !isPlatformBrowser(this.platformId)) return;

    const container = this.actionZone.nativeElement;
    const containerRect = container.getBoundingClientRect();

    // Calculate available space within the action zone
    const maxX = containerRect.width - this.buttonWidth;
    const maxY = containerRect.height - this.buttonHeight;

    // Ensure we stay within bounds
    const minX = 0;
    const minY = 0;

    // Generate random position far from current position
    let newX, newY;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      newX = Math.random() * maxX;
      newY = Math.random() * maxY;
      attempts++;

      // Ensure we're moving a decent distance (at least 50px)
      const distance = Math.sqrt(
        Math.pow(newX - this.lastX, 2) + Math.pow(newY - this.lastY, 2)
      );

      if (distance > 50 || attempts >= maxAttempts) {
        break;
      }
    } while (true);

    // Clamp values to ensure they're within bounds
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    this.lastX = newX;
    this.lastY = newY;

    // Add fun animations
    const animations = [
      { transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
      { transition: 'all 0.5s ease-out' },
      { transition: 'all 0.3s linear' },
      { transition: 'all 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }
    ];

    // Add random rotation and bounce effect
    const rotation = Math.random() > 0.5 ?
      (5 + Math.random() * 5) :
      -(5 + Math.random() * 5);

    const scale = 0.95 + (Math.random() * 0.1);
    const bounce = Math.random() > 0.5 ? 'translateY(-5px)' : 'translateY(5px)';

    this.noButtonStyle = {
      left: `${newX}px`,
      top: `${newY}px`,
      transform: `${bounce} rotate(${rotation}deg) scale(${scale})`,
      ...animations[Math.floor(Math.random() * animations.length)]
    };

    this.moveCount++;

    // If button hasn't moved much, force a bigger move next time
    if (attempts >= maxAttempts) {
      this.lastX = Math.random() * maxX;
      this.lastY = Math.random() * maxY;
    }
  }

  private checkIfMobile(): void {
    this.isMobile = window.matchMedia('(pointer: coarse)').matches ||
                    window.innerWidth < 768;

    // Adjust button size for mobile
    if (this.isMobile) {
      this.buttonWidth = 120;
      this.buttonHeight = 52;
    }
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onDocumentClick(event: Event): void {
    const noButton = document.querySelector('[data-no-button]') as HTMLElement;
    if (noButton && this.isClickNearButton(event, noButton)) {
      event.preventDefault();
      event.stopPropagation();
      this.moveNoButtonFar();
    }
  }

  private isClickNearButton(event: Event, button: HTMLElement): boolean {
    if (!(event instanceof MouseEvent || event instanceof TouchEvent)) {
      return false;
    }

    const rect = button.getBoundingClientRect();
    const clickX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clickY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    const margin = 40; // Larger margin for easier clicking
    return (
      clickX >= rect.left - margin &&
      clickX <= rect.right + margin &&
      clickY >= rect.top - margin &&
      clickY <= rect.bottom + margin
    );
  }

  // Listen for window resize to adjust button position
  @HostListener('window:resize')
  onResize(): void {
    if (this.actionZone && isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        // Keep button within bounds on resize
        const container = this.actionZone!.nativeElement;
        const containerRect = container.getBoundingClientRect();

        const maxX = containerRect.width - this.buttonWidth;
        const maxY = containerRect.height - this.buttonHeight;

        // Clamp current position to new bounds
        const currentX = parseFloat(this.noButtonStyle.left || '0');
        const currentY = parseFloat(this.noButtonStyle.top || '0');

        const newX = Math.max(0, Math.min(maxX, currentX));
        const newY = Math.max(0, Math.min(maxY, currentY));

        this.lastX = newX;
        this.lastY = newY;

        this.noButtonStyle = {
          ...this.noButtonStyle,
          left: `${newX}px`,
          top: `${newY}px`
        };
      }, 100);
    }
  }
}
