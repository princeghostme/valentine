import { Component,signal } from '@angular/core';
import { PrposeMessage } from "../../components/prpose-message/prpose-message";
import { SuccessMessage } from '../../components/success-message/success-message';
import { RejectMessage } from '../../components/reject-message/reject-message';
import { ActivatedRoute, Router } from '@angular/router';
import { Encrypt } from '../../services/encrypt';
import { Queryparams } from '../../interfaces/queryparams';

export type proposalState = 'initial' | 'accepted' | 'rejected' | null;

@Component({
  selector: 'app-home',
  imports: [SuccessMessage, RejectMessage, PrposeMessage],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  public detail = signal<Queryparams>({
    yourName: '',
    valnetineName: '',
  });

  public proposalRes = signal<proposalState>(null);

  public setResponse(res: proposalState): void {
    this.proposalRes.set(res);
  }

  constructor(private router: ActivatedRoute, private _router:Router , private encryptService: Encrypt) {
    this.router.queryParams.subscribe(async(params) => {
      const name = params['details'];
      const detail = JSON.parse(await this.encryptService.decrypt(name)) ?? null;
      if(!detail){
        this._router.navigate(['/']);
      }
      this.detail.set(detail);
  })
}

}
