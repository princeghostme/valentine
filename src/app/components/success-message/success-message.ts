import { Component, EventEmitter, input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { proposalState } from '../../pages/home/home';
import { Queryparams } from '../../interfaces/queryparams';
import { LoveQuote, ValentineDay, ValentineSuccessContent } from '../../interfaces/valentine-day';
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

  private quotes: LoveQuote[] = [
    {
      text: 'The best thing to hold onto in life is each other.',
      author: 'Audrey Hepburn',
    },
    {
      text: 'Love is composed of a single soul inhabiting two bodies.',
      author: 'Aristotle',
    },
    {
      text: 'Where there is love there is life.',
      author: 'Mahatma Gandhi',
    },
    {
      text: 'You don’t love someone for their looks, but for who they are.',
    },
    {
      text: 'In all the world, there is no heart for me like yours.',
      author: 'Maya Angelou',
    },
  ];

  selectedQuote!: LoveQuote;

  @Output() reset = new EventEmitter<proposalState>();

  valentineDay = input.required<ValentineDay>();
  content$!: Observable<ValentineSuccessContent>;
  constructor(private valentineService: ValentineContentService) {}

  ngOnInit(): void {
    this.content$ = this.valentineService.getSuccessContent(this.valentineDay());
    this.pickRandomQuote();
  }

  private pickRandomQuote(): void {
    const index = Math.floor(Math.random() * this.quotes.length);
    this.selectedQuote = this.quotes[index];
  }
  onReset(): void {
    this.reset.emit('initial');
  }
}
