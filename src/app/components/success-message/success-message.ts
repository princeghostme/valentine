import { Component, EventEmitter, input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { proposalState } from '../../pages/home/home';
import { Queryparams } from '../../interfaces/queryparams';

@Component({
  selector: 'app-success-message',
  standalone: true,
  templateUrl: './success-message.html',
  styleUrl: './success-message.css',
})
export class SuccessMessage {

    name = input<Queryparams>({
    yourName: '',
    valnetineName: '',
  });

  @Output() reset = new EventEmitter<proposalState>();

  constructor(private router: Router) {}

  onReset(): void {
    this.reset.emit('initial');
  }
}
