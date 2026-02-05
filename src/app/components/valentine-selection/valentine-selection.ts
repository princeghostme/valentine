import { Component, DOCUMENT, Inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Encrypt } from '../../services/encrypt';
import { Queryparams } from '../../interfaces/queryparams';
import { ValentineDay } from '../../interfaces/valentine-day';

@Component({
  selector: 'app-valentine-selection',
  imports: [],
  templateUrl: './valentine-selection.html',
  styleUrl: './valentine-selection.css',
})
export class ValentineSelection {
  // Signal to store input value
  valnetineName = signal('');
  yourName = signal('');
  genratedUrl = signal('');
  selectedDay = signal<ValentineDay>('valentine');

  valentineDays: { value: ValentineDay; label: string }[] = [
    { value: 'rose', label: '🌹 Rose Day - Feb 7' },
    { value: 'propose', label: '💌 Propose Day - Feb 8' },
    { value: 'chocolate', label: '🍫 Chocolate Day - Feb 9' },
    { value: 'teddy', label: '🧸 Teddy Day - Feb 10' },
    { value: 'promise', label: '🤞 Promise Day - Feb 11' },
    { value: 'hug', label: '🤗 Hug Day - Feb 12' },
    { value: 'kiss', label: '💋 Kiss Day - Feb 13' },
    { value: 'valentine', label: '❤️ Valentine\'s Day - Feb 14' }
  ];


  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private encryptService: Encrypt,
  ) {}

  updateValentineName(value: string): void {
    this.valnetineName.set(value);
  }

  updateYourName(value: string): void {
    this.yourName.set(value);
  }

  updateDay(day: string): void {
  this.selectedDay.set(day as ValentineDay);
}


  private async EncryptValentineDetail() {
    const _val:Queryparams = {
      yourName: this.yourName().trim(),
      valnetineName: this.valnetineName().trim(),
      day: this.selectedDay()
    }
    return this.encryptService.encrypt(JSON.stringify(_val));
  }

  async submit(): Promise<void> {
    const valentinesDetails = await this.EncryptValentineDetail();

    if (!valentinesDetails) return;

    this.router.navigate(['/valentinesmagic'], {
      queryParams: {
        details: valentinesDetails,
      },
    });
  }

  async genrateUrl(): Promise<string> {
    const value = await this.EncryptValentineDetail();
    const baseUrl = this.document.location.origin;
    this.genratedUrl.set(`${baseUrl}/valentinesmagic?details=${value}`);
    this.copied = false;
    return this.genratedUrl();
  }

  copied = false;

  copyUrl(): void {
    const url = this.genratedUrl();
    if (!url) return;

    navigator.clipboard.writeText(url).then(() => {
      this.copied = true;
    });
  }
}
