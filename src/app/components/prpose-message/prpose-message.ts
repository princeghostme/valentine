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
    valnetineName: '',
  });

  valentineDay = input.required<ValentineDay>();

  /* -------------------- Output -------------------- */
  @Output() response = new EventEmitter<proposalState>();

  /* -------------------- View Refs -------------------- */
  @ViewChild('desktopNoContainer') desktopNoContainer?: ElementRef<HTMLElement>;
  @ViewChild('mobileNoContainer') mobileNoContainer?: ElementRef<HTMLElement>;

  /* -------------------- State -------------------- */
  content$!: Observable<ValentineProposeContent>;
  isMobile = false;
  isNoButtonDodging = false;

  noButtonStyle: {
    left?: string;
    top?: string;
    transform?: string;
    transition?: string;
  } = {};

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
    // Initialize button position
    setTimeout(() => this.resetNoButtonPosition(), 100);
  }

  /* -------------------- Actions -------------------- */
  onYes(): void {
    this.response.emit('accepted');
  }

  /* -------------------- No Button Logic -------------------- */
  private moveCount = 0;

  onNoButtonAttempt(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.moveCount === 0) {
      this.moveCount++;
      return;
    }

    this.moveNoButton();
  }

  onNoButtonHover(): void {
    if (!this.isMobile && this.moveCount > 0) {
      this.moveNoButton();
    }
  }

  onNoButtonTouch(event: TouchEvent): void {
    if (this.isMobile) {
      this.onNoButtonAttempt(event);
    }
  }

  private resetNoButtonPosition(): void {
    this.noButtonStyle = {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.3s ease-out'
    };
  }

  moveNoButton(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const container = this.isMobile
      ? this.mobileNoContainer?.nativeElement
      : this.desktopNoContainer?.nativeElement;

    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const buttonWidth = this.isMobile ? containerRect.width : 120;
    const buttonHeight = this.isMobile ? 48 : 48;

    // Calculate available space within container
    const maxX = containerRect.width - buttonWidth;
    const maxY = containerRect.height - buttonHeight;

    // Generate random position within container bounds
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    // Add some fun animations
    const animations = [
      { transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
      { transition: 'all 0.4s ease-out' },
      { transition: 'all 0.25s linear' },
      { transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }
    ];

    const rotation = Math.random() > 0.5 ? 5 : -5;
    const scale = 0.95 + (Math.random() * 0.1);

    this.noButtonStyle = {
      left: `${x}px`,
      top: `${y}px`,
      transform: `translate(0, 0) rotate(${rotation}deg) scale(${scale})`,
      ...animations[Math.floor(Math.random() * animations.length)]
    };

    this.moveCount++;
  }

  private checkIfMobile(): void {
    this.isMobile = window.matchMedia('(pointer: coarse)').matches ||
                    window.innerWidth < 768;
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onDocumentClick(event: Event): void {
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

    const margin = 30;
    return (
      clickX >= rect.left - margin &&
      clickX <= rect.right + margin &&
      clickY >= rect.top - margin &&
      clickY <= rect.bottom + margin
    );
  }
}
