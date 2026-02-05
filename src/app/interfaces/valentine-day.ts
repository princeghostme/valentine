export type ValentineDay =
  | 'rose'
  | 'propose'
  | 'chocolate'
  | 'teddy'
  | 'promise'
  | 'hug'
  | 'kiss'
  | 'valentine'
  | '';
export type ValentineState = 'propose' | 'success' | 'reject';

export interface ValentineProposeContent {
  title: string; // "Hey ❤️"
  intro: string; // "I’ve been wanting to say this..."
  line1: string; // Main emotional line
  line2: string; // Follow-up line
  question: string; // "will you be my Valentine?"
  signature: string; // "with all my heart 💖"
  yesText: string; // Yes button text
  noText: string; // No button text
}

export interface ValentineSuccessContent {
  title: string;
  line1: string;
  line2: string;
}

export interface ValentineRejectContent {
  title: string;
  lines: string[];
}
