import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  input
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
    valnetineName: '',
  });

  valentineDay = input.required<ValentineDay>();

  /* -------------------- Output -------------------- */

  @Output() response = new EventEmitter<proposalState>();

  /* -------------------- State -------------------- */

  content$!: Observable<ValentineProposeContent>;
  isMobile = false;

  noButtonStyle: {
    left?: string;
    top?: string;
  } = {
    left: '60%',
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
      this.isMobile = window.matchMedia('(pointer: coarse)').matches;
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

  private noTouchedOnce = false;
  private lastX = 0;
  private lastY = 0;

  handleNoTouch(event: TouchEvent): void {
    if (!this.isMobile) return;

    event.preventDefault();
    event.stopPropagation();

    if (!this.noTouchedOnce) {
      this.noTouchedOnce = true;
      this.moveNoButton();
      return;
    }

    this.moveNoButton();
  }

  moveNoButton(): void {
    const containerWidth = 320;
    const containerHeight = 160;

    const buttonWidth = 90;
    const buttonHeight = 44;

    const minDistance = 80;

    const maxX = containerWidth - buttonWidth;
    const maxY = containerHeight - buttonHeight;

    let x = 0;
    let y = 0;
    let distance = 0;

    do {
      x = Math.random() * maxX;
      y = Math.random() * maxY;
      distance = Math.hypot(x - this.lastX, y - this.lastY);
    } while (distance < minDistance);

    this.lastX = x;
    this.lastY = y;

    this.noButtonStyle = {
      left: `${x}px`,
      top: `${y}px`,
    };
  }
}
