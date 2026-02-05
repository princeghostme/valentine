import { Component, OnInit, signal } from '@angular/core';
import { PrposeMessage } from '../../components/prpose-message/prpose-message';
import { SuccessMessage } from '../../components/success-message/success-message';
import { RejectMessage } from '../../components/reject-message/reject-message';
import { ActivatedRoute, Router } from '@angular/router';
import { Encrypt } from '../../services/encrypt';
import { Queryparams } from '../../interfaces/queryparams';
import { ValentineContentService } from '../../services/valentine-content-service';
import { ValentineDay, ValentineProposeContent } from '../../interfaces/valentine-day';

export type proposalState = 'initial' | 'accepted' | 'rejected' | null;

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [SuccessMessage, RejectMessage, PrposeMessage],
})
export class Home implements OnInit {
  public detail = signal<Queryparams>({
    yourName: '',
    valnetineName: '',
  });
  public currentDay = signal<ValentineDay>(this.getCurrentDay());

  private getCurrentDay(): ValentineDay {
    const today = new Date();
    const month = today.getMonth() + 1; // 0-indexed
    const date = today.getDate();

    if (month !== 2) return 'valentine';

    switch (date) {
      case 7:
        return 'pink';
      case 8:
        return 'propose';
      case 9:
        return 'chocolate';
      case 10:
        return 'teddy';
      case 11:
        return 'promise';
      case 12:
        return 'hug';
      case 13:
        return 'kiss';
      case 14:
        return 'valentine';
      default:
        return 'default';
    }
  }

  public proposalRes = signal<proposalState>(null);

  public setResponse(res: proposalState): void {
    this.proposalRes.set(res);
  }

  public onstart(): void {
    this.currentDay.set(this.getCurrentDay());
    this.router.queryParams.subscribe(async (params) => {
      const name = params['details'];
      const detail = JSON.parse(await this.encryptService.decrypt(name)) ?? null;
      if (!detail) {
        this._router.navigate(['/']);
      }
      this.detail.set(detail);
    });
  }

  constructor(
    private router: ActivatedRoute,
    private _router: Router,
    private encryptService: Encrypt,
  ) {
    this.onstart();
  }

  ngOnInit(): void {
    this.onstart();
  }
}
