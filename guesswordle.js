const BASE_URL = "https://wordle.votee.dev:8000/random";

const WORD_SIZE = 5;
const MAX_ATTEMPTS = 5;
const SEED = 1;

const WORDS = [
  "apple", "grape", "table",
  "chair", "water", "stone",
  "house", "light", "plane",
  "crane", "slate", "trace",
  "roast", "shine", "bring",
  "flame", "crown", "sword",
  "smile", "clock", "touch",
];

async function getFeedback(guess) {
  const url = new URL(BASE_URL);

  url.searchParams.append("guess", guess);
  url.searchParams.append("size", WORD_SIZE);
  url.searchParams.append("seed", SEED);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return await response.json();
}

function isValidWord(word, feedback) {
  for (const item of feedback) {
    const index = item.slot;
    const letter = item.guess;
    const result = item.result;

    if (result === "correct") {
      if (word[index] !== letter) {
        return false;
      }
    }

    else if (result === "present") {
      if (!word.includes(letter)) {
        return false;
      }

      if (word[index] === letter) {
        return false;
      }
    }

    else if (result === "absent") {
      if (word.includes(letter)) {
        return false;
      }
    }
  }

  return true;
}

function filterWords(words, feedback) {
  return words.filter(word =>
    isValidWord(word, feedback)
  );
}

async function solve() {
  let possibleWords = [...WORDS];
  
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {

  const guess = possibleWords[Math.floor(Math.random() * possibleWords.length)];

    console.log(`\nAttempt ${attempt}/${MAX_ATTEMPTS}`);
    console.log(`Guess: ${guess}`);

    const feedback = await getFeedback(guess);

    console.log("Feedback:", feedback);

    const solved = feedback.every(
      item => item.result === "correct"
    );

    if (solved) {
      console.log(`\nSolved in ${attempt} attempts!`);
      console.log(`Answer: ${guess}`);
      return;
    }

    possibleWords = possibleWords
      .filter(word => word !== guess)
      .filter(word => isValidWord(word, feedback));
  }

  console.log(`\nPassed ${MAX_ATTEMPTS} attempts!`);
}

solve().catch(console.error);
