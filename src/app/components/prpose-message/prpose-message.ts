import { NgStyle } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { proposalState } from '../../pages/home/home';

@Component({
  selector: 'app-prpose-message',
  imports: [NgStyle],
  templateUrl: './prpose-message.html',
  styleUrl: './prpose-message.css',
})
export class PrposeMessage {
  name = input<string>('');
  noButtonStyle: { transform?: string } = {};
  @Output() response = new EventEmitter<proposalState>();

  onYes(): void {
    this.response.emit('accepted');
  }

  onNo(): void {
    this.response.emit('rejected');
  }

  moveNoButton(): void {
    const maxX = window.innerWidth / 16; // Approximate vw to pixels
    const maxY = window.innerHeight / 16; // Approximate vh to pixels

    let xVp = Math.random() * 80 - 40;
    let yVp = Math.random() * 80 - 40;

    // Clamp values to keep button on screen
    xVp = Math.max(-40, Math.min(40, xVp));
    yVp = Math.max(-40, Math.min(40, yVp));

    this.noButtonStyle = {
      transform: `translate(${xVp}vw, ${yVp}vh)`,
    };
  }
}
