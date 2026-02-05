import { Component, EventEmitter, input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { proposalState } from '../../pages/home/home';
import { Queryparams } from '../../interfaces/queryparams';
import { ValentineDay, ValentineSuccessContent } from '../../interfaces/valentine-day';
import { ValentineContentService } from '../../services/valentine-content-service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-success-message',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './success-message.html',
  styleUrl: './success-message.css',
})
export class SuccessMessage {
  name = input<Queryparams>({
    yourName: '',
    valentineName: '',
  });

  @Output() reset = new EventEmitter<proposalState>();

  valentineDay = input.required<ValentineDay>();
  content$!: Observable<ValentineSuccessContent>;
  constructor(private valentineService: ValentineContentService) {}

  ngOnInit(): void {
    this.content$ = this.valentineService.getSuccessContent(this.valentineDay());
  }

  onReset(): void {
    this.reset.emit('initial');
  }
}
