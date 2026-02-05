import { Component, EventEmitter, input, Output, OnInit, OnDestroy } from '@angular/core';
import { proposalState } from '../../pages/home/home';
import { Queryparams } from '../../interfaces/queryparams';

@Component({
  selector: 'app-reject-message',
  standalone: true,
  templateUrl: './reject-message.html',
  styleUrl: './reject-message.css',
})
export class RejectMessage implements OnInit, OnDestroy {
  name = input<Queryparams>({
    yourName: '',
    valnetineName: '',
  });

  @Output() reset = new EventEmitter<proposalState>();

  // 💓 A/B copy variants
  private sweetLines = [
    'Sometimes hearts take a second look 🤍',
    'Good things often begin unexpectedly 🌷',
    'A small yes can lead to a beautiful story ✨',
  ];

  private funnyLines = [
    'That “No” looked a little unsure 😌',
    'Are you sure your finger didn’t slip? 😄',
    'Blink twice if that was accidental 😉',
  ];

  dynamicLine = '';
  countdown = 5;

  private timerId?: number;
  private countdownId?: number;

  ngOnInit(): void {
    this.pickRandomLine();
    this.startAutoReset();
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  onReset(): void {
    this.clearTimers();
    this.reset.emit('initial');
  }

  // 🎲 Random A/B copy selection
  private pickRandomLine(): void {
    const pool = Math.random() > 0.5 ? this.sweetLines : this.funnyLines;
    this.dynamicLine = pool[Math.floor(Math.random() * pool.length)];
  }

  // 🔄 Auto return logic
  private startAutoReset(): void {
    this.timerId = window.setTimeout(() => {
      this.onReset();
    }, 5000);

    this.countdownId = window.setInterval(() => {
      this.countdown--;
    }, 1000);
  }

  cancelAutoReset(): void {
    this.clearTimers();
    this.countdown = 0;
  }

  private clearTimers(): void {
    if (this.timerId) clearTimeout(this.timerId);
    if (this.countdownId) clearInterval(this.countdownId);
  }
}
