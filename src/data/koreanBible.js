// Korean Revised Version (개역개정, NKRV)
// Authorized source data is stored in seven lazy-loaded JSON partitions.
const ABBR = {
  GEN:'창',EXO:'출',LEV:'레',NUM:'민',DEU:'신',JOS:'수',JDG:'삿',RUT:'룻','1SA':'삼상','2SA':'삼하','1KI':'왕상','2KI':'왕하','1CH':'대상','2CH':'대하',EZR:'스',NEH:'느',EST:'에',JOB:'욥',PSA:'시',PRO:'잠',ECC:'전',SNG:'아',
  ISA:'사',JER:'렘',LAM:'애',EZK:'겔',DAN:'단',HOS:'호',JOL:'욜',AMO:'암',OBA:'옵',JON:'욘',MIC:'미',NAM:'나',HAB:'합',ZEP:'습',HAG:'학',ZEC:'슥',MAL:'말',
  MAT:'마',MRK:'막',LUK:'눅',JHN:'요',ACT:'행',ROM:'롬','1CO':'고전','2CO':'고후',GAL:'갈',EPH:'엡',PHP:'빌',COL:'골','1TH':'살전','2TH':'살후','1TI':'딤전','2TI':'딤후',TIT:'딛',PHM:'몬',HEB:'히',JAS:'약','1PE':'벧전','2PE':'벧후','1JN':'요일','2JN':'요이','3JN':'요삼',JUD:'유',REV:'계'
};
const PARTS = {
  GEN:[1],EXO:[1],LEV:[1],NUM:[1],DEU:[1,2],JOS:[2],JDG:[2],RUT:[2],'1SA':[2],'2SA':[2],'1KI':[2],'2KI':[2,3],
  '1CH':[3],'2CH':[3],EZR:[3],NEH:[3],EST:[3],JOB:[3],PSA:[3,4],PRO:[4],ECC:[4],SNG:[4],ISA:[4],JER:[4,5],
  LAM:[5],EZK:[5],DAN:[5],HOS:[5],JOL:[5],AMO:[5],OBA:[5],JON:[5],MIC:[5],NAM:[5],HAB:[5],ZEP:[5],HAG:[5],ZEC:[5],MAL:[5],MAT:[5],MRK:[5],LUK:[5,6],
  JHN:[6],ACT:[6],ROM:[6],'1CO':[6],'2CO':[6],GAL:[6],EPH:[6],PHP:[6],COL:[6],'1TH':[6],'2TH':[6],'1TI':[6],'2TI':[6],TIT:[6],PHM:[6],HEB:[6,7],
  JAS:[7],'1PE':[7],'2PE':[7],'1JN':[7],'2JN':[7],'3JN':[7],JUD:[7],REV:[7]
};
const cache = new Map();
async function loadPart(n) {
  if (!cache.has(n)) cache.set(n, fetch(`/bible/ko/part-${n}.json`).then(r => {
    if (!r.ok) throw new Error('개역개정 데이터 파일을 불러오지 못했습니다.');
    return r.json();
  }).catch(e => { cache.delete(n); throw e; }));
  return cache.get(n);
}
export async function loadKoreanBook(book) {
  const abbreviation = ABBR[book.code];
  if (!abbreviation) throw new Error('지원하지 않는 성경입니다: ' + book.code);
  const partitions = await Promise.all((PARTS[book.code] || []).map(loadPart));
  const allVerses = Object.assign({}, ...partitions);
  const chapters = {};
  for (const [reference, rawText] of Object.entries(allVerses)) {
    const match = reference.match(/^(.+?)(\d+):(\d+(?:-\d+)?)$/);
    if (!match || match[1] !== abbreviation) continue;
    const chapter = Number(match[2]);
    const numberText = match[3];
    if (!chapters[chapter]) chapters[chapter] = [];
    chapters[chapter].push({ number: numberText.includes('-') ? numberText : Number(numberText), text: String(rawText) });
  }
  for (const list of Object.values(chapters)) list.sort((a,b) => Number(String(a.number).split('-')[0]) - Number(String(b.number).split('-')[0]));
  return { bookCode: book.code, bookName: book.ko || book.en, chapters };
}
