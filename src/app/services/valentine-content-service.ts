import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  ValentineDay,
  ValentineProposeContent,
  ValentineSuccessContent,
  ValentineRejectContent,
  ValentineContentMap
} from '../interfaces/valentine-day';

import content from '../../../public/assets/valentine/valentine-content.json';

@Injectable({ providedIn: 'root' })
export class ValentineContentService {

  // Typed, in-memory content
  private readonly data = content as ValentineContentMap;

  constructor() {}

  getProposeContent(
    day: ValentineDay
  ): Observable<ValentineProposeContent> {
    return of(this.data[day].propose);
  }

  getSuccessContent(
    day: ValentineDay
  ): Observable<ValentineSuccessContent> {
    return of(this.data[day].success);
  }

  getRejectContent(
    day: ValentineDay
  ): Observable<ValentineRejectContent> {
    return of(this.data[day].reject);
  }
}
