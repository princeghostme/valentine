import { Component, DOCUMENT, Inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Encrypt } from '../../services/encrypt';

@Component({
  selector: 'app-valentine-selection',
  imports: [],
  templateUrl: './valentine-selection.html',
  styleUrl: './valentine-selection.css',
})
export class ValentineSelection {
 // Signal to store input value
  name = signal('');
  genratedUrl = signal('');

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document, private encryptService: Encrypt) {

  }

  updateName(value: string): void {
    this.name.set(value);
  }

  private async Encryptname(){
    const value = this.name().trim();
    return await this.encryptService.encrypt(value);
  }

  async submit(): Promise<void> {
    const value = await this.Encryptname();

    if (!value) return;

    this.router.navigate(['/valentinesmagic'], {
      queryParams: {
        name: value
      }
    });
  }

  async genrateUrl(): Promise<string> {
    const value = await this.Encryptname();
    const baseUrl = this.document.location.origin;
    this.genratedUrl.set(`${baseUrl}/valentinesmagic?name=${value}`);
    return this.genratedUrl();
  }
}
