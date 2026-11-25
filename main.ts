// SPDX-License-Identifier: MIT
// The Tired Dark Lord: A 100-Word Villain Monologue
// make.fun entry: u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb
//
// A program that writes one monologue to /output/entry.txt. The monologue is
// spoken by Malachar, a dark lord three centuries into his reign: he has a
// scheme (the eclipse), a history (the Ember Fleet, the bound tide), and a
// body that keeps filing complaints mid-threat. His tiredness never gets
// announced — it leaks out in lost counts, bad knees, moth holes, and a
// calendar appointment for his own assassination.
//
// Deterministic: no clock, no randomness, no network, no input. The same
// bytes come out on every run, in any sandbox.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The monologue, one spoken beat per line. Joined with single spaces;
// the file holds exactly these words and nothing else.
const LINES: readonly string[] = [
  "You climbed the nine hundred steps. Good.",
  "I counted them once, then lost count by the landing.",
  "Sit. Or stand, if you prefer.",
  "Everyone stands, until the knees go.",
  "I am Malachar, who drowned the Ember Fleet and bound the tide to my will.",
  "Yes, the banners. Very dramatic.",
  "The seamstress still hasn't fixed the moth holes.",
  "You came to end me. I know.",
  "It's scheduled: Thursday, after the eclipse, before supper.",
  "Bring a sharper sword; the last hero's bent on my collarbone.",
  "Do try to be on time.",
  "I have a kingdom to ruin and a nap to take.",
];

// The brief asks for a monologue of about 100 words. We ship exactly 100.
const EXPECTED_WORDS = 100;

// The sealed gate accepts UTF-8 text of 1 to 600 characters.
const MAX_CHARS = 600;

// Where the graded text goes. The grader's sandbox provides /output;
// MAKEFUN_OUTPUT exists only so the entry can be run and checked locally
// without root-owned paths.
const OUTPUT_PATH =
  process.env.MAKEFUN_OUTPUT ?? "/output/entry.txt";

// The brief's second rule: the tiredness must be felt, never announced.
// The program refuses to ship a monologue that states it outright.
const FORBIDDEN_ANNOUNCEMENTS: readonly string[] = [
  "tired",
  "weary",
  "weariness",
  "exhausted",
  "fatigued",
  "sleepy",
  "sleepless",
];

/** Count words the way a reader would: whitespace-separated tokens. */
function countWords(text: string): number {
  const tokens = text.split(/\s+/).filter((token) => token.length > 0);
  return tokens.length;
}

/** A spoken monologue lands one beat at a time; report the shape of it. */
function reportBeats(): void {
  let running = 0;
  for (const line of LINES) {
    running += countWords(line);
    console.log(`  beat ${String(running).padStart(3, " ")} words: ${line}`);
  }
}

/** Render the monologue as a single paragraph of plain text. */
function renderMonologue(): string {
  return LINES.join(" ");
}

function main(): void {
  const text = renderMonologue();
  const words = countWords(text);
  const chars = [...text].length;

  if (words !== EXPECTED_WORDS) {
    throw new Error(
      `monologue must be exactly ${EXPECTED_WORDS} words, got ${words}`,
    );
  }
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(
      `monologue must be 1-${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("monologue must not be only whitespace");
  }
  const lowered = text.toLowerCase();
  for (const word of FORBIDDEN_ANNOUNCEMENTS) {
    if (lowered.includes(word)) {
      throw new Error(
        `monologue must show tiredness, not announce it: found "${word}"`,
      );
    }
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, text, "utf8");

  console.log(`wrote ${OUTPUT_PATH}`);
  console.log(`words: ${words}`);
  console.log(`characters: ${chars}`);
  reportBeats();
}

main();
