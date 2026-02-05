import { Component, EventEmitter, input, Output } from '@angular/core';
import { proposalState } from '../../pages/home/home';

@Component({
  selector: 'app-success-message',
  imports: [],
  templateUrl: './success-message.html',
  styleUrl: './success-message.css',
})
export class SuccessMessage {


  name = input<string>('');

  @Output() reset = new EventEmitter<proposalState>();

  onReset(): void {
    this.reset.emit('initial');
  }

}
