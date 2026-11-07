import { useEffect, useMemo, useState } from 'react'
import { books, loadBurmeseBook } from './data/burmeseBible'
import { BookOpen, Bookmark, Headphones, Home, Search, Highlighter, NotebookPen, Share2, ChevronDown, ChevronLeft, ChevronRight, Type, Sun, Moon, X, Check, CalendarDays, Sparkles, Languages, Columns2 } from 'lucide-react'

const sampleVerses = [
  'အစအဦး၌ ဘုရားသခင်သည် ကောင်းကင်နှင့် မြေကြီးကို ဖန်ဆင်းတော်မူ၏။',
  'မြေကြီးသည် အဆင်းသဏ္ဌာန်မရှိ၊ လွတ်လပ်လဟာဖြစ်၏။ နက်နဲရာအရပ်ကို မှောင်မိုက်ဖုံးလွှမ်းလျက်ရှိ၏။',
  'ဘုရားသခင်၏ ဝိညာဉ်တော်သည် ရေမျက်နှာပြင်ပေါ်မှာ လှုပ်ရှားတော်မူ၏။',
  'ဘုရားသခင်က အလင်းဖြစ်စေဟု မိန့်တော်မူ၍ အလင်းဖြစ်လေ၏။',
  'ဘုရားသခင်သည် အလင်းကောင်းသည်ကို မြင်တော်မူ၍ အလင်းနှင့် မှောင်မိုက်ကို ပိုင်းခြားတော်မူ၏။'
]
const koSampleVerses = [
  '태초에 하나님이 하늘과 땅을 창조하셨습니다.',
  '땅은 아직 형태가 없고 비어 있었으며, 깊은 어둠이 덮여 있었습니다.',
  '하나님의 영은 물 위에 움직이고 계셨습니다.',
  '하나님이 말씀하시기를 “빛이 있으라” 하시니 빛이 생겼습니다.',
  '하나님은 빛이 좋은 것을 보시고 빛과 어둠을 나누셨습니다.'
]
const copy = {
  my: { brand:'သမ္မာကျမ်းစာ', tagline:'နေ့စဉ် နှုတ်ကပတ်တော်', search:'ရှာဖွေရန်', readEyebrow:'သမ္မာကျမ်းစာ ဖတ်ရှုရန်', readTitle:'ကျမ်းစာဖတ်ရန်', font:'စာလုံး', chapter:'အခန်း', sample:'နမူနာစာသား', notice:'ဤစာသားများသည် UI စမ်းသပ်ရန်အတွက်သာ ဖြစ်သည်။ တရားဝင်ကျမ်းစာမူကို ခွင့်ပြုချက်ရရှိပြီးမှ ထည့်သွင်းပါမည်။', save:'သိမ်းရန်', highlight:'အရောင်ခြယ်', note:'မှတ်စု', share:'မျှဝေရန်', today:'ယနေ့ ဖတ်ရှုမှု', minutes:'၅ / ၂၀ မိနစ်', searchTitle:'ကျမ်းစာရှာဖွေမှု', searchPlaceholder:'ကျမ်းစာအုပ် ရှာရန်...', library:'သင့်စာကြည့်တိုက်', soon:'မကြာမီ ရရှိနိုင်ပါမည်', soonText:'ဤအပိုင်းကို နောက်အဆင့်တွင် ဆက်လက်တည်ဆောက်ပါမည်။', choose:'ကျမ်းစာအုပ် ရွေးချယ်ရန်', personalNote:'ကိုယ်ပိုင်မှတ်စု', writeNote:'သင့်ရဲ့ အတွေးအမြင်ကို ရေးသားပါ...', keep:'သိမ်းဆည်းရန်', tabs:['ပင်မ','ကျမ်းစာ','အစီအစဉ်','အသံ','သိမ်းဆည်း'] },
  ko: { brand:'미얀마 성경', tagline:'매일 만나는 하나님의 말씀', search:'검색', readEyebrow:'말씀 읽기', readTitle:'성경 읽기', font:'글자 크기', chapter:'장', sample:'샘플 본문', notice:'이 문구는 화면 테스트용 샘플입니다. 정식 성경 본문은 사용 허가를 받은 후 반영합니다.', save:'북마크', highlight:'하이라이트', note:'메모', share:'공유', today:'오늘의 읽기', minutes:'5 / 20분', searchTitle:'성경 검색', searchPlaceholder:'성경 이름 검색...', library:'내 성경 보관함', soon:'곧 제공됩니다', soonText:'이 기능은 다음 개발 단계에서 추가할 예정입니다.', choose:'성경 선택', personalNote:'나의 묵상 메모', writeNote:'말씀을 읽으며 떠오른 생각을 적어보세요...', keep:'저장하기', tabs:['홈','성경','읽기 계획','오디오','저장'] }
}
const navIcons = [Home, BookOpen, CalendarDays, Headphones, Bookmark]
export default function App() {
  const [lang,setLang]=useState(()=>localStorage.getItem('bible-language') || 'my')
  const [burmeseBook,setBurmeseBook]=useState(null)
  const [secondaryBurmeseBook,setSecondaryBurmeseBook]=useState(null)
  const [bibleLoading,setBibleLoading]=useState(false)
  const [bibleError,setBibleError]=useState('')
  const [compare,setCompare]=useState(()=>localStorage.getItem('bible-compare') === 'true')
  const [primaryVersion,setPrimaryVersion]=useState(()=>localStorage.getItem('bible-primary-version') || 'my')
  const [secondaryVersion,setSecondaryVersion]=useState(()=>localStorage.getItem('bible-secondary-version') || 'ko')
  const t=copy[lang]
  const [tab,setTab]=useState('read'), [book,setBook]=useState(books[0]), [chapter,setChapter]=useState(1), [fontSize,setFontSize]=useState(21), [dark,setDark]=useState(false), [marked,setMarked]=useState([2]), [saved,setSaved]=useState(false), [note,setNote]=useState(''), [showNote,setShowNote]=useState(false), [showBooks,setShowBooks]=useState(false), [search,setSearch]=useState('')
  const versionNames={my:lang==='ko'?'미얀마어 성경 (샘플)':'မြန်မာကျမ်းစာ (နမူနာ)',ko:lang==='ko'?'한국어 성경 (샘플)':'ကိုရီးယားကျမ်းစာ (နမူနာ)'}
  useEffect(()=>{let active=true;setBibleLoading(primaryVersion==='my');setBibleError('');if(primaryVersion==='my'){loadBurmeseBook(book).then(data=>{if(active)setBurmeseBook(data)}).catch(()=>{if(active)setBibleError(lang==='ko'?'본문을 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.':'ကျမ်းစာကို ဖွင့်၍မရပါ။ အင်တာနက်ကို စစ်ဆေးပါ။')}).finally(()=>{if(active)setBibleLoading(false)})}return()=>{active=false}},[book,primaryVersion,lang])
  useEffect(()=>{let active=true;if(compare&&secondaryVersion==='my'){loadBurmeseBook(book).then(data=>{if(active)setSecondaryBurmeseBook(data)}).catch(()=>{});}return()=>{active=false}},[book,secondaryVersion,compare])
  const bookTitle=primaryVersion==='ko'?book.ko:(burmeseBook?.bookName||book.en)
  const chapterVerses=burmeseBook?.chapters?.[chapter]||[]
  const verses=primaryVersion==='ko'?koSampleVerses:chapterVerses.map(v=>v.text)
  const secondaryChapterVerses=secondaryBurmeseBook?.chapters?.[chapter]||[]
  const secondaryVerses=secondaryVersion==='ko'?koSampleVerses:secondaryChapterVerses.map(v=>v.text)
  const setVersion=(which,value)=>{if(which==='primary'){setPrimaryVersion(value);localStorage.setItem('bible-primary-version',value)}else{setSecondaryVersion(value);localStorage.setItem('bible-secondary-version',value)}}
  const toggleCompare=()=>{setCompare(v=>{localStorage.setItem('bible-compare',String(!v));return !v})}
  const toggleMark=(n)=>setMarked(v=>v.includes(n)?v.filter(x=>x!==n):[...v,n])
  const filtered=useMemo(()=>books.filter(b=>(b.name+b.ko+b.en).toLowerCase().includes(search.toLowerCase())),[search])
  const changeLang=(value)=>{setLang(value);localStorage.setItem('bible-language',value)}
  const tabIds=['home','read','plans','audio','saved']
  return <main className={dark?'app dark':'app'} lang={lang==='ko'?'ko':'my'}>
    <header className="topbar"><div className="brand"><div className="brand-mark"><BookOpen size={19}/></div><div><strong>{t.brand}</strong><small>{t.tagline}</small></div></div><div className="top-actions"><button className="icon-btn" onClick={()=>setTab('search')} aria-label={t.search}><Search/></button><button className="icon-btn" onClick={()=>changeLang(lang==='my'?'ko':'my')} aria-label="Language"><Languages/></button><button className="icon-btn" onClick={()=>setDark(!dark)} aria-label="Toggle theme">{dark?<Sun/>:<Moon/>}</button></div></header>
    {tab==='read' ? <section className="reader">
      <div className="reader-heading"><div><span className="eyebrow">{t.readEyebrow}</span><h1>{t.readTitle}</h1></div><div className="reader-actions"><button className={compare?'soft-btn compare-on':'soft-btn'} onClick={toggleCompare}><Columns2 size={16}/> {compare?(lang==='ko'?'함께 보기 중':'နှစ်ဘာသာ'): (lang==='ko'?'두 성경 함께 보기':'ဘာသာနှစ်မျိုး')}</button><button className="soft-btn" onClick={()=>setFontSize(v=>v>=27?17:v+2)}><Type size={17}/> {t.font}</button></div></div>
      <div className="version-selectors"><label className="version-picker"><span>{lang==='ko'?'첫 번째 번역본':'ပထမဘာသာပြန်'}</span><select value={primaryVersion} onChange={e=>setVersion('primary',e.target.value)}><option value="my">{versionNames.my}</option><option value="ko">{versionNames.ko}</option></select></label>{compare&&<label className="version-picker"><span>{lang==='ko'?'두 번째 번역본':'ဒုတိယဘာသာပြန်'}</span><select value={secondaryVersion} onChange={e=>setVersion('secondary',e.target.value)}><option value="my">{versionNames.my}</option><option value="ko">{versionNames.ko}</option></select></label>}</div><div className="selector-row"><button className="select-pill book-select" onClick={()=>setShowBooks(true)}>{bookTitle}<ChevronDown size={16}/></button><button className="select-pill" onClick={()=>setChapter(c=>Math.max(1,c-1))}><ChevronLeft size={15}/></button><span className="chapter-label">{chapter} <small>{t.chapter}</small></span><button className="select-pill" onClick={()=>setChapter(c=>Math.min(book.chapters,c+1))}><ChevronRight size={15}/></button></div>
      <div className="scripture-card"><div className="scripture-meta"><span>{bookTitle} · {chapter}</span><span className="version-tag">{versionNames[primaryVersion]}</span></div>{(bibleLoading?[]:verses).map((v,i)=><div key={i} className={`${marked.includes(i+1)?'verse highlighted':'verse'} ${compare?'verse-comparison':''}`} onClick={()=>toggleMark(i+1)}><span className="verse-num">{i+1}</span><div className="verse-texts"><p className={compare?'verse-primary':''} style={{fontSize}}>{v}</p>{compare&&<p className="verse-secondary" style={{fontSize:Math.max(15,fontSize-1)}}>{secondaryVerses[i]}</p>}</div>{marked.includes(i+1)&&<Bookmark size={15} className="verse-bookmark"/>}</div>)}{bibleLoading&&<div className="sample-notice">{lang==='ko'?'미얀마어 성경을 불러오는 중입니다…':'ကျမ်းစာကို ဖွင့်နေသည်…'}</div>}{bibleError&&<div className="sample-notice">{bibleError}</div>}{primaryVersion==='ko'&&<div className="sample-notice">{t.notice}</div>}</div>
      <div className="tools-row"><button onClick={()=>setSaved(!saved)} className={saved?'tool active':'tool'}><Bookmark/><span>{t.save}</span></button><button onClick={()=>toggleMark(1)} className="tool"><Highlighter/><span>{t.highlight}</span></button><button onClick={()=>setShowNote(true)} className="tool"><NotebookPen/><span>{t.note}</span></button><button onClick={()=>navigator.clipboard?.writeText(verses[0])} className="tool"><Share2/><span>{t.share}</span></button></div>
      <div className="reading-progress"><div><span>{t.today}</span><strong>{t.minutes}</strong></div><div className="progress"><i/></div></div>
    </section> : tab==='search' ? <section className="reader"><div className="reader-heading"><div><span className="eyebrow">{t.search}</span><h1>{t.searchTitle}</h1></div></div><input className="search-input" placeholder={t.searchPlaceholder} value={search} onChange={e=>setSearch(e.target.value)}/>{filtered.map(b=><button className="book-result" key={b.en} onClick={()=>{setBook(b);setChapter(1);setTab('read')}}><BookOpen/><span>{lang==='ko'?b.ko:b.en}<small>{b.en} · {b.chapters} {t.chapter}</small></span><ChevronRight/></button>)}</section> : <section className="reader"><div className="reader-heading"><div><span className="eyebrow">{t.library}</span><h1>{t.tabs[tabIds.indexOf(tab)]}</h1></div></div><div className="empty-state"><div className="empty-icon"><Sparkles/></div><h2>{t.soon}</h2><p>{t.soonText}</p></div></section>}
    <nav className="bottom-nav">{tabIds.map((id,i)=>{const Icon=navIcons[i];return <button key={id} className={tab===id?'nav-item selected':'nav-item'} onClick={()=>setTab(id)}><Icon size={20}/><span>{t.tabs[i]}</span></button>})}</nav>
    {showBooks&&<div className="overlay" onClick={()=>setShowBooks(false)}><div className="sheet" onClick={e=>e.stopPropagation()}><div className="sheet-head"><h2>{t.choose}</h2><button className="icon-btn" onClick={()=>setShowBooks(false)}><X/></button></div>{books.map(b=><button className="book-result" key={b.en} onClick={()=>{setBook(b);setChapter(1);setShowBooks(false)}}><BookOpen/><span>{lang==='ko'?b.ko:b.en}<small>{b.en}</small></span><ChevronRight/></button>)}</div></div>}
    {showNote&&<div className="overlay" onClick={()=>setShowNote(false)}><div className="sheet note-sheet" onClick={e=>e.stopPropagation()}><div className="sheet-head"><h2>{t.personalNote}</h2><button className="icon-btn" onClick={()=>setShowNote(false)}><X/></button></div><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={t.writeNote}/><button className="primary-btn" onClick={()=>setShowNote(false)}><Check size={17}/> {t.keep}</button></div></div>}
  </main>
}
