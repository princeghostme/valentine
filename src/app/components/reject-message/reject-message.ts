import {
  Component,
  EventEmitter,
  Inject,
  input,
  Output,
  OnInit,
  OnDestroy
} from '@angular/core';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

import { proposalState } from '../../pages/home/home';
import { Queryparams } from '../../interfaces/queryparams';
import {
  ValentineDay,
  ValentineRejectContent
} from '../../interfaces/valentine-day';
import { ValentineContentService } from '../../services/valentine-content-service';

@Component({
  selector: 'app-reject-message',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './reject-message.html',
  styleUrl: './reject-message.css',
})
export class RejectMessage implements OnInit, OnDestroy {

  /* -------------------- Inputs -------------------- */

  name = input<Queryparams>({
    yourName: '',
    valentineName: '',
  });

  valentineDay = input.required<ValentineDay>();

  /* -------------------- Output -------------------- */

  @Output() reset = new EventEmitter<proposalState>();

  /* -------------------- State -------------------- */

  content$!: Observable<ValentineRejectContent>;

  currentRejectIndex = 0;
  countdown = 5;

  private timerId?: number;
  private countdownId?: number;

  /* -------------------- Constructor -------------------- */

  constructor(
    private valentineService: ValentineContentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /* -------------------- Lifecycle -------------------- */

  ngOnInit(): void {

    // Load reject content
    this.content$ = this.valentineService.getRejectContent(
      this.valentineDay()
    );

    // Pick a random reject line safely (after content loads)
    this.content$.subscribe(content => {
      if (content?.lines?.length) {
        this.currentRejectIndex = Math.floor(
          Math.random() * content.lines.length
        );
      }
    });

    // Start timers ONLY in browser
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoReset();
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  /* -------------------- Actions -------------------- */

  onReset(): void {
    this.clearTimers();
    this.reset.emit('initial');
  }

  cancelAutoReset(): void {
    this.clearTimers();
    this.countdown = 0;
  }

  /* -------------------- Timer Logic -------------------- */

  private startAutoReset(): void {
    this.timerId = window.setTimeout(() => {
      this.onReset();
    }, 5000);

    this.countdownId = window.setInterval(() => {
      this.countdown--;
    }, 1000);
  }

  private clearTimers(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = undefined;
    }

    if (this.countdownId) {
      clearInterval(this.countdownId);
      this.countdownId = undefined;
    }
  }
}
