/* -------------------- Days -------------------- */

export type ValentineDay =
  | 'rose'
  | 'propose'
  | 'chocolate'
  | 'teddy'
  | 'promise'
  | 'hug'
  | 'kiss'
  | 'valentine'
  | 'default';

/* -------------------- Propose -------------------- */

export interface ValentineProposeContent {
  title: string;
  intro: string;
  line1: string;
  line2: string;
  question: string;
  signature: string;
  yesText: string;
  noText?: string;
}

/* -------------------- Success -------------------- */

export interface ValentineSuccessContent {
  title: string;
  line1: string;
  line2: string;
}

/* -------------------- Reject -------------------- */

export interface ValentineRejectContent {
  title: string;
  lines: string[];
}

/* -------------------- Per-Day Content -------------------- */

export interface ValentineDayContent {
  propose: ValentineProposeContent;
  success: ValentineSuccessContent;
  reject: ValentineRejectContent;
}

/* -------------------- FULL JSON MAP -------------------- */

export type ValentineContentMap = Record<
  ValentineDay,
  ValentineDayContent
>;
