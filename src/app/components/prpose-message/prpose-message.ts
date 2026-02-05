import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { NgStyle } from '@angular/common';
import { proposalState } from '../../pages/home/home';
import { Queryparams } from '../../interfaces/queryparams';

@Component({
  selector: 'app-prpose-message',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './prpose-message.html',
  styleUrl: './prpose-message.css',
})
export class PrposeMessage implements OnInit {
  name = input<Queryparams>({
    yourName: '',
    valnetineName: '',
  });

  @Output() response = new EventEmitter<proposalState>();

  isMobile = false;

  ngOnInit(): void {
    this.isMobile = window?.matchMedia('(pointer: coarse)').matches;
  }

  noButtonStyle: {
    left?: string;
    top?: string;
  } = {
    left: '60%',
    top: '50%',
  };

  onYes(): void {
    this.response.emit('accepted');
  }

  onNo(): void {
    this.response.emit('rejected');
  }

  private noTouchedOnce = false;

  handleNoTouch(event: TouchEvent): void {
    if (!this.isMobile) return;

    // 🚫 Prevent the tap
    event.preventDefault();
    event.stopPropagation();

    // First touch → escape immediately
    if (!this.noTouchedOnce) {
      this.noTouchedOnce = true;
      this.moveNoButton();
      return;
    }

    // Optional: even second touch escapes again
    this.moveNoButton();
  }

  private lastX = 0;
  private lastY = 0;

  moveNoButton(): void {
    const containerWidth = 320;
    const containerHeight = 160;

    const buttonWidth = 90;
    const buttonHeight = 44;

    const minDistance = 80; // 👈 minimum jump distance (KEY)

    const maxX = containerWidth - buttonWidth;
    const maxY = containerHeight - buttonHeight;

    let x = 0;
    let y = 0;
    let distance = 0;

    // 🔁 Keep trying until we get a far-enough position
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
