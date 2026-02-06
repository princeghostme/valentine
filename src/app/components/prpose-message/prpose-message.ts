import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ElementRef,
  ViewChild,
  input,
} from '@angular/core';
import { AsyncPipe, isPlatformBrowser, NgStyle } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

import { proposalState } from '../../pages/home/home';
import { Queryparams } from '../../interfaces/queryparams';
import { ValentineDay, ValentineProposeContent } from '../../interfaces/valentine-day';
import { ValentineContentService } from '../../services/valentine-content-service';

@Component({
  selector: 'app-prpose-message',
  standalone: true,
  imports: [AsyncPipe, NgStyle],
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

  @ViewChild('containerRef') containerRef!: ElementRef<HTMLElement>;
  @ViewChild('noBtn') noBtn!: ElementRef<HTMLElement>;

  /* ================= STATE ================= */

  content$!: Observable<ValentineProposeContent>;
  isMobile = false;

  noButtonStyle: {
    left: string;
    top: string;
  } = {
    left: '50%',
    top: '50%',
  };

  private lastX = 0;
  private lastY = 0;

  public runningButton = false;

  constructor(
    private valentineService: ValentineContentService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  /* ================= LIFECYCLE ================= */

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    }

    this.content$ = this.valentineService.getProposeContent(this.valentineDay());
  }

  /* ================= ACTIONS ================= */

  onYes(): void {
    this.response.emit('accepted');
  }
  onNo(): void {
    const chance = Math.random(); // 0.0 → 0.999...
    if (chance < 0.01) {
      // 1% probability
      this.response.emit('rejected');
      return;
    }

    this.moveNoButton();
  }

  /* ================= NO BUTTON MOVEMENT ================= */

  moveNoButton(): void {
    if (!this.runningButton) {
      this.runningButton = true;
    }

    if (!this.containerRef || !this.noBtn) return;

    const container = this.containerRef.nativeElement.getBoundingClientRect();

    const button = this.noBtn.nativeElement.getBoundingClientRect();

    const maxX = container.width - button.width;
    const maxY = container.height - button.height;

    const minDistance = this.isMobile ? 120 : 100;

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
