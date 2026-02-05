import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Encrypt {

  private encoder = new TextEncoder();
  private decoder = new TextDecoder();
  private password = 'my-secret-key'; // any length now

  async encrypt(text: string): Promise<string> {
    const key = await this.deriveKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      this.encoder.encode(text)
    );

    return encodeURIComponent(
      btoa(
        String.fromCharCode(...iv) +
        String.fromCharCode(...new Uint8Array(encrypted))
      )
    );
  }

  async decrypt(cipher: string): Promise<string> {
    const data = Uint8Array.from(
      atob(decodeURIComponent(cipher)),
      c => c.charCodeAt(0)
    );

    const iv = data.slice(0, 12);
    const encrypted = data.slice(12);
    const key = await this.deriveKey();

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    return this.decoder.decode(decrypted);
  }

  private async deriveKey(): Promise<CryptoKey> {
    const hash = await crypto.subtle.digest(
      'SHA-256',
      this.encoder.encode(this.password)
    );

    return crypto.subtle.importKey(
      'raw',
      hash,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }
}

