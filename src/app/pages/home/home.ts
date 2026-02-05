import { Component,signal } from '@angular/core';
import { PrposeMessage } from "../../components/prpose-message/prpose-message";
import { SuccessMessage } from '../../components/success-message/success-message';
import { RejectMessage } from '../../components/reject-message/reject-message';
import { ActivatedRoute } from '@angular/router';
import { Encrypt } from '../../services/encrypt';

export type proposalState = 'initial' | 'accepted' | 'rejected' | null;

@Component({
  selector: 'app-home',
  imports: [PrposeMessage, SuccessMessage, RejectMessage],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  public name = signal<string>('Riya');

  public proposalRes = signal<proposalState>(null);

  public setResponse(res: proposalState): void {
    this.proposalRes.set(res);
  }

  constructor(private router: ActivatedRoute, private encryptService: Encrypt) {
    this.router.queryParams.subscribe(async(params) => {
      const name = params['name'];
      this.name.set(await this.encryptService.decrypt(name));
  })
}

}
