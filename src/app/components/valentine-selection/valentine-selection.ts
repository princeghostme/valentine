import { Component, DOCUMENT, Inject, signal } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document) {

  }

  updateName(value: string): void {
    this.name.set(value);
  }
  private Encryptname(){
    const value = this.name().trim();
    return atob(value);
  }

  submit(): void {
    const value = this.Encryptname();

    if (!value) return;

    this.router.navigate(['/valentinesmagic'], {
      queryParams: {
        name: value
      }
    });
  }

  genrateUrl(): string {
    const value = this.Encryptname();
    const baseUrl = this.document.location.origin;
    this.genratedUrl.set(`${baseUrl}/valentinesmagic?name=${value}`);
    return this.genratedUrl();
  }
}
