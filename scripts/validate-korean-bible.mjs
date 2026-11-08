import { readFile } from 'node:fs/promises';
import { books } from '../src/data/burmeseBible.js';
import { loadKoreanBook } from '../src/data/koreanBible.js';

globalThis.fetch = async (url) => {
  const path = new URL(`../public${url}`, import.meta.url);
  const data = JSON.parse(await readFile(path, 'utf8'));
  return { ok: true, json: async () => data };
};

let totalRecords = 0;
const failures = [];

for (const book of books) {
  try {
    const result = await loadKoreanBook(book);
    const chapterNumbers = Object.keys(result.chapters).map(Number).sort((a, b) => a - b);
    if (chapterNumbers.length !== book.chapters) {
      failures.push(`${book.code}: expected ${book.chapters} chapters, found ${chapterNumbers.length}`);
    }
    for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
      const verses = result.chapters[chapter];
      if (!verses?.length) {
        failures.push(`${book.code} ${chapter}: missing chapter`);
        continue;
      }
      let previous = 0;
      for (const verse of verses) {
        const start = Number(String(verse.number).split('-')[0]);
        if (!Number.isInteger(start) || start <= previous || !verse.text.trim()) {
          failures.push(`${book.code} ${chapter}:${verse.number}: invalid order or empty text`);
        }
        previous = start;
        totalRecords += 1;
      }
    }
  } catch (error) {
    failures.push(`${book.code}: ${error.message}`);
  }
}

if (failures.length) {
  console.error('Korean Bible validation failed:');
  for (const failure of failures) console.error(' - ' + failure);
  process.exit(1);
}

console.log(`Korean Bible validation passed: ${books.length} books, all chapter counts complete, ${totalRecords} verse records checked.`);
