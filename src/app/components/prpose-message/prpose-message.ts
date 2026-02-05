import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  input,
  ElementRef,
  ViewChild
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

  /* ================= INPUTS ================= */

  name = input<Queryparams>({
    yourName: '',
    valentineName: '',
  });

  valentineDay = input.required<ValentineDay>();

  /* ================= OUTPUT ================= */

  @Output() response = new EventEmitter<proposalState>();

  /* ================= VIEW ================= */

  @ViewChild('actionZone') actionZone?: ElementRef<HTMLElement>;
  @ViewChild('yesZone') yesZone?: ElementRef<HTMLElement>;

  /* ================= STATE ================= */

  content$!: Observable<ValentineProposeContent>;
  isMobile = false;

  noButtonStyle = {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.35s ease-out'
  };

  /* ================= INTERNALS ================= */

  private lastX = 0;
  private lastY = 0;

  private readonly buttonWidth = 120;
  private readonly buttonHeight = 52;
  private readonly minDistance = 90;

  constructor(
    private valentineService: ValentineContentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /* ================= LIFECYCLE ================= */

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.isMobile =
        window.matchMedia('(pointer: coarse)').matches ||
        window.innerWidth < 768;
    }

    this.content$ = this.valentineService.getProposeContent(
      this.valentineDay()
    );

    // Wait until DOM is rendered (because of @if + async)
    this.content$.subscribe(() => {
      setTimeout(() => this.centerNoButton(), 0);
    });
  }

  /* ================= ACTIONS ================= */

  onYes(): void {
    this.response.emit('accepted');
  }

  onNoHoverOrTouch(): void {
    this.moveNoButton();
  }

  /* ================= POSITIONING ================= */

  private centerNoButton(): void {
    if (!this.actionZone || !this.yesZone || !isPlatformBrowser(this.platformId)) return;

    const containerRect = this.actionZone.nativeElement.getBoundingClientRect();
    const yesRect = this.yesZone.nativeElement.getBoundingClientRect();

    // Start BELOW the YES button
    const minY = yesRect.bottom - containerRect.top + 16;

    const x = (containerRect.width - this.buttonWidth) / 2;
    const y = minY + 10;

    this.lastX = x;
    this.lastY = y;

    this.noButtonStyle = {
      left: `${x}px`,
      top: `${y}px`,
      transform: 'translate(0, 0)',
      transition: 'all 0.35s ease-out'
    };
  }

  private moveNoButton(): void {
    if (!this.actionZone || !this.yesZone || !isPlatformBrowser(this.platformId)) return;

    const containerRect = this.actionZone.nativeElement.getBoundingClientRect();
    const yesRect = this.yesZone.nativeElement.getBoundingClientRect();

    const minY = yesRect.bottom - containerRect.top + 16;
    const maxX = containerRect.width - this.buttonWidth;
    const maxY = containerRect.height - this.buttonHeight;

    let x = 0;
    let y = 0;
    let distance = 0;
    let attempts = 0;

    do {
      x = Math.random() * maxX;
      y = minY + Math.random() * (maxY - minY);
      distance = Math.hypot(x - this.lastX, y - this.lastY);
      attempts++;
    } while (distance < this.minDistance && attempts < 15);

    this.lastX = x;
    this.lastY = y;

    this.noButtonStyle = {
      left: `${x}px`,
      top: `${y}px`,
      transform: 'translate(0, 0)',
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
    };
  }
}
