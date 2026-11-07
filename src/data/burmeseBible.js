// Burmese Judson 1835 Bible metadata and USFM loader.
// Source: digitalbiblesociety/Archive-Bible-Burmese (Unlicense).
export const books = [
  {
    "code": "GEN",
    "en": "Genesis",
    "ko": "창세기",
    "chapters": 50,
    "file": "02-GENmyajvb.usfm"
  },
  {
    "code": "EXO",
    "en": "Exodus",
    "ko": "출애굽기",
    "chapters": 40,
    "file": "03-EXOmyajvb.usfm"
  },
  {
    "code": "LEV",
    "en": "Leviticus",
    "ko": "레위기",
    "chapters": 27,
    "file": "04-LEVmyajvb.usfm"
  },
  {
    "code": "NUM",
    "en": "Numbers",
    "ko": "민수기",
    "chapters": 36,
    "file": "05-NUMmyajvb.usfm"
  },
  {
    "code": "DEU",
    "en": "Deuteronomy",
    "ko": "신명기",
    "chapters": 34,
    "file": "06-DEUmyajvb.usfm"
  },
  {
    "code": "JOS",
    "en": "Joshua",
    "ko": "여호수아",
    "chapters": 24,
    "file": "07-JOSmyajvb.usfm"
  },
  {
    "code": "JDG",
    "en": "Judges",
    "ko": "사사기",
    "chapters": 21,
    "file": "08-JDGmyajvb.usfm"
  },
  {
    "code": "RUT",
    "en": "Ruth",
    "ko": "룻기",
    "chapters": 4,
    "file": "09-RUTmyajvb.usfm"
  },
  {
    "code": "1SA",
    "en": "1 Samuel",
    "ko": "사무엘상",
    "chapters": 31,
    "file": "10-1SAmyajvb.usfm"
  },
  {
    "code": "2SA",
    "en": "2 Samuel",
    "ko": "사무엘하",
    "chapters": 24,
    "file": "11-2SAmyajvb.usfm"
  },
  {
    "code": "1KI",
    "en": "1 Kings",
    "ko": "열왕기상",
    "chapters": 22,
    "file": "12-1KImyajvb.usfm"
  },
  {
    "code": "2KI",
    "en": "2 Kings",
    "ko": "열왕기하",
    "chapters": 25,
    "file": "13-2KImyajvb.usfm"
  },
  {
    "code": "1CH",
    "en": "1 Chronicles",
    "ko": "역대상",
    "chapters": 29,
    "file": "14-1CHmyajvb.usfm"
  },
  {
    "code": "2CH",
    "en": "2 Chronicles",
    "ko": "역대하",
    "chapters": 36,
    "file": "15-2CHmyajvb.usfm"
  },
  {
    "code": "EZR",
    "en": "Ezra",
    "ko": "에스라",
    "chapters": 10,
    "file": "16-EZRmyajvb.usfm"
  },
  {
    "code": "NEH",
    "en": "Nehemiah",
    "ko": "느헤미야",
    "chapters": 13,
    "file": "17-NEHmyajvb.usfm"
  },
  {
    "code": "EST",
    "en": "Esther",
    "ko": "에스더",
    "chapters": 10,
    "file": "18-ESTmyajvb.usfm"
  },
  {
    "code": "JOB",
    "en": "Job",
    "ko": "욥기",
    "chapters": 42,
    "file": "19-JOBmyajvb.usfm"
  },
  {
    "code": "PSA",
    "en": "Psalms",
    "ko": "시편",
    "chapters": 150,
    "file": "20-PSAmyajvb.usfm"
  },
  {
    "code": "PRO",
    "en": "Proverbs",
    "ko": "잠언",
    "chapters": 31,
    "file": "21-PROmyajvb.usfm"
  },
  {
    "code": "ECC",
    "en": "Ecclesiastes",
    "ko": "전도서",
    "chapters": 12,
    "file": "22-ECCmyajvb.usfm"
  },
  {
    "code": "SNG",
    "en": "Song of Solomon",
    "ko": "아가",
    "chapters": 8,
    "file": "23-SNGmyajvb.usfm"
  },
  {
    "code": "ISA",
    "en": "Isaiah",
    "ko": "이사야",
    "chapters": 66,
    "file": "24-ISAmyajvb.usfm"
  },
  {
    "code": "JER",
    "en": "Jeremiah",
    "ko": "예레미야",
    "chapters": 52,
    "file": "25-JERmyajvb.usfm"
  },
  {
    "code": "LAM",
    "en": "Lamentations",
    "ko": "예레미야애가",
    "chapters": 5,
    "file": "26-LAMmyajvb.usfm"
  },
  {
    "code": "EZK",
    "en": "Ezekiel",
    "ko": "에스겔",
    "chapters": 48,
    "file": "27-EZKmyajvb.usfm"
  },
  {
    "code": "DAN",
    "en": "Daniel",
    "ko": "다니엘",
    "chapters": 12,
    "file": "28-DANmyajvb.usfm"
  },
  {
    "code": "HOS",
    "en": "Hosea",
    "ko": "호세아",
    "chapters": 14,
    "file": "29-HOSmyajvb.usfm"
  },
  {
    "code": "JOL",
    "en": "Joel",
    "ko": "요엘",
    "chapters": 3,
    "file": "30-JOLmyajvb.usfm"
  },
  {
    "code": "AMO",
    "en": "Amos",
    "ko": "아모스",
    "chapters": 9,
    "file": "31-AMOmyajvb.usfm"
  },
  {
    "code": "OBA",
    "en": "Obadiah",
    "ko": "오바댜",
    "chapters": 1,
    "file": "32-OBAmyajvb.usfm"
  },
  {
    "code": "JON",
    "en": "Jonah",
    "ko": "요나",
    "chapters": 4,
    "file": "33-JONmyajvb.usfm"
  },
  {
    "code": "MIC",
    "en": "Micah",
    "ko": "미가",
    "chapters": 7,
    "file": "34-MICmyajvb.usfm"
  },
  {
    "code": "NAM",
    "en": "Nahum",
    "ko": "나훔",
    "chapters": 3,
    "file": "35-NAMmyajvb.usfm"
  },
  {
    "code": "HAB",
    "en": "Habakkuk",
    "ko": "하박국",
    "chapters": 3,
    "file": "36-HABmyajvb.usfm"
  },
  {
    "code": "ZEP",
    "en": "Zephaniah",
    "ko": "스바냐",
    "chapters": 3,
    "file": "37-ZEPmyajvb.usfm"
  },
  {
    "code": "HAG",
    "en": "Haggai",
    "ko": "학개",
    "chapters": 2,
    "file": "38-HAGmyajvb.usfm"
  },
  {
    "code": "ZEC",
    "en": "Zechariah",
    "ko": "스가랴",
    "chapters": 14,
    "file": "39-ZECmyajvb.usfm"
  },
  {
    "code": "MAL",
    "en": "Malachi",
    "ko": "말라기",
    "chapters": 4,
    "file": "40-MALmyajvb.usfm"
  },
  {
    "code": "MAT",
    "en": "Matthew",
    "ko": "마태복음",
    "chapters": 28,
    "file": "70-MATmyajvb.usfm"
  },
  {
    "code": "MRK",
    "en": "Mark",
    "ko": "마가복음",
    "chapters": 16,
    "file": "71-MRKmyajvb.usfm"
  },
  {
    "code": "LUK",
    "en": "Luke",
    "ko": "누가복음",
    "chapters": 24,
    "file": "72-LUKmyajvb.usfm"
  },
  {
    "code": "JHN",
    "en": "John",
    "ko": "요한복음",
    "chapters": 21,
    "file": "73-JHNmyajvb.usfm"
  },
  {
    "code": "ACT",
    "en": "Acts",
    "ko": "사도행전",
    "chapters": 28,
    "file": "74-ACTmyajvb.usfm"
  },
  {
    "code": "ROM",
    "en": "Romans",
    "ko": "로마서",
    "chapters": 16,
    "file": "75-ROMmyajvb.usfm"
  },
  {
    "code": "1CO",
    "en": "1 Corinthians",
    "ko": "고린도전서",
    "chapters": 16,
    "file": "76-1COmyajvb.usfm"
  },
  {
    "code": "2CO",
    "en": "2 Corinthians",
    "ko": "고린도후서",
    "chapters": 13,
    "file": "77-2COmyajvb.usfm"
  },
  {
    "code": "GAL",
    "en": "Galatians",
    "ko": "갈라디아서",
    "chapters": 6,
    "file": "78-GALmyajvb.usfm"
  },
  {
    "code": "EPH",
    "en": "Ephesians",
    "ko": "에베소서",
    "chapters": 6,
    "file": "79-EPHmyajvb.usfm"
  },
  {
    "code": "PHP",
    "en": "Philippians",
    "ko": "빌립보서",
    "chapters": 4,
    "file": "80-PHPmyajvb.usfm"
  },
  {
    "code": "COL",
    "en": "Colossians",
    "ko": "골로새서",
    "chapters": 4,
    "file": "81-COLmyajvb.usfm"
  },
  {
    "code": "1TH",
    "en": "1 Thessalonians",
    "ko": "데살로니가전서",
    "chapters": 5,
    "file": "82-1THmyajvb.usfm"
  },
  {
    "code": "2TH",
    "en": "2 Thessalonians",
    "ko": "데살로니가후서",
    "chapters": 3,
    "file": "83-2THmyajvb.usfm"
  },
  {
    "code": "1TI",
    "en": "1 Timothy",
    "ko": "디모데전서",
    "chapters": 6,
    "file": "84-1TImyajvb.usfm"
  },
  {
    "code": "2TI",
    "en": "2 Timothy",
    "ko": "디모데후서",
    "chapters": 4,
    "file": "85-2TImyajvb.usfm"
  },
  {
    "code": "TIT",
    "en": "Titus",
    "ko": "디도서",
    "chapters": 3,
    "file": "86-TITmyajvb.usfm"
  },
  {
    "code": "PHM",
    "en": "Philemon",
    "ko": "빌레몬서",
    "chapters": 1,
    "file": "87-PHMmyajvb.usfm"
  },
  {
    "code": "HEB",
    "en": "Hebrews",
    "ko": "히브리서",
    "chapters": 13,
    "file": "88-HEBmyajvb.usfm"
  },
  {
    "code": "JAS",
    "en": "James",
    "ko": "야고보서",
    "chapters": 5,
    "file": "89-JASmyajvb.usfm"
  },
  {
    "code": "1PE",
    "en": "1 Peter",
    "ko": "베드로전서",
    "chapters": 5,
    "file": "90-1PEmyajvb.usfm"
  },
  {
    "code": "2PE",
    "en": "2 Peter",
    "ko": "베드로후서",
    "chapters": 3,
    "file": "91-2PEmyajvb.usfm"
  },
  {
    "code": "1JN",
    "en": "1 John",
    "ko": "요한일서",
    "chapters": 5,
    "file": "92-1JNmyajvb.usfm"
  },
  {
    "code": "2JN",
    "en": "2 John",
    "ko": "요한이서",
    "chapters": 1,
    "file": "93-2JNmyajvb.usfm"
  },
  {
    "code": "3JN",
    "en": "3 John",
    "ko": "요한삼서",
    "chapters": 1,
    "file": "94-3JNmyajvb.usfm"
  },
  {
    "code": "JUD",
    "en": "Jude",
    "ko": "유다서",
    "chapters": 1,
    "file": "95-JUDmyajvb.usfm"
  },
  {
    "code": "REV",
    "en": "Revelation",
    "ko": "요한계시록",
    "chapters": 22,
    "file": "96-REVmyajvb.usfm"
  }
];

const BASE = "https://raw.githubusercontent.com/digitalbiblesociety/Archive-Bible-Burmese/master/usfm/";

function cleanUsfmText(value) {
  return value
    .replace(/\\w\s+([^|]+)\|[^\\]*?\\w\*/g, "$1")
    .replace(/\\[a-zA-Z0-9]+\*?/g, " ")
    .replace(/\|strong="[^"]*"/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function loadBurmeseBook(book) {
  const response = await fetch(BASE + book.file);
  if (!response.ok) throw new Error("Unable to load Bible book: " + book.code);
  const source = await response.text();
  const chapterMap = {};
  let currentChapter = 0;
  let burmeseName = book.en;

  for (const line of source.split(/\r?\n/)) {
    const heading = line.match(/^\\h\s+(.+)/);
    if (heading) burmeseName = cleanUsfmText(heading[1]);
    const chapterMatch = line.match(/^\\c\s+(\d+)/);
    if (chapterMatch) {
      currentChapter = Number(chapterMatch[1]);
      chapterMap[currentChapter] = [];
      continue;
    }
    const verseMatch = line.match(/^\\v\s+(\d+[a-z]?)\s+(.+)/);
    if (verseMatch && currentChapter) {
      const verseNumber = Number.parseInt(verseMatch[1], 10);
      chapterMap[currentChapter].push({ number: verseNumber, text: cleanUsfmText(verseMatch[2]) });
    }
  }

  return { bookCode: book.code, bookName: burmeseName, chapters: chapterMap };
}
