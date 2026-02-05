import { Component, EventEmitter, input, Output } from '@angular/core';
import { proposalState } from '../../pages/home/home';

@Component({
  selector: 'app-reject-message',
  imports: [],
  templateUrl: './reject-message.html',
  styleUrl: './reject-message.css',
})
export class RejectMessage {
  name = input<string>('');
  @Output() reset = new EventEmitter<proposalState>();

  onReset(): void {
    this.reset.emit('initial');
  }
}
