import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ValentineDay, ValentineProposeContent, ValentineSuccessContent, ValentineRejectContent } from '../interfaces/valentine-day';


@Injectable({ providedIn: 'root' })
export class ValentineContentService {
  private readonly url = '/valentine/valentine-content.json';

  constructor(private http: HttpClient) {}

  getProposeContent(
    day: ValentineDay
  ): Observable<ValentineProposeContent> {
    return this.http
      .get<any>(this.url)
      .pipe(map(data => data[day].propose));
  }

  getSuccessContent(
    day: ValentineDay
  ): Observable<ValentineSuccessContent> {
    return this.http
      .get<any>(this.url)
      .pipe(map(data => data[day].success));
  }

  getRejectContent(
    day: ValentineDay
  ): Observable<ValentineRejectContent> {
    return this.http
      .get<any>(this.url)
      .pipe(map(data => data[day].reject));
  }
}
