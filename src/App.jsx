import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { books, loadBurmeseBook, loadKJVBook, loadNIVBook } from './data/burmeseBible'
import { getSavedBibleCodes } from './data/offlineBible'
import { loadKoreanBook } from './data/koreanBible'
import { BookOpen, Bookmark, Headphones, Home, Search, Highlighter, NotebookPen, Share2, ChevronDown, ChevronLeft, ChevronRight, Type, Sun, Moon, X, Check, CalendarDays, Sparkles, Languages, Columns2, Copy } from 'lucide-react'

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
  my: { brand:'သမ္မာကျမ်းစာ', tagline:'နေ့စဉ် နှုတ်ကပတ်တော်', search:'ရှာဖွေရန်', readEyebrow:'သမ္မာကျမ်းစာ ဖတ်ရှုရန်', readTitle:'ကျမ်းစာဖတ်ရန်', font:'စာလုံး', chapter:'အခန်း', sample:'နမူနာစာသား', notice:'ဤစာသားများသည် UI စမ်းသပ်ရန်အတွက်သာ ဖြစ်သည်။ တရားဝင်ကျမ်းစာမူကို ခွင့်ပြုချက်ရရှိပြီးမှ ထည့်သွင်းပါမည်။', save:'သိမ်းရန်', highlight:'အရောင်ခြယ်', note:'မှတ်စု', share:'မျှဝေရန်', today:'ယနေ့ ဖတ်ရှုမှု', minutes:'၅ / ၂၀ မိနစ်', searchTitle:'ကျမ်းစာရှာဖွေမှု', searchPlaceholder:'စကားလုံး သို့မဟုတ် စာပိုဒ် ရှာရန်...', library:'သင့်စာကြည့်တိုက်', soon:'မကြာမီ ရရှိနိုင်ပါမည်', soonText:'ဤအပိုင်းကို နောက်အဆင့်တွင် ဆက်လက်တည်ဆောက်ပါမည်။', choose:'ကျမ်းစာအုပ် ရွေးချယ်ရန်', personalNote:'ကိုယ်ပိုင်မှတ်စု', writeNote:'သင့်ရဲ့ အတွေးအမြင်ကို ရေးသားပါ...', keep:'သိမ်းဆည်းရန်', tabs:['ကျမ်းစာ','မှတ်စုများ','သိမ်းဆည်း','မှတ်တမ်း'] },
  ko: { brand:'미얀마 성경', tagline:'매일 만나는 하나님의 말씀', search:'검색', readEyebrow:'말씀 읽기', readTitle:'성경 읽기', font:'글자 크기', chapter:'장', sample:'샘플 본문', notice:'이 문구는 화면 테스트용 샘플입니다. 정식 성경 본문은 사용 허가를 받은 후 반영합니다.', save:'북마크', highlight:'하이라이트', note:'메모', share:'공유', today:'오늘의 읽기', minutes:'5 / 20분', searchTitle:'성경 검색', searchPlaceholder:'성경 본문 단어 또는 문구 검색...', library:'내 성경 보관함', soon:'곧 제공됩니다', soonText:'이 기능은 다음 개발 단계에서 추가할 예정입니다.', choose:'성경 선택', personalNote:'나의 묵상 메모', writeNote:'말씀을 읽으며 떠오른 생각을 적어보세요...', keep:'저장하기', tabs:['성경','메모 모음','북마크','히스토리'] }
}
const burmeseBookNames={GEN:'ကမ္ဘာဦး',EXO:'ထွက်မြောက်ရာ',LEV:'ဝတ်ပြုရာ',NUM:'တောလည်ရာ',DEU:'တရားဟောရာ',JOS:'ယောရှု',JDG:'တရားသူကြီး',RUT:'ရုသ', '1SA':'ဓမ္မရာဇဝင် ပထမ', '2SA':'ဓမ္မရာဇဝင် ဒုတိယ','1KI':'ဓမ္မရာဇဝင် တတိယ','2KI':'ဓမ္မရာဇဝင် စတုတ္ထ','1CH':'ရာဇဝင်ချုပ် ပထမ','2CH':'ရာဇဝင်ချုပ် ဒုတိယ',EZR:'ဧဇရ',NEH:'နေဟမိ',EST:'ဧသတာ',JOB:'ယောဘ',PSA:'ဆာလံ',PRO:'သုတ္တံ',ECC:'ဒေသနာ',SNG:'ရှောလမုန်သီချင်း',ISA:'ဟေရှာယ',JER:'ယေရမိ',LAM:'မြည်တမ်းစကား',EZK:'ယေဇကျေလ',DAN:'ဒံယေလ',HOS:'ဟောရှေ',JOL:'ယောလ',AMO:'အာမုတ်',OBA:'ဩဗဒိ',JON:'ယောန',MIC:'မိက္ခာ',NAM:'နာဟုံ',HAB:'ဟဗက္ကု',ZEP:'ဇေဖနိ',HAG:'ဟဂ္ဂဲ',ZEC:'ဇာခရိ',MAL:'မာလခိ',MAT:'မဿဲ',MRK:'မာကု',LUK:'လုကာ',JHN:'ယောဟန်',ACT:'တမန်တော်',ROM:'ရောမ', '1CO':'ကောရိန္သု ပထမ','2CO':'ကောရိန္သု ဒုတိယ',GAL:'ဂလာတိ',EPH:'ဧဖက်',PHP:'ဖိလိပ္ပိ',COL:'ကောလောသဲ', '1TH':'သက်သာလောနိတ် ပထမ','2TH':'သက်သာလောနိတ် ဒုတိယ','1TI':'တိမောသေ ပထမ','2TI':'တိမောသေ ဒုတိယ',TIT:'တိတု',PHM:'ဖိလေမုန်',HEB:'ဟေဗြဲ',JAS:'ယာကုပ်','1PE':'ပေတရု ပထမ','2PE':'ပေတရု ဒုတိယ','1JN':'ယောဟန် ပထမ','2JN':'ယောဟန် ဒုတိယ','3JN':'ယောဟန် တတိယ',JUD:'ယုဒ',REV:'ဗျာဒိတ်'}
const navIcons = [BookOpen, NotebookPen, Bookmark, CalendarDays]
const strongsBase='https://raw.githubusercontent.com/GabeBrPierce/bible-interlinear/master/'
const strongsCacheName='kyanza-original-language-v1'
async function getOriginalJson(path,valid){
  const url=strongsBase+path
  let cache
  try{
    if('caches' in window){
      cache=await caches.open(strongsCacheName)
      const cached=await cache.match(url)
      if(cached){const data=await cached.json();if(valid(data))return data}
    }
  }catch{}
  const controller=new AbortController()
  const timeout=setTimeout(()=>controller.abort(),18000)
  try{
    const response=await fetch(url,{signal:controller.signal})
    if(!response.ok)throw new Error('Original-language data unavailable')
    const copy=response.clone(),data=await response.json()
    if(!valid(data))throw new Error('Invalid original-language data')
    try{await cache?.put(url,copy)}catch{}
    return data
  }finally{clearTimeout(timeout)}
}
const strongsCodes=value=>[...new Set(String(value||'').match(/[HG]\d{1,5}[A-Z]?/g)||[])]
const baseStrongCode=value=>value.replace(/^([HG])0+(?=\d)/,'$1')
function OriginalLanguageDialog({target,lang,onClose}){
  const ko=lang==='ko'
  const [verse,setVerse]=useState(target.verses[0])
  const [data,setData]=useState(null)
  const [status,setStatus]=useState('loading')
  const [attempt,setAttempt]=useState(0)
  const [code,setCode]=useState('')
  const [entry,setEntry]=useState(null)
  const [entryStatus,setEntryStatus]=useState('')
  const [entryAttempt,setEntryAttempt]=useState(0)
  useEffect(()=>{
    let active=true
    setData(null);setStatus('loading');setCode('');setEntry(null);setEntryStatus('')
    getOriginalJson(target.code+'/'+target.chapter+'/'+verse+'.json',d=>d?.book===target.code&&Number(d.chapter)===target.chapter&&Number(d.verse)===verse&&Array.isArray(d.words)&&d.words.length>0)
      .then(d=>{if(active){setData(d);setStatus('ready')}})
      .catch(()=>{if(active)setStatus('error')})
    return()=>{active=false}
  },[target.code,target.chapter,verse,attempt])
  useEffect(()=>{
    if(!code)return
    let active=true
    setEntry(null);setEntryStatus('loading')
    getOriginalJson('lexicon/'+code+'.json',d=>d?.strongs===code&&typeof d.word==='string')
      .then(d=>{if(active){setEntry(d);setEntryStatus('ready')}})
      .catch(()=>{if(active)setEntryStatus('error')})
    return()=>{active=false}
  },[code,entryAttempt])
  const buttonStyle={border:'1px solid var(--line)',borderRadius:9,background:'var(--surface2)',color:'var(--text)',font:'inherit',padding:'9px 12px',cursor:'pointer'}
  return <div role="presentation" onClick={onClose} style={{position:'fixed',inset:0,zIndex:115,background:'rgba(20,24,30,.58)',display:'flex',alignItems:'center',justifyContent:'center',padding:12}}>
    <div role="dialog" aria-modal="true" aria-label={ko?'원어 분석':'မူရင်းကျမ်းစာ လေ့လာရန်'} onClick={e=>e.stopPropagation()} style={{width:'min(100%,540px)',maxHeight:'88dvh',overflowY:'auto',background:'var(--surface)',color:'var(--text)',borderRadius:18,padding:16,display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}><strong>{ko?'원어 분석':'မူရင်းကျမ်းစာ လေ့လာရန်'} · {target.name} {target.chapter}:{verse}</strong><button type="button" onClick={onClose} aria-label={ko?'닫기':'ပိတ်ရန်'} style={{...buttonStyle,padding:5}}><X size={20}/></button></div>
      {target.verses.length>1&&<label className="version-picker"><span>{ko?'분석할 절':'လေ့လာမည့် ကျမ်းပိုဒ်'}</span><select value={verse} onChange={e=>{setData(null);setCode('');setEntry(null);setVerse(Number(e.target.value))}}>{target.verses.map(v=><option key={v} value={v}>{v} {ko?'절':'ပိုဒ်'}</option>)}</select></label>}
      <p style={{fontSize:12,lineHeight:1.65,margin:0,color:'var(--muted)'}}>{ko?'번역본과 별도로 원문 단어를 표시합니다. 스트롱 코드를 누르면 사전이 열립니다. 원문과 번역본의 절 번호는 일부 다를 수 있습니다.':'ဘာသာပြန်ကျမ်းစာနှင့် သီးခြား မူရင်းစကားလုံးများကို ပြထားပါသည်။ Strong နံပါတ်ကို နှိပ်၍ အဘိဓာန်ကို ကြည့်ပါ။ အချို့ ကျမ်းပိုဒ်နံပါတ်များ ကွာခြားနိုင်ပါသည်။'}</p>
      {status==='loading'&&<p role="status">{ko?'원어 데이터를 불러오는 중…':'မူရင်းကျမ်းစာ ဖွင့်နေသည်…'}</p>}
      {status==='error'&&<div className="sample-notice"><p>{ko?'원어 자료를 불러오지 못했습니다. 인터넷 연결 또는 원문 자료의 제공 여부를 확인해 주세요.':'မူရင်းကျမ်းစာ ဖွင့်၍မရပါ။ အင်တာနက်နှင့် အချက်အလက်ကို စစ်ဆေးပါ။'}</p><button type="button" style={buttonStyle} onClick={()=>setAttempt(n=>n+1)}>{ko?'다시 시도':'ထပ်မံကြိုးစားရန်'}</button></div>}
      {entryStatus&&<div style={{border:'1px solid var(--line)',borderRadius:12,background:'var(--bg)',padding:12,display:'grid',gap:8}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><strong>{ko?'스트롱 사전':'Strong အဘိဓာန်'} · {baseStrongCode(code)}</strong><button type="button" aria-label={ko?'사전 닫기':'အဘိဓာန် ပိတ်ရန်'} onClick={()=>{setCode('');setEntry(null);setEntryStatus('')}} style={{...buttonStyle,padding:4}}><X size={16}/></button></div>
        {entryStatus==='loading'&&<span role="status">{ko?'사전 불러오는 중…':'အဘိဓာန် ဖွင့်နေသည်…'}</span>}
        {entryStatus==='error'&&<><p style={{margin:0,fontSize:13}}>{ko?'이 코드의 사전 자료를 불러오지 못했습니다.':'ဤနံပါတ်အတွက် အဘိဓာန် အချက်အလက် မရပါ။'}</p><button type="button" style={buttonStyle} onClick={()=>setEntryAttempt(n=>n+1)}>{ko?'다시 시도':'ထပ်မံကြိုးစားရန်'}</button></>}
        {entry&&<><strong dir="auto" style={{fontSize:22}}>{entry.word}</strong><span>{entry.translit}</span><span style={{fontSize:12,color:'var(--muted)'}}>{entry.morph}</span><strong>{entry.gloss}</strong><small style={{color:'var(--muted)'}}>{ko?'영어 원문 사전 정의':'အင်္ဂလိပ် အဘိဓာန် အဓိပ္ပာယ်'}</small><div style={{fontSize:13,whiteSpace:'pre-wrap',overflowWrap:'anywhere',lineHeight:1.65}}>{entry.definition}</div></>}
      </div>}
      {data&&<div style={{display:'grid',gap:7}}>{data.words.map((word,i)=><div key={i} style={{border:'1px solid var(--line)',borderRadius:10,padding:11,display:'grid',gap:5}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,flexWrap:'wrap'}}><strong dir="auto" style={{fontSize:20}}>{word.original}</strong><div style={{display:'flex',gap:5,flexWrap:'wrap'}}>{strongsCodes(word.strongs).map(id=><button key={id} type="button" onClick={()=>{setCode(id);setEntry(null);setEntryStatus('loading');setEntryAttempt(n=>n+1)}} style={{...buttonStyle,padding:'5px 8px',fontSize:12,color:'#377ac5',fontWeight:700}}>{baseStrongCode(id)}</button>)}</div></div>
        <span style={{fontSize:13,color:'var(--muted)'}}>{word.translit}</span><span style={{fontSize:14}}>{word.gloss}</span><small style={{fontSize:11,color:'var(--muted)'}}>{ko?'문법':'သဒ္ဒါ'}: {word.morph}</small>
      </div>)}</div>}
      <p style={{fontSize:11,color:'var(--muted)',lineHeight:1.6,margin:0}}>Source: <a href="https://www.STEPBible.org" target="_blank" rel="noreferrer">STEPBible.org</a>, Tyndale House, Cambridge (TAGNT / TAHOT, lexicon). <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. <a href="https://github.com/GabeBrPierce/bible-interlinear" target="_blank" rel="noreferrer">JSON conversion</a>; formatted for Kyanza. {ko?'조회한 자료는 기기에 임시 저장됩니다.':'ကြည့်ရှုထားသော အချက်အလက်များကို စက်တွင် ယာယီသိမ်းထားပါသည်။'}</p>
    </div>
  </div>
}
const getLastReading = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('bible-last-reading') || 'null')
    const savedBook = books.find(item => item.code === saved?.book) || books[0]
    const savedChapter = Math.min(savedBook.chapters, Math.max(1, Number(saved?.chapter) || 1))
    const savedVerse = Math.max(1, Number(saved?.verse) || 1)
    return { book: savedBook, chapter: savedChapter, verse: savedVerse }
  } catch {
    return { book: books[0], chapter: 1, verse: 1 }
  }
}
export default function App() {
  const [lang,setLang]=useState(()=>localStorage.getItem('bible-language')==='ko'?'ko':'my')
  const [showBrandSplash,setShowBrandSplash]=useState(()=>{try{return !sessionStorage.getItem('kyanza-splash-seen')}catch{return false}})
  const [burmeseBook,setBurmeseBook]=useState(null), [kjvBook,setKjvBook]=useState(null), [nivBook,setNivBook]=useState(null), [koreanBook,setKoreanBook]=useState(null)
  const [secondaryBurmeseBook,setSecondaryBurmeseBook]=useState(null), [secondaryKjvBook,setSecondaryKjvBook]=useState(null), [secondaryNivBook,setSecondaryNivBook]=useState(null), [secondaryKoreanBook,setSecondaryKoreanBook]=useState(null)
  const [bibleLoading,setBibleLoading]=useState(false)
  const [bibleError,setBibleError]=useState('')
  const [offlineCounts,setOfflineCounts]=useState({my:0,kjv:0,niv:0,ko:0})
  const [offlineDownloading,setOfflineDownloading]=useState(null)
  const [offlineError,setOfflineError]=useState({})
  const [offlineAppReady,setOfflineAppReady]=useState(false)
  const [compare,setCompare]=useState(()=>localStorage.getItem('bible-compare') === 'true')
  const [primaryVersion,setPrimaryVersion]=useState(()=>['my','kjv','niv','ko'].includes(localStorage.getItem('bible-primary-version'))?localStorage.getItem('bible-primary-version'):'my')
  const [secondaryVersion,setSecondaryVersion]=useState(()=>['my','kjv','niv','ko'].includes(localStorage.getItem('bible-secondary-version'))?localStorage.getItem('bible-secondary-version'):'niv')
  const t=copy[lang]
  const [tab,setActiveTab]=useState('read'), [book,setBook]=useState(()=>getLastReading().book), [chapter,setChapter]=useState(()=>getLastReading().chapter), [fontSize,setFontSize]=useState(()=>Math.min(32,Math.max(9,Number(localStorage.getItem('bible-font-size')||11)||11))), [dark,setDark]=useState(false), [marked,setMarked]=useState(()=>JSON.parse(localStorage.getItem('bible-highlights')||'[]')), [selectedVerse,setSelectedVerse]=useState(()=>getLastReading().verse), [hasSelectedVerse,setHasSelectedVerse]=useState(false), [showScrollTop,setShowScrollTop]=useState(false), [saved,setSaved]=useState(false), [note,setNote]=useState(''), [showNote,setShowNote]=useState(false), [noteVerses,setNoteVerses]=useState([]), [noteEditVerses,setNoteEditVerses]=useState([]), [noteMode,setNoteMode]=useState('list'), [noteTarget,setNoteTarget]=useState(null), [verseNotes,setVerseNotes]=useState(()=>{try{const value=JSON.parse(localStorage.getItem('bible-verse-notes-v2')||'[]');return Array.isArray(value)?value:[]}catch{return []}}), [showBooks,setShowBooks]=useState(false), [showVersions,setShowVersions]=useState(false), [showNavigator,setShowNavigator]=useState(false), [navChapter,setNavChapter]=useState(1), [search,setSearch]=useState(''), [copyMode,setCopyMode]=useState(false), [copySelection,setCopySelection]=useState([]), [showCopyModal,setShowCopyModal]=useState(false), [copyVersions,setCopyVersions]=useState(['my','niv']), [copyToast,setCopyToast]=useState(''), [bookmarks,setBookmarks]=useState(()=>JSON.parse(localStorage.getItem('bible-bookmarks')||'[]')), [history,setHistory]=useState(()=>JSON.parse(localStorage.getItem('bible-history')||'[]'))
  const [searchBusy,setSearchBusy]=useState(false)
  const [searchProgress,setSearchProgress]=useState(0)
  const [searchReport,setSearchReport]=useState(null)
  const [searchLimits,setSearchLimits]=useState({})
  const [pendingSearchJump,setPendingSearchJump]=useState(null)
  const searchRun=useRef(0)
  const noteInputRef=useRef(null)
  const quoteRange=useRef({start:0,end:0})
  const readerTouch=useRef(null)
  const readerSwipeClick=useRef(0)
  const readingScroll=useRef(null)
  const readingKey=book.code+':'+chapter+':'+primaryVersion+':'+(compare?secondaryVersion:'single')
  const setTab=(next,resetReading=false)=>{
    if(next===tab)return
    if(tab==='read'){
      readingScroll.current={key:readingKey,top:window.scrollY}
      setPendingSearchJump(null)
    }
    if(next==='read'&&resetReading)readingScroll.current=null
    setActiveTab(next)
  }
  // Each menu opens at the top. Only a return to the same passage restores reading position.
  useLayoutEffect(()=>{
    const saved=readingScroll.current
    const top=tab==='read'&&!pendingSearchJump&&saved?.key===readingKey?saved.top:0
    window.scrollTo({top,behavior:'instant'})
    setShowScrollTop(window.scrollY>420)
  },[tab])
  const [quotePicker,setQuotePicker]=useState(null)
  const [quoteData,setQuoteData]=useState(null)
  const [quoteLoading,setQuoteLoading]=useState(false)
  const [quoteError,setQuoteError]=useState(false)
  const [originalTarget,setOriginalTarget]=useState(null)
  const versionNames={my:'Judson Burmese',kjv:'King James Version (KJV)',niv:'New International Version (NIV)',ko:'개역개정'}
  useEffect(()=>{
    if(!('serviceWorker' in navigator)||!('caches' in window))return
    let active=true
    const check=async()=>{
      try{
        const cacheNames=await caches.keys()
        const shellNames=cacheNames.filter(name=>name.startsWith('kyanza-shell-'))
        let ready=false
        for(const name of shellNames){
          const cache=await caches.open(name)
          const appPage=await cache.match('/')
          const requests=await cache.keys()
          if(appPage&&requests.some(req=>new URL(req.url).pathname.startsWith('/assets/')&&new URL(req.url).pathname.endsWith('.js'))){
            ready=true;break
          }
        }
        if(active)setOfflineAppReady(ready)
      }catch{if(active)setOfflineAppReady(false)}
    }
    check()
    const controller=()=>check()
    navigator.serviceWorker.addEventListener('controllerchange',controller)
    navigator.serviceWorker.ready.then(check).catch(()=>{})
    return()=>{active=false;navigator.serviceWorker.removeEventListener('controllerchange',controller)}
  },[tab])
  const offlineVersions = [
    {id:'my',label:'Judson Burmese'},
    {id:'kjv',label:'King James Version (KJV)'},
    {id:'niv',label:'New International Version (NIV)'},
    {id:'ko',label:'개역개정'}
  ]
  useEffect(()=>{
    let active=true
    if(tab!=='settings')return ()=>{active=false}
    Promise.all(offlineVersions.map(async item=>{
      const saved=await getSavedBibleCodes(item.id)
      return [item.id,books.filter(book=>saved.has(book.code)).length]
    })).then(entries=>{if(active)setOfflineCounts(Object.fromEntries(entries))})
      .catch(()=>{if(active)setOfflineError(old=>({...old,storage:lang==='ko'?'이 기기에서 오프라인 저장소를 사용할 수 없습니다.':'အော့ဖ်လိုင်းသိုလှောင်မှု မရနိုင်ပါ။'}))})
    return ()=>{active=false}
  },[tab])
  const downloadOffline=async version=>{
    if(offlineDownloading)return
    setOfflineDownloading(version)
    setOfflineError(old=>({...old,[version]:''}))
    try{
      await navigator.storage?.persist?.().catch(()=>false)
      const saved=await getSavedBibleCodes(version)
      let completed=books.filter(item=>saved.has(item.code)).length
      setOfflineCounts(old=>({...old,[version]:completed}))
      const loader={my:loadBurmeseBook,kjv:loadKJVBook,niv:loadNIVBook,ko:loadKoreanBook}[version]
      for(const item of books){
        if(saved.has(item.code))continue
        const loaded=await loader(item,{requireOfflineSave:true})
        if(!loaded?.chapters?.[1]?.length)throw new Error('Incomplete Bible: '+item.code)
        saved.add(item.code)
        completed++
        setOfflineCounts(old=>({...old,[version]:completed}))
        // Give the interface a chance to show progress on low-end mobile devices.
        await new Promise(resolve=>setTimeout(resolve,0))
      }
    }catch(error){
      setOfflineError(old=>({...old,[version]:lang==='ko'?'다운로드가 중단되었습니다. 네트워크·저장 공간 확인 후 다시 누르면 이어받습니다.':'ဒေါင်းလုဒ် ရပ်သွားသည်။ အင်တာနက်နှင့် နေရာလွတ်စစ်ပြီး ထပ်နှိပ်ပါ။'}))
    }finally{
      setOfflineDownloading(null)
    }
  }
  useEffect(()=>{if(!showBrandSplash)return;const timer=setTimeout(()=>{setShowBrandSplash(false);try{sessionStorage.setItem('kyanza-splash-seen','1')}catch{}},1250);return()=>clearTimeout(timer)},[showBrandSplash])
  useEffect(()=>{setSelectedVerse(1);setHasSelectedVerse(false)},[book,chapter])
  useEffect(()=>{const onScroll=()=>setShowScrollTop(window.scrollY>420);window.addEventListener('scroll',onScroll,{passive:true});onScroll();return()=>window.removeEventListener('scroll',onScroll)},[])
  useEffect(()=>{let active=true;setBibleLoading(true);setBibleError('');const loader=primaryVersion==='my'?loadBurmeseBook:primaryVersion==='kjv'?loadKJVBook:primaryVersion==='niv'?loadNIVBook:loadKoreanBook;if(loader){loader(book).then(data=>{if(active){if(primaryVersion==='my')setBurmeseBook(data);else if(primaryVersion==='kjv')setKjvBook(data);else if(primaryVersion==='niv')setNivBook(data);else setKoreanBook(data)}}).catch(()=>{if(active)setBibleError('ကျမ်းစာကို ဖွင့်၍မရပါ။ အင်တာနက်ကို စစ်ဆေးပါ။')}).finally(()=>{if(active)setBibleLoading(false)})}else{setBibleLoading(false)}return()=>{active=false}},[book,primaryVersion])
  useEffect(()=>{let active=true;if(compare){(secondaryVersion==='my'?loadBurmeseBook:secondaryVersion==='kjv'?loadKJVBook:secondaryVersion==='niv'?loadNIVBook:loadKoreanBook)(book).then(data=>{if(active){if(secondaryVersion==='my')setSecondaryBurmeseBook(data);else if(secondaryVersion==='kjv')setSecondaryKjvBook(data);else if(secondaryVersion==='niv')setSecondaryNivBook(data);else setSecondaryKoreanBook(data)}}).catch(()=>{});}return()=>{active=false}},[book,secondaryVersion,compare])
  const localBookName=b=>lang==='ko'?b.ko:(burmeseBookNames[b.code]||b.en)
  const bookTitle=localBookName(book)
  const chapterVerses=(primaryVersion==='my'?burmeseBook:primaryVersion==='kjv'?kjvBook:primaryVersion==='niv'?nivBook:koreanBook)?.chapters?.[chapter]||[]
  const verses=chapterVerses.map(v=>v.text)
  const verseNumbers=chapterVerses.map(v=>v.number)
  const findVerseEntry=(n)=>chapterVerses.find(v=>{const [start,endRaw]=String(v.number).split('-').map(Number);const end=endRaw??start;const target=Number(n);return String(v.number)===String(n)||(Number.isFinite(target)&&target>=start&&target<=end)})
  const getVerseText=(n)=>findVerseEntry(n)?.text||''
  const canonicalVerseNumber=(n)=>findVerseEntry(n)?.number??n
  const openOriginalLanguage=()=>{
    const picked=copySelection.length?copySelection:[selectedVerse]
    const verses=[...new Set(picked.flatMap(value=>{
      const [first,last]=String(value).split('-').map(Number)
      if(!Number.isInteger(first)||first<1)return []
      const end=Number.isInteger(last)&&last>=first&&last-first<200?last:first
      return Array.from({length:end-first+1},(_,i)=>first+i)
    }))].sort((a,b)=>a-b)
    if(verses.length)setOriginalTarget({code:book.code,name:bookTitle,chapter,verses})
  }
  const isVerseSelected=(n)=>hasSelectedVerse&&copySelection.includes(String(n))
  const getSecondaryText=(n,i)=>{const [start,end]=String(n).split('-').map(Number);const range=secondaryChapterVerses.find(v=>{const p=String(v.number).split('-').map(Number);return p.length>1&&start>=p[0]&&start<=p[1]});if(range)return start===Number(String(range.number).split('-')[0])?range.text:'';const matched=secondaryChapterVerses.filter(v=>{const [a,bRaw]=String(v.number).split('-').map(Number);const b=bRaw??a;return b>=start&&a<= (end||start)});return matched.length?matched.map(v=>v.text).join(' '):(secondaryVerses[i]||'')}
  const secondaryChapterVerses=(secondaryVersion==='my'?secondaryBurmeseBook:secondaryVersion==='kjv'?secondaryKjvBook:secondaryVersion==='niv'?secondaryNivBook:secondaryKoreanBook)?.chapters?.[chapter]||[]
  const secondaryVerses=secondaryChapterVerses.map(v=>v.text)
  const setVersion=(which,value)=>{if(which==='primary'){setPrimaryVersion(value);localStorage.setItem('bible-primary-version',value)}else{setSecondaryVersion(value);localStorage.setItem('bible-secondary-version',value)}}
  const toggleCompare=()=>{setCompare(v=>{localStorage.setItem('bible-compare',String(!v));return !v})}
  const toggleMark=(n)=>setMarked(v=>{const key=book.code+':'+chapter+':'+canonicalVerseNumber(n);const next=v.includes(key)?v.filter(x=>x!==key):[...v,key];localStorage.setItem('bible-highlights',JSON.stringify(next));return next})
  const toggleSelectedHighlights=()=>setMarked(current=>{const keys=copySelection.map(n=>book.code+':'+chapter+':'+canonicalVerseNumber(n));const allMarked=keys.every(key=>current.includes(key));const next=allMarked?current.filter(key=>!keys.includes(key)):[...new Set([...current,...keys])];localStorage.setItem('bible-highlights',JSON.stringify(next));return next})
  const passageKey=(n)=>book.code+':'+chapter+':'+n

  // Independent notes may share a verse; group notes retain all referenced verses.
  // Keep both existing v2 grouped notes and legacy per-verse localStorage keys.
  const normalizeNoteVerses=values=>[...new Set(values.map(v=>String(canonicalVerseNumber(v))))].sort((a,b)=>Number.parseInt(a,10)-Number.parseInt(b,10))
  const legacyNoteFor=verse=>{
    const number=String(canonicalVerseNumber(verse))
    const text=localStorage.getItem('bible-note-'+passageKey(number))
    return text?.trim()?{id:'legacy:'+passageKey(number),book:book.code,chapter,verses:[number],text,legacy:true,updatedAt:Number(localStorage.getItem('bible-note-updated-'+passageKey(number))||0)}:null
  }
  const notesForVerses=values=>{
    const wanted=normalizeNoteVerses(values)
    const saved=verseNotes.filter(item=>item.book===book.code&&Number(item.chapter)===Number(chapter)&&Array.isArray(item.verses)&&item.verses.some(v=>wanted.includes(String(v))))
    const legacy=wanted.map(legacyNoteFor).filter(Boolean)
    return [...saved,...legacy].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0))
  }
  const formatNoteTime=timestamp=>timestamp&&Number.isFinite(Number(timestamp))?new Date(Number(timestamp)).toLocaleString(lang==='ko'?'ko-KR':'my-MM',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}):null
  const openNotesFor=values=>{
    const verses=normalizeNoteVerses(values)
    setNoteVerses(verses);setNoteEditVerses(verses);setNoteTarget(null);setNote('')
    setNoteMode(notesForVerses(verses).length?'list':'edit');setShowNote(true)
  }
  const openNote=()=>openNotesFor(copySelection.length?copySelection:[selectedVerse])
  const beginNewNote=()=>{setNoteTarget(null);setNoteEditVerses(noteVerses);setNote('');setNoteMode('edit')}
  const editSavedNote=item=>{setNoteTarget(item.id);setNoteEditVerses(item.verses);setNote(item.text);setNoteMode('edit')}
  const openQuotePicker=(start,end)=>{
    quoteRange.current={start,end}
    setQuoteData(null);setQuoteLoading(true);setQuoteError(false)
    setQuotePicker({book,chapter,version:primaryVersion,verses:[]})
  }
  const changeNoteText=e=>{
    const value=e.target.value,caret=e.target.selectionStart??value.length
    setNote(value)
    if(!e.nativeEvent?.isComposing&&value!==note&&value[caret-1]==='@'&&value.length>=note.length){
      openQuotePicker(caret-1,caret)
    }
  }
  const openQuoteAtCursor=()=>{
    const input=noteInputRef.current
    const start=input?.selectionStart??note.length,end=input?.selectionEnd??start
    openQuotePicker(start,end)
  }
  useEffect(()=>{
    if(!showNote){setQuotePicker(null);return}
    if(!quotePicker)return
    let active=true
    setQuoteData(null);setQuoteLoading(true);setQuoteError(false)
    const loader={my:loadBurmeseBook,ko:loadKoreanBook,kjv:loadKJVBook,niv:loadNIVBook}[quotePicker.version]
    loader(quotePicker.book).then(data=>{
      if(active){setQuoteData(data);setQuoteError(!data?.chapters?.[1]?.length)}
    }).catch(()=>{if(active)setQuoteError(true)}).finally(()=>{if(active)setQuoteLoading(false)})
    return()=>{active=false}
  },[showNote,quotePicker?.book.code,quotePicker?.version])
  const quoteEntries=quoteData?.bookCode===quotePicker?.book.code?(quoteData?.chapters?.[quotePicker?.chapter]||[]):[]
  const chosenQuoteEntries=quoteEntries.filter(entry=>quotePicker?.verses.includes(String(entry.number)))
  const insertQuote=()=>{
    if(!quotePicker||quoteLoading||!chosenQuoteEntries.length)return
    const address=localBookName(quotePicker.book)+' '+quotePicker.chapter+':'+chosenQuoteEntries.map(v=>v.number).join(', ')
    const citation='['+address+' · '+versionNames[quotePicker.version]+']\n'+chosenQuoteEntries.map(v=>v.number+' '+v.text).join('\n')
    const {start,end}=quoteRange.current
    const before=note.slice(0,start),after=note.slice(end)
    const left=before&&!before.endsWith('\n')?'\n':''
    const insertion=left+citation+'\n'
    setNote(before+insertion+after);setQuotePicker(null)
    requestAnimationFrame(()=>{const input=noteInputRef.current;if(input){input.focus();input.setSelectionRange(start+insertion.length,start+insertion.length)}})
  }
  const renderNoteText=value=>String(value||'').split('\n').map((line,index)=>{
    const match=line.match(/^\[(.+?) (\d+):([\d,\s-]+) · (.+)\]$/)
    const target=match&&books.find(b=>[b.ko,b.en,burmeseBookNames[b.code]].includes(match[1]))
    const version=match&&Object.keys(versionNames).find(id=>versionNames[id]===match[4])
    const targetChapter=match?Number(match[2]):0
    const verse=match?Number.parseInt(match[3],10):0
    return <span key={index}>{index>0?'\n':''}{target&&version&&targetChapter>0&&targetChapter<=target.chapters&&verse>0?<button type="button" onClick={()=>{setShowNote(false);openSearchResult({book:target,chapter:targetChapter,verse},version)}} style={{border:0,background:'transparent',color:'#377ac5',font:'inherit',fontWeight:700,padding:0,textAlign:'start',textDecoration:'underline'}}>{localBookName(target)} {targetChapter}:{match[3]} · {versionNames[version]}</button>:line}</span>
  })
  const saveNote=()=>{
    const value=note.trim()
    if(!value)return
    if(noteTarget?.startsWith('legacy:')){
      localStorage.setItem('bible-note-'+noteTarget.slice(7),value)
      localStorage.setItem('bible-note-updated-'+noteTarget.slice(7),String(Date.now()))
      setVerseNotes(items=>[...items])
    }else{
      const id=noteTarget||'note:'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10)
      const existing=verseNotes.find(item=>item.id===id)
      const next=[...verseNotes.filter(item=>item.id!==id),{id,book:book.code,chapter,verses:noteEditVerses,text:value,createdAt:existing?.createdAt||Date.now(),...(existing?{updatedAt:Date.now()}:{})}]
      localStorage.setItem('bible-verse-notes-v2',JSON.stringify(next))
      setVerseNotes(next)
    }
    setNoteTarget(null);setNote('');setNoteMode('list')
  }
  const deleteNote=item=>{
    if(!window.confirm(lang==='ko'?'이 메모를 삭제하시겠습니까?':'ဤမှတ်စုကို ဖျက်မလား။'))return
    if(item.id.startsWith('legacy:')){
      localStorage.removeItem('bible-note-'+item.id.slice(7))
      setVerseNotes(items=>[...items])
    }else{
      const next=verseNotes.filter(saved=>saved.id!==item.id)
      localStorage.setItem('bible-verse-notes-v2',JSON.stringify(next))
      setVerseNotes(next)
    }
    setNoteTarget(null);setNote('');setNoteMode('list')
  }
  const shareVerse=async()=>{const text=bookTitle+' '+chapter+':'+selectedVerse+' '+getVerseText(selectedVerse);try{if(navigator.share)await navigator.share({text});else if(navigator.clipboard)await navigator.clipboard.writeText(text)}catch(e){}}
  const toggleBookmark=(n)=>setBookmarks(v=>{const verse=canonicalVerseNumber(n);const key=passageKey(verse);const next=v.some(x=>x.key===key)?v.filter(x=>x.key!==key):[...v,{key,book:book.code,bookName:bookTitle,chapter,verse,text:getVerseText(n)}];localStorage.setItem('bible-bookmarks',JSON.stringify(next));return next})
  const changeFont=(n)=>{setFontSize(n);localStorage.setItem('bible-font-size',String(n))}
  const normalizeSearch=(value,version)=>{
    const clean=String(value||'').normalize('NFC').toLowerCase().replace(/[\u200b-\u200d\ufeff]/g,'').trim()
    return version==='my'||version==='ko'?clean.replace(/\s+/g,''):clean.replace(/\s+/g,' ')
  }
  const renderSearchHighlight=(value,rawQuery,version)=>{
    const original=String(value||'')
    const needle=normalizeSearch(rawQuery,version)
    if(!needle)return original
    const compact=version==='my'||version==='ko'
    const chunks=typeof Intl.Segmenter==='function'
      ? Array.from(new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(original),part=>({text:part.segment,start:part.index}))
      : Array.from(original.matchAll(/[\u1100-\u11ff]+|\P{M}\p{M}*|\p{M}+/gu),part=>({text:part[0],start:part.index}))
    let normalized='',pendingSpace=null
    const map=[]
    const append=(part,range)=>{
      normalized+=part
      for(let i=0;i<part.length;i++)map.push(range)
    }
    for(const chunk of chunks){
      const range=[chunk.start,chunk.start+chunk.text.length]
      const clean=chunk.text.normalize('NFC').toLowerCase().replace(/[\u200b-\u200d\ufeff]/g,'')
      for(const char of clean){
        if(/\s/u.test(char)){
          if(!compact&&normalized)pendingSpace=pendingSpace?[pendingSpace[0],range[1]]:range
          continue
        }
        if(pendingSpace){append(' ',pendingSpace);pendingSpace=null}
        append(char,range)
      }
    }
    const ranges=[]
    for(let from=0;;){
      const index=normalized.indexOf(needle,from)
      if(index<0)break
      const start=map[index][0],end=map[index+needle.length-1][1]
      const previous=ranges[ranges.length-1]
      if(previous&&start<=previous[1])previous[1]=Math.max(previous[1],end)
      else ranges.push([start,end])
      from=index+needle.length
    }
    if(!ranges.length)return original
    const parts=[];let offset=0
    for(const [start,end] of ranges){
      if(start>offset)parts.push(original.slice(offset,start))
      parts.push(<mark key={start} style={{background:'#ffdb66',color:'#201600',fontWeight:800,borderRadius:3,boxDecorationBreak:'clone',WebkitBoxDecorationBreak:'clone'}}>{original.slice(start,end)}</mark>)
      offset=end
    }
    if(offset<original.length)parts.push(original.slice(offset))
    return parts
  }
  useEffect(()=>()=>{searchRun.current++},[tab])
  const cancelSearch=()=>{searchRun.current++;setSearchBusy(false);setSearchReport(null)}
  const runBibleSearch=async event=>{
    event.preventDefault()
    const rawQuery=search.trim()
    if(!normalizeSearch(rawQuery,'ko')||searchBusy)return
    const run=++searchRun.current
    setSearchBusy(true);setSearchProgress(0);setSearchReport(null);setSearchLimits({})
    const loaders={my:loadBurmeseBook,ko:loadKoreanBook,kjv:loadKJVBook,niv:loadNIVBook}
    // Start with the language of the query, but search every translation.
    const preferred=/[\u1000-\u109f\uaa60-\uaa7f\ua9e0-\ua9ff]/u.test(rawQuery)?['my']: /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/u.test(rawQuery)?['ko']:['kjv','niv']
    const versions=[...new Set([...preferred,primaryVersion,'my','ko','kjv','niv'])]
    const groups=[];let progress=0
    for(const version of versions){
      const query=normalizeSearch(rawQuery,version)
      const matches=[];let total=0,checked=0
      const missing=[]
      for(const item of books){
        if(searchRun.current!==run)return
        try{
          const data=await loaders[version](item)
          if(searchRun.current!==run)return
          if(!data?.chapters?.[1]?.length)throw new Error('Missing Bible data')
          for(const [chapterNumber,entries] of Object.entries(data.chapters)){
            for(const verse of entries){
              if(query&&normalizeSearch(verse.text,version).includes(query)){
                total++
                if(matches.length<500)matches.push({book:item,chapter:Number(chapterNumber),verse:verse.number,text:verse.text})
              }
            }
          }
          if(Object.values(data.chapters).filter(entries=>entries?.length).length<item.chapters)missing.push(item.code)
          else checked++
        }catch{missing.push(item.code)}
        if(searchRun.current!==run)return
        setSearchProgress(++progress)
        await new Promise(resolve=>setTimeout(resolve,0))
      }
      if(searchRun.current!==run)return
      groups.push({version,matches,total,checked,missing})
      setSearchReport({query:rawQuery,groups:[...groups]})
    }
    if(searchRun.current===run)setSearchBusy(false)
  }
  useEffect(()=>{if(tab!=='search')setSearchBusy(false)},[tab])
  const openSearchResult=(result,version)=>{
    setPendingSearchJump({code:result.book.code,chapter:result.chapter,verse:result.verse,version})
    setCopySelection([]);setCopyMode(false);setHasSelectedVerse(false)
    setVersion('primary',version);setBook(result.book);setChapter(result.chapter);setTab('read',true)
  }
  useEffect(()=>{
    if(!pendingSearchJump||tab!=='read'||bibleLoading||primaryVersion!==pendingSearchJump.version||book.code!==pendingSearchJump.code||chapter!==pendingSearchJump.chapter)return
    const data={my:burmeseBook,ko:koreanBook,kjv:kjvBook,niv:nivBook}[primaryVersion]
    if(data?.bookCode!==book.code)return
    const verse=Number.parseInt(pendingSearchJump.verse,10)
    const entry=data.chapters?.[chapter]?.find(v=>{
      const [first,last]=String(v.number).split('-').map(Number)
      return verse>=first&&verse<=(last??first)
    })
    const id='verse-'+String(entry?.number??pendingSearchJump.verse).split('-')[0]
    const timer=requestAnimationFrame(()=>{
      const element=document.getElementById(id)
      if(element){setSelectedVerse(pendingSearchJump.verse);element.scrollIntoView({behavior:'smooth',block:'center'})}
      setPendingSearchJump(null)
    })
    return()=>cancelAnimationFrame(timer)
  },[pendingSearchJump,tab,bibleLoading,primaryVersion,book,chapter,burmeseBook,koreanBook,kjvBook,nivBook])
  const moveReaderChapter=(direction)=>{
    const index=books.findIndex(item=>item.code===book.code)
    if(index<0)return false
    let nextBook=book
    let nextChapter=chapter+direction
    if(nextChapter>book.chapters){
      if(index===books.length-1)return false
      nextBook=books[index+1];nextChapter=1
    }else if(nextChapter<1){
      if(index===0)return false
      nextBook=books[index-1];nextChapter=nextBook.chapters
    }
    setPendingSearchJump(null)
    setCopySelection([]);setCopyMode(false);setHasSelectedVerse(false);setSelectedVerse(1)
    if(nextBook.code!==book.code)setBook(nextBook)
    setChapter(nextChapter)
    window.scrollTo({top:0,behavior:'instant'})
    return true
  }
  const startReaderTouch=(event)=>{
    readerSwipeClick.current=0
    if(event.touches.length!==1||event.target.closest('button,input,select,textarea,a')){
      readerTouch.current=null;return
    }
    const point=event.touches[0]
    readerTouch.current={id:point.identifier,x:point.clientX,y:point.clientY}
  }
  const trackReaderTouch=(event)=>{
    const start=readerTouch.current
    if(!start)return
    if(event.touches.length!==1){readerTouch.current=null;return}
    const point=event.touches[0]
    if(point.identifier!==start.id){readerTouch.current=null;return}
    const dx=Math.abs(point.clientX-start.x),dy=Math.abs(point.clientY-start.y)
    if(dy>24&&dy>=dx)readerTouch.current=null
  }
  const finishReaderTouch=(event)=>{
    const start=readerTouch.current
    readerTouch.current=null
    if(!start||event.touches.length!==0)return
    const point=Array.from(event.changedTouches).find(touch=>touch.identifier===start.id)
    if(!point||window.getSelection()?.toString())return
    const dx=point.clientX-start.x,dy=point.clientY-start.y
    if(Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy)*1.5)return
    readerSwipeClick.current=Date.now()+400
    moveReaderChapter(dx<0?1:-1)
  }
  const suppressReaderSwipeClick=(event)=>{
    if(Date.now()<readerSwipeClick.current){event.preventDefault();event.stopPropagation();readerSwipeClick.current=0}
  }
  const changeLang=(value)=>{setLang(value);localStorage.setItem('bible-language',value)}
  useEffect(()=>{localStorage.setItem('bible-last-reading',JSON.stringify({book:book.code,chapter,verse:selectedVerse}))},[book,chapter,selectedVerse])
  useEffect(()=>{const item={book:book.code,bookName:bookTitle,chapter};setHistory(v=>{const next=[item,...v.filter(x=>x.book!==item.book||x.chapter!==item.chapter)].slice(0,40);localStorage.setItem('bible-history',JSON.stringify(next));return next})},[book,chapter])
  const collectNotes=()=>{
    const validNote=item=>{
      const target=books.find(b=>b.code===item?.book)
      return target&&Number.isInteger(Number(item.chapter))&&Number(item.chapter)>=1&&Number(item.chapter)<=target.chapters&&Array.isArray(item.verses)&&item.verses.length>0&&item.verses.every(v=>/^\d+(?:-\d+)?$/.test(String(v))&&Number.parseInt(v,10)>0)&&typeof item.text==='string'&&item.text.trim()
    }
    const list=verseNotes.filter(validNote)
    try{
      for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i)
        const match=key?.match(/^bible-note-([^:]+):(\d+):(\d+(?:-\d+)?)$/)
        if(!match)continue
        const item={id:'legacy:'+match[1]+':'+match[2]+':'+match[3],book:match[1],chapter:Number(match[2]),verses:[match[3]],text:localStorage.getItem(key),updatedAt:Number(localStorage.getItem('bible-note-updated-'+match[1]+':'+match[2]+':'+match[3])||0)}
        if(validNote(item))list.push(item)
      }
    }catch{}
    return list.sort((a,b)=>(Number(b.updatedAt||b.createdAt)||0)-(Number(a.updatedAt||a.createdAt)||0))
  }
  const allNotes=tab==='notes'?collectNotes():[]
  const tabIds=['read','notes','saved','history']
  return <main className={dark?'app dark':'app'} lang={lang==='ko'?'ko':'my'}>{showBrandSplash&&<div className="kyanza-splash" aria-label="Kyanza Bible"><img src="/kyanza-icon.svg" alt=""/><div className="kyanza-splash-name">Kyanza</div><div className="kyanza-splash-myanmar">ကျမ်းစာ</div><div className="kyanza-splash-tagline">THE WORD OF GOD</div></div>}
    <header className="topbar reader-topbar"><div className="topbar-title"><span className="topbar-eyebrow">{lang==='ko'?'성경 읽기':'ကျမ်းစာဖတ်ရှုခြင်း'}</span><button className="scripture-title-button" onClick={()=>{if(showNavigator){setShowNavigator(false)}else{setNavChapter(chapter);setShowNavigator(true)}}} aria-label={lang==='ko'?'목차 및 구절 이동':'ကျမ်းစာအုပ်နှင့် အခန်းရွေးရန်'}>{bookTitle} <span>{chapter} {lang==='ko'?'장':'အခန်း'}</span></button></div><div className="top-actions"><button className="icon-btn" onClick={()=>setShowVersions(true)} aria-label={lang==='ko'?'역본 선택':'ဘာသာပြန်ရွေးချယ်ရန်'}><BookOpen/></button><button className="icon-btn" onClick={()=>setTab('search')} aria-label={t.search}><Search/></button><button className="icon-btn" onClick={()=>setTab('settings')} aria-label={lang==='ko'?'설정':'ဆက်တင်များ'}><span className="more-dots">⋮</span></button></div></header>
    {tab==='read' ? <section className="reader">
      <div className="reader-heading reader-heading-hidden"><div><span className="eyebrow">{t.readEyebrow}</span><h1>{t.readTitle}</h1></div><div className="reader-actions"><button className={compare?'soft-btn compare-on':'soft-btn'} onClick={toggleCompare}><Columns2 size={16}/> {compare?(lang==='ko'?'함께 보기 중':'နှစ်ဘာသာ'): (lang==='ko'?'두 성경 함께 보기':'ဘာသာနှစ်မျိုး')}</button></div></div>
      <div className="version-selectors"><label className="version-picker"><span>{lang==='ko'?'첫 번째 번역본':'ပထမဘာသာပြန်'}</span><select value={primaryVersion} onChange={e=>setVersion('primary',e.target.value)}><option value="my">{versionNames.my}</option><option value="kjv">{versionNames.kjv}</option><option value="niv">{versionNames.niv}</option><option value="ko">{versionNames.ko}</option></select></label>{compare&&<label className="version-picker"><span>{lang==='ko'?'두 번째 번역본':'ဒုတိယဘာသာပြန်'}</span><select value={secondaryVersion} onChange={e=>setVersion('secondary',e.target.value)}><option value="my">{versionNames.my}</option><option value="kjv">{versionNames.kjv}</option><option value="niv">{versionNames.niv}</option><option value="ko">{versionNames.ko}</option></select></label>}</div><div className="selector-row"><button className="select-pill book-select" onClick={()=>setShowBooks(true)}>{bookTitle}<ChevronDown size={16}/></button><button className="select-pill" onClick={()=>setChapter(c=>Math.max(1,c-1))}><ChevronLeft size={15}/></button><span className="chapter-label">{chapter} <small>{t.chapter}</small></span><button className="select-pill" onClick={()=>setChapter(c=>Math.min(book.chapters,c+1))}><ChevronRight size={15}/></button></div>
      <div className="scripture-card" onTouchStart={startReaderTouch} onTouchMove={trackReaderTouch} onTouchEnd={finishReaderTouch} onTouchCancel={()=>{readerTouch.current=null}} onClickCapture={suppressReaderSwipeClick} style={{touchAction:'pan-y pinch-zoom','--bible-font-size':`${fontSize}pt`,'--bible-secondary-font-size':`${Math.max(9,fontSize-1)}pt`}}><div className="scripture-meta"><span>{bookTitle} · {chapter}</span><span className="version-tag">{versionNames[primaryVersion]}</span></div>{(bibleLoading?[]:verses).map((v,i)=>{const verseNo=verseNumbers[i]??i+1;return <div key={i} id={`verse-${String(verseNo).split('-')[0]}`} className={`verse ${isVerseSelected(verseNo)?'verse-selected':''} ${copySelection.includes(String(verseNo))?'verse-copy-selected':''} ${compare?'verse-comparison':''}`} onClick={()=>{if(copyMode){setCopySelection(s=>s.includes(String(verseNo))?s.filter(x=>x!==String(verseNo)):[...s,String(verseNo)]);return}const next=copySelection.includes(String(verseNo))?copySelection.filter(x=>x!==String(verseNo)):[...copySelection,String(verseNo)];setCopySelection(next);setHasSelectedVerse(next.length>0);setSelectedVerse(next.length?next[next.length-1]:verseNo)}}><span className="verse-num">{verseNo}</span><div className="verse-texts"><p className={compare?'verse-primary':''} style={{fontSize:`${fontSize}pt`}}><span className={marked.includes(passageKey(verseNo))?'verse-ink-highlight':''}>{v}</span></p>{compare&&<p className="verse-secondary" style={{fontSize:`${Math.max(9,fontSize-1)}pt`}}><span className={marked.includes(passageKey(verseNo))?'verse-ink-highlight':''}>{getSecondaryText(verseNo,i)}</span></p>}{notesForVerses([verseNo]).length>0&&<button type="button" className="verse-note-indicator" title={lang==='ko'?'메모 목록':'မှတ်စုများ'} onClick={e=>{e.stopPropagation();openNotesFor([verseNo])}}><NotebookPen size={13}/><span>{lang==='ko'?'메모':'မှတ်စု'} {notesForVerses([verseNo]).length}{notesForVerses([verseNo]).length===1&&notesForVerses([verseNo])[0].verses.length>1?` · ${notesForVerses([verseNo])[0].verses.join(', ')}`:''}</span></button>}</div><button className={bookmarks.some(x=>x.key===passageKey(verseNo))?'verse-bookmark active':'verse-bookmark'} onClick={e=>{e.stopPropagation();toggleBookmark(verseNo)}} aria-label="북마크"><Bookmark size={16} fill={bookmarks.some(x=>x.key===passageKey(verseNo))?'currentColor':'none'}/></button></div>})}{bibleLoading&&<div className="sample-notice">{lang==='ko'?'미얀마어 성경을 불러오는 중입니다…':'ကျမ်းစာကို ဖွင့်နေသည်…'}</div>}{bibleError&&<div className="sample-notice">{bibleError}</div>}</div>
      {copyMode&&<div className="copy-selection-bar"><span>{lang==='ko'?`${copySelection.length}절 선택됨`:`${copySelection.length} ပိုဒ် ရွေးထားသည်`}</span><button onClick={()=>setCopySelection(verseNumbers.map(n=>String(n)))}>{lang==='ko'?'전체 선택':'အားလုံးရွေး'}</button><button onClick={()=>setCopySelection([])}>{lang==='ko'?'선택 해제':'ရွေးချယ်မှုရှင်း'}</button><button className="copy-selection-primary" disabled={!copySelection.length} onClick={()=>setShowCopyModal(true)}>{lang==='ko'?'복사':'ကူးယူရန်'}</button><button className="copy-selection-close" onClick={()=>{setCopyMode(false);setCopySelection([])}} aria-label="close">×</button></div>}{hasSelectedVerse&&!copyMode&&<div className="selected-verse-action" style={{flexDirection:'column',alignItems:'stretch',gap:7,padding:'9px 12px',bottom:'calc(62px + env(safe-area-inset-bottom) + 10px)'}}>
        <div className="selected-verse-label"><strong style={{overflow:'hidden',textOverflow:'ellipsis'}}>{bookTitle} {chapter}:{copySelection.length>1?copySelection.join(', '):selectedVerse}</strong></div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:6}}>
          <button type="button" onClick={toggleSelectedHighlights} aria-label={lang==='ko'?'형광펜':'အရောင်ခြယ်'} style={{minWidth:0,minHeight:39,border:'1px solid var(--line)',borderRadius:10,background:copySelection.every(n=>marked.includes(book.code+':'+chapter+':'+canonicalVerseNumber(n)))?'#fff1b8':'var(--surface2)',color:'var(--text)',font:'inherit',fontSize:12,fontWeight:650,display:'flex',alignItems:'center',justifyContent:'center',gap:5}}><Highlighter size={16}/><span>{lang==='ko'?'형광펜':'အရောင်ခြယ်'}</span></button>
          <button type="button" onClick={openNote} aria-label={lang==='ko'?'메모':'မှတ်စု'} style={{minWidth:0,minHeight:39,border:'1px solid var(--line)',borderRadius:10,background:'var(--surface2)',color:'var(--text)',font:'inherit',fontSize:12,fontWeight:650,display:'flex',alignItems:'center',justifyContent:'center',gap:5}}><NotebookPen size={16}/><span>{lang==='ko'?'메모':'မှတ်စု'}</span></button>
          <button type="button" onClick={openOriginalLanguage} aria-label={lang==='ko'?'원어 분석':'မူရင်းကျမ်းစာ လေ့လာရန်'} style={{minWidth:0,minHeight:39,border:'1px solid var(--line)',borderRadius:10,background:'var(--surface2)',color:'var(--text)',font:'inherit',fontSize:12,fontWeight:650,display:'flex',alignItems:'center',justifyContent:'center',gap:4}}><Languages size={15}/><span>{lang==='ko'?'원어':'မူရင်း'}</span></button>
          <button type="button" onClick={()=>setShowCopyModal(true)} aria-label={lang==='ko'?'복사':'ကူးယူရန်'} style={{minWidth:0,minHeight:39,border:0,borderRadius:10,background:'#435d7c',color:'#fff',font:'inherit',fontSize:12,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:5}}><Copy size={16}/><span>{lang==='ko'?'복사':'ကူးယူရန်'}</span></button>
        </div>
      </div>}{tab==='read'&&showScrollTop&&!hasSelectedVerse&&!copyMode&&<button className="scroll-to-top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label={lang==='ko'?'맨 위로 이동':'အပေါ်ဆုံးသို့ သွားရန်'} title={lang==='ko'?'맨 위로':'အပေါ်ဆုံး'}><ChevronDown size={20}/></button>}
      <div className="tools-row"><button onClick={()=>setSaved(!saved)} className={saved?'tool active':'tool'}><Bookmark/><span>{t.save}</span></button><button onClick={()=>toggleMark(selectedVerse)} className="tool"><Highlighter/><span>{t.highlight}</span></button><button onClick={openNote} className="tool"><NotebookPen/><span>{t.note}</span></button><button onClick={shareVerse} className="tool"><Share2/><span>{t.share}</span></button></div>
      <div className="reading-progress"><div><span>{t.today}</span><strong>{t.minutes}</strong></div><div className="progress"><i/></div></div>
    </section> : tab==='search' ? <section className="reader">
      <div className="reader-heading search-page-heading"><div><span className="eyebrow">{t.search}</span><h1>{t.searchTitle}</h1></div><button className="menu-return-button" onClick={()=>setTab('read')}><BookOpen size={17}/><span>{lang==='ko'?'성경으로 돌아가기':'ကျမ်းစာသို့ ပြန်သွားရန်'}</span></button></div>
      <form onSubmit={runBibleSearch} style={{display:'grid',gap:10,marginBottom:16}}>
        <input className="search-input" placeholder={t.searchPlaceholder} value={search} disabled={searchBusy} onChange={e=>{setSearch(e.target.value);setSearchReport(null)}}/>
        <button className="menu-return-button" type="submit" disabled={searchBusy||!search.trim()} style={{justifyContent:'center',minHeight:44}}><Search size={18}/>{t.search}</button>
        <p style={{fontSize:12,color:'var(--muted)',lineHeight:1.6,margin:0}}>{lang==='ko'?'저장된 성경은 인터넷 없이 검색할 수 있습니다. 저장되지 않은 성경은 검색할 때 불러옵니다.':'သိမ်းထားသော ကျမ်းစာကို အင်တာနက်မလိုဘဲ ရှာနိုင်ပါသည်။ မသိမ်းရသေးသော ကျမ်းစာများကို ရှာဖွေစဉ် ဖွင့်ယူပါမည်။'}</p>
      </form>
      {searchBusy&&<div className="sample-notice" role="status"><p>{lang==='ko'?'성경 본문 검색 중':'ကျမ်းစာတွင် ရှာဖွေနေသည်'} · {searchProgress}/264</p><progress value={searchProgress} max={264} style={{width:'100%'}}/><button type="button" className="menu-return-button" onClick={cancelSearch}>{lang==='ko'?'취소':'ပယ်ဖျက်ရန်'}</button></div>}
      {searchReport&&<div>
        <p role="status" style={{fontWeight:650}}>{lang==='ko'?'검색 결과':'ရှာဖွေမှုရလဒ်'} · {searchReport.groups.reduce((n,g)=>n+g.total,0).toLocaleString()} {lang==='ko'?'건':'ခု'} <small style={{color:'var(--muted)'}}>({searchReport.groups.length}/4 {lang==='ko'?'역본 검색':'ဘာသာပြန် ရှာပြီး'})</small></p>
        {searchReport.groups.filter(g=>g.missing.length>0).map(g=><p key={g.version} className="sample-notice">{versionNames[g.version]} · {lang==='ko'?('66권 중 '+g.checked+'권 전체 검색. 일부 성경을 불러오지 못했습니다.'):('၆၆ အုပ်အနက် '+g.checked+' အုပ်ကိုသာ အပြည့်အစုံ ရှာနိုင်ခဲ့ပါသည်။')}</p>)}
        {!searchBusy&&searchReport.groups.every(g=>g.total===0)&&<p className="empty-state">{lang==='ko'?'일치하는 구절이 없습니다.':'ကိုက်ညီသော ကျမ်းပိုဒ် မတွေ့ပါ။'}</p>}
        {searchReport.groups.filter(g=>g.total>0).map(group=><section key={group.version} style={{marginBottom:20}}>
          <h2 style={{fontSize:15,margin:'12px 0',lineHeight:1.5}}>{versionNames[group.version]} <small style={{color:'var(--muted)',fontWeight:400}}>· {group.total.toLocaleString()} {lang==='ko'?'구절':'ပိုဒ်'}</small></h2>
          {group.matches.slice(0,searchLimits[group.version]||20).map(result=><button type="button" className="book-result" key={group.version+':'+result.book.code+':'+result.chapter+':'+result.verse} onClick={()=>openSearchResult(result,group.version)} style={{alignItems:'flex-start',textAlign:'start'}}><BookOpen size={18} style={{flexShrink:0}}/><span style={{minWidth:0,flex:1}}><strong>{localBookName(result.book)} {result.chapter}:{result.verse}</strong><small style={{display:'block',whiteSpace:'normal',overflow:'visible',textOverflow:'clip',lineHeight:1.7,marginTop:6}}>{renderSearchHighlight(result.text,searchReport.query,group.version)}</small></span><ChevronRight size={18} style={{flexShrink:0}}/></button>)}
          {(searchLimits[group.version]||20)<group.matches.length&&<button type="button" className="menu-return-button" onClick={()=>setSearchLimits(prev=>({...prev,[group.version]:(prev[group.version]||20)+20}))}>{lang==='ko'?'더 보기':'ပိုမိုကြည့်ရန်'}</button>}
          {group.total>group.matches.length&&<p className="sample-notice">{lang==='ko'?'이 역본은 최대 500개 결과를 표시합니다. 더 구체적인 문구로 검색하세요.':'ဤဘာသာပြန်အတွက် ရလဒ် ၅၀၀ အထိ ပြသထားသည်။ ပိုတိကျသော စကားလုံးဖြင့် ထပ်ရှာပါ။'}</p>}
        </section>)}
      </div>}
    </section> : tab==='notes' ? <section className="reader">
      <div className="menu-page-heading"><div><span className="menu-eyebrow">{lang==='ko'?'내 말씀':'ကျွန်ုပ်၏ကျမ်းစာ'}</span><h1>{lang==='ko'?'메모 모음':'မှတ်စုများ'}</h1></div><button className="menu-return-button" onClick={()=>setTab('read')}><BookOpen size={17}/><span>{lang==='ko'?'성경으로 돌아가기':'ကျမ်းစာသို့ ပြန်သွားရန်'}</span></button></div>
      {allNotes.length===0?<p className="empty-state">{lang==='ko'?'아직 작성한 메모가 없습니다. 말씀에서 구절을 선택하고 메모를 작성해 보세요.':'ရေးထားသော မှတ်စု မရှိသေးပါ။ ကျမ်းပိုဒ်ကို ရွေးပြီး မှတ်စု ရေးပါ။'}</p>:<div style={{display:'grid',gap:12}}>
        <p style={{fontSize:12,color:'var(--muted)',margin:0}}>{lang==='ko'?'전체 메모 '+allNotes.length+'개':'မှတ်စု စုစုပေါင်း '+allNotes.length+' ခု'}</p>
        {allNotes.map(item=>{const target=books.find(b=>b.code===item.book);return <article key={item.id} style={{minWidth:0,border:'1px solid var(--line)',borderRadius:12,padding:14,background:'var(--surface)',color:'var(--text)'}}>
          <button type="button" onClick={()=>openSearchResult({book:target,chapter:Number(item.chapter),verse:Number.parseInt(item.verses[0],10)},primaryVersion)} style={{display:'flex',alignItems:'center',gap:8,width:'100%',padding:0,border:0,background:'transparent',color:'var(--text)',font:'inherit',fontWeight:700,textAlign:'start'}}><NotebookPen size={17} style={{flexShrink:0}}/><span style={{flex:1,minWidth:0,overflowWrap:'anywhere'}}>{localBookName(target)} {item.chapter}:{item.verses.join(', ')}</span><ChevronRight size={17} style={{flexShrink:0}}/></button>
          {(item.updatedAt||item.createdAt)>0&&<div style={{fontSize:11,color:'var(--muted)',marginTop:7}}>{formatNoteTime(item.updatedAt||item.createdAt)}</div>}
          <p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',margin:'10px 0 0',fontSize:13,lineHeight:1.75}}>{renderNoteText(item.text)}</p>
        </article>})}
      </div>}
    </section> : tab==='saved' ? <section className="reader"><div className="menu-page-heading"><div><span className="menu-eyebrow">{lang==='ko'?'내 말씀':'ကျွန်ုပ်၏ကျမ်းစာ'}</span><h1>{lang==='ko'?'저장한 구절':'သိမ်းထားသောကျမ်းပိုဒ်'}</h1></div><button className="menu-return-button" onClick={()=>setTab('read')}><BookOpen size={17}/><span>{lang==='ko'?'성경으로 돌아가기':'ကျမ်းစာသို့ ပြန်သွားရန်'}</span></button></div>{bookmarks.length===0?<p className="empty-state">{lang==='ko'?'아직 저장한 구절이 없습니다. 본문 오른쪽 북마크를 눌러 저장하세요.':'သိမ်းထားသောကျမ်းပိုဒ် မရှိသေးပါ။'}</p>:bookmarks.map(x=><button className="book-result" key={x.key} onClick={()=>{const b=books.find(y=>y.code===x.book);if(b){setBook(b);setChapter(x.chapter);setSelectedVerse(x.verse);setHasSelectedVerse(true);setTab('read',true)}}}><Bookmark/><span>{books.find(b=>b.code===x.book)?localBookName(books.find(b=>b.code===x.book)):x.bookName} {x.chapter}:{x.verse}<small>{x.text}</small></span><ChevronRight/></button>)}</section> : tab==='history' ? <section className="reader"><div className="menu-page-heading"><div><span className="menu-eyebrow">{lang==='ko'?'읽기 기록':'ဖတ်ရှုမှုမှတ်တမ်း'}</span><h1>{lang==='ko'?'최근 읽은 말씀':'ဖတ်ရှုခဲ့သောမှတ်တမ်း'}</h1></div><button className="menu-return-button" onClick={()=>setTab('read')}><BookOpen size={17}/><span>{lang==='ko'?'성경으로 돌아가기':'ကျမ်းစာသို့ ပြန်သွားရန်'}</span></button></div>{history.length===0?<p className="empty-state">{lang==='ko'?'읽은 기록이 없습니다.':'မှတ်တမ်းမရှိသေးပါ။'}</p>:history.map((x,i)=><button className="book-result" key={x.book+':'+x.chapter} onClick={()=>{const b=books.find(y=>y.code===x.book);if(b){setBook(b);setChapter(x.chapter);setTab('read',true)}}}><CalendarDays/><span>{books.find(b=>b.code===x.book)?localBookName(books.find(b=>b.code===x.book)):x.bookName} {x.chapter}{lang==='ko'?'장':'အခန်း'}<small>{lang==='ko'?'최근 읽은 장':'နောက်ဆုံးဖတ်ရှုခဲ့သောအခန်း'}</small></span><ChevronRight/></button>)}</section> : <section className="reader options-page"><div className="menu-page-heading options-page-title"><div><span className="menu-eyebrow">{lang==='ko'?'읽기 환경':'ဖတ်ရှုမှုအပြင်အဆင်'}</span><h1>{lang==='ko'?'옵션':'ရွေးချယ်စရာများ'}</h1></div><button className="menu-return-button" onClick={()=>setTab('read')}><BookOpen size={17}/><span>{lang==='ko'?'성경으로 돌아가기':'ကျမ်းစာသို့ ပြန်သွားရန်'}</span></button></div><div className="options-card"><div className="options-card-top"><div className="options-icon"><Type size={20}/></div><div><div className="options-section-title">{lang==='ko'?'본문 글자 크기':'ကျမ်းစာစာလုံးအရွယ်အစား'}</div><p>{lang==='ko'?'눈에 편한 크기로 조절하세요.':'သက်တောင့်သက်သာ ဖတ်နိုင်သော အရွယ်ကို ရွေးပါ။'}</p></div></div><div className="font-size-controls"><button aria-label="글자 작게" onClick={()=>changeFont(Math.max(9,fontSize-1))}>A−</button><div className="font-size-current"><strong>{fontSize}</strong><small>pt</small></div><button aria-label="글자 크게" onClick={()=>changeFont(Math.min(32,fontSize+1))}>A+</button><button className="font-reset" onClick={()=>changeFont(11)}>{lang==='ko'?'기본값':'ပုံမှန်'}</button></div><div className="font-preview-label">{lang==='ko'?'글자 크기 미리보기':'စာလုံးအရွယ် နမူနာ'}</div><div className="font-preview" style={{fontSize:`${fontSize}pt`}}><span className="font-preview-verse">1</span>{lang==='ko'?'태초에 하나님이 천지를 창조하시니라.':'အစအဦး၌ ဘုရားသခင်သည် ကောင်းကင်နှင့် မြေကြီးကို ဖန်ဆင်းတော်မူ၏။'}</div><p className="font-preview-caption">{lang==='ko'?'실제 성경 본문에 적용되는 크기입니다.':'ကျမ်းစာဖတ်ရှုရာတွင် ဤအရွယ်အစားကို အသုံးပြုမည်။'}</p></div><div className="options-group"><div className="options-group-heading">{lang==='ko'?'오프라인 성경':'အင်တာနက်မလိုသော ကျမ်းစာ'}</div>
  <div style={{padding:'11px 15px 16px',display:'grid',gap:13}}>
    <div role="status" style={{fontSize:12,lineHeight:1.65,fontWeight:650,color:offlineAppReady?'#237847':'#a45c21'}}>{offlineAppReady?(lang==='ko'?'앱 첫 화면 오프라인 준비 완료':'အက်ပ်အော့ဖ်လိုင်း အသင့်ဖြစ်ပါပြီ'):(lang==='ko'?'앱 오프라인 실행 파일 확인 중 · 인터넷 연결 후 앱을 다시 열어 주세요.':'အင်တာနက်ချိတ်ဆက်ပြီး အက်ပ်ကို ပြန်ဖွင့်ပါ။')}</div>
    <p style={{margin:0,fontSize:12,color:'var(--muted)',lineHeight:1.6}}>{lang==='ko'?'원하는 역본을 기기에 저장하면 인터넷 없이 읽을 수 있습니다. Wi-Fi에서 처음 다운로드하는 것을 권장합니다.':'လိုချင်သော ကျမ်းစာဘာသာပြန်ကို ဖုန်းတွင် သိမ်းထားပြီး အင်တာနက်မရှိဘဲ ဖတ်နိုင်ပါသည်။ Wi-Fi ဖြင့် ဒေါင်းလုဒ်လုပ်ရန် အကြံပြုပါသည်။'}</p>
    {offlineError.storage&&<p role="alert" style={{fontSize:12,color:'#b34949',margin:0}}>{offlineError.storage}</p>}
    {offlineVersions.map(item=><div key={item.id} style={{display:'grid',gap:8,padding:'12px 0',borderBottom:'1px solid var(--line)'}}>
      <strong style={{fontSize:13}}>{item.label}</strong>
      <div role="status" aria-live="polite" style={{fontSize:12,color:'var(--muted)',lineHeight:1.6}}>
        {offlineCounts[item.id]===books.length?(lang==='ko'?'66권 저장 완료 · 오프라인 읽기 가능':'၆၆ အုပ် သိမ်းပြီး · အင်တာနက်မလိုဘဲ ဖတ်နိုင်သည်'):(lang==='ko'? `저장된 성경 ${offlineCounts[item.id]||0}/66권`:`သိမ်းပြီး ${offlineCounts[item.id]||0}/၆၆ အုပ်`)}
      </div>
      <div role="progressbar" aria-label={item.label} aria-valuemin={0} aria-valuemax={books.length} aria-valuenow={offlineCounts[item.id]||0} style={{height:7,background:'var(--line)',borderRadius:9,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${(offlineCounts[item.id]||0)/books.length*100}%`,background:'#2875bd',transition:'width .15s'}}/>
      </div>
      {offlineError[item.id]&&<p role="alert" style={{margin:0,fontSize:12,color:'#b34949',lineHeight:1.6}}>{offlineError[item.id]}</p>}
      <button type="button" disabled={Boolean(offlineDownloading)||offlineCounts[item.id]===books.length||Boolean(offlineError.storage)} onClick={()=>downloadOffline(item.id)} style={{minHeight:43,background:'#286fbd',border:0,borderRadius:10,color:'#fff',padding:'9px 13px',font:'inherit',fontSize:13,fontWeight:700,opacity:(offlineDownloading&&offlineDownloading!==item.id)||offlineCounts[item.id]===books.length?.55:1}}>
        {offlineDownloading===item.id?(lang==='ko'?'다운로드 중…':'ဒေါင်းလုဒ် လုပ်နေသည်…'):offlineCounts[item.id]===books.length?(lang==='ko'?'다운로드 완료':'သိမ်းပြီးပါပြီ'):offlineCounts[item.id]?(lang==='ko'?'이어서 다운로드':'ဆက်လက် ဒေါင်းလုဒ်လုပ်ရန်'):(lang==='ko'?'오프라인 저장':'အော့ဖ်လိုင်း သိမ်းရန်')}
      </button>
    </div>)}
    <p style={{margin:0,fontSize:11,color:'var(--muted)',lineHeight:1.6}}>{lang==='ko'?'저장된 성경과 메모는 이 기기에 보관됩니다. 저장 공간을 확보하고 홈 화면에 앱을 추가하면 오프라인 실행이 더 편리합니다.':'ကျမ်းစာနှင့် မှတ်စုများကို ဤစက်တွင် သိမ်းထားပါသည်။ နေရာလွတ်ရှိရန် စစ်ဆေးပါ။'}</p>
  </div></div><div className="options-group"><div className="options-group-heading">{lang==='ko'?'앱 언어':'အက်ပ်ဘာသာစကား'}</div><div className="option-language-picker"><button className={lang==='ko'?'active':''} onClick={()=>changeLang('ko')} aria-pressed={lang==='ko'}>한국어</button><button className={lang==='my'?'active':''} onClick={()=>changeLang('my')} aria-pressed={lang==='my'}>မြန်မာ</button></div></div><div className="options-group"><div className="options-group-heading">{lang==='ko'?'읽기 환경':'ဖတ်ရှုမှုအပြင်အဆင်'}</div><button className="option-row" onClick={()=>setDark(!dark)}><span className="option-row-icon">{dark?<Moon size={18}/>:<Sun size={18}/>}</span><span className="option-row-copy"><strong>{lang==='ko'?'화면 테마':'မျက်နှာပြင်ပုံစံ'}</strong><small>{lang==='ko'?'밝게 또는 어둡게':'အလင်း သို့မဟုတ် အမှောင်'}</small></span><span className="option-status">{dark?(lang==='ko'?'다크':'အမှောင်'):(lang==='ko'?'라이트':'အလင်း')}</span></button><button className="option-row" onClick={()=>setShowVersions(true)}><span className="option-row-icon"><BookOpen size={18}/></span><span className="option-row-copy"><strong>{lang==='ko'?'성경 번역본':'ကျမ်းစာဘာသာပြန်'}</strong><small>{lang==='ko'?'읽을 역본과 함께 보기 설정':'ဖတ်မည့်ဘာသာပြန်ကို ရွေးချယ်ရန်'}</small></span><span className="option-chevron">›</span></button></div></section>}
<nav className="bottom-nav">{tabIds.map((id,i)=>{const Icon=navIcons[i];return <button key={id} className={tab===id?'nav-item selected':'nav-item'} onClick={()=>setTab(id)}><Icon size={20}/><span>{t.tabs[i]}</span></button>})}</nav>
    {showNavigator&&<div className="overlay navigator-overlay" onClick={()=>setShowNavigator(false)}><div className="navigator-modal" onClick={e=>e.stopPropagation()}><div className="navigator-head"><h2>{lang==='ko'?'성경 위치 선택':'ကျမ်းစာအုပ်၊ အခန်းနှင့် အငယ် ရွေးချယ်ရန်'}</h2><button onClick={()=>setShowNavigator(false)}><X/></button></div><div className="navigator-columns"><section className="navigator-books"><div className="navigator-section-label">{lang==='ko'?'성경':'ကျမ်းစာ'}</div>{books.map(b=><button key={b.code} className={book.code===b.code?'navigator-book selected':'navigator-book'} onClick={()=>{setBook(b);setChapter(1);setNavChapter(1)}}><span>{localBookName(b)}</span><small>{b.en}</small></button>)}</section><section className="navigator-chapters"><div className="navigator-section-label">{lang==='ko'?'장':'အခန်း'}</div>{Array.from({length:book.chapters},(_,i)=>i+1).map(n=><button key={n} className={navChapter===n?'navigator-number selected':'navigator-number'} onClick={()=>setNavChapter(n)}>{n} {lang==='ko'?'장':'အခန်း'}</button>)}</section><section className="navigator-verses"><div className="navigator-section-label">{lang==='ko'?'절':'အငယ်'}</div>{Array.from({length:Math.max(1,...((primaryVersion==='my'?burmeseBook:primaryVersion==='kjv'?kjvBook:primaryVersion==='niv'?nivBook:koreanBook)?.chapters?.[navChapter]||[]).map(v=>Number(String(v.number).split('-').pop())||0))},(_,i)=>i+1).map(n=><button key={n} className={selectedVerse===n?"navigator-number selected":"navigator-number"} onClick={()=>{setChapter(navChapter);setSelectedVerse(n);setShowNavigator(false);setTimeout(()=>document.getElementById('verse-'+n)?.scrollIntoView({behavior:'smooth',block:'start'}),120)}}>{n} {lang==='ko'?'절':'ပိုဒ်'}</button>)}</section></div><div className="navigator-current"><strong>{bookTitle} {navChapter}{lang==='ko'?'장':' အခန်း'}</strong><button onClick={()=>{setChapter(navChapter);setShowNavigator(false)}}>{lang==='ko'?'이 장 열기':'အခန်းဖွင့်ရန်'}</button></div></div></div>}
    {showVersions&&<div className="overlay version-overlay" onClick={()=>setShowVersions(false)}><div className="version-modal" onClick={e=>e.stopPropagation()}><div className="version-modal-head"><h2>{lang==='ko'?'성경 역본 선택':'ကျမ်းစာဘာသာပြန် ရွေးချယ်ရန်'}</h2><button onClick={()=>setShowVersions(false)} aria-label="닫기"><X/></button></div><div className="version-columns"><section className="version-column"><h3>{lang==='ko'?'기본 역본':'အဓိကဘာသာပြန်'}</h3>{[{id:'my',label:'Judson Burmese'},{id:'kjv',label:'King James Version (KJV)'},{id:'niv',label:'New International Version (NIV)'},{id:'ko',label:'개역개정'}].map(v=><button key={v.id} className={primaryVersion===v.id?'version-option chosen':'version-option'} onClick={()=>{setVersion('primary',v.id);setShowVersions(false)}}><span>{v.label}</span>{primaryVersion===v.id&&<Check size={20}/>}</button>)}</section><section className="version-column"><h3>{lang==='ko'?'두 번째 역본':'ဒုတိယဘာသာပြန်'}</h3><button className={!compare?'version-option chosen':'version-option'} onClick={()=>{setCompare(false);localStorage.setItem('bible-compare','false');setShowVersions(false)}}><span>{lang==='ko'?'선택 안 함':'မရွေးချယ်ပါ'}</span>{!compare&&<Check size={20}/>}</button>{[{id:'my',label:'Judson Burmese'},{id:'kjv',label:'King James Version (KJV)'},{id:'niv',label:'New International Version (NIV)'},{id:'ko',label:'개역개정'}].map(v=><button key={v.id} className={compare&&secondaryVersion===v.id?'version-option chosen':'version-option'} onClick={()=>{setVersion('secondary',v.id);setCompare(true);localStorage.setItem('bible-compare','true');setShowVersions(false)}}><span>{v.label}</span>{compare&&secondaryVersion===v.id&&<Check size={20}/>}</button>)}</section></div></div></div>}
    {showBooks&&<div className="overlay" onClick={()=>setShowBooks(false)}><div className="sheet" onClick={e=>e.stopPropagation()}><div className="sheet-head"><h2>{t.choose}</h2><button className="icon-btn" onClick={()=>setShowBooks(false)}><X/></button></div>{books.map(b=><button className="book-result" key={b.en} onClick={()=>{setBook(b);setChapter(1);setShowBooks(false)}}><BookOpen/><span>{localBookName(b)}{lang==='my'&&<small>{b.en}</small>}</span><ChevronRight/></button>)}</div></div>}
    {showCopyModal&&<div className="overlay copy-overlay" onClick={()=>setShowCopyModal(false)}><div className="copy-modal" onClick={e=>e.stopPropagation()}><div className="copy-modal-head"><h2>{lang==='ko'?'복사할 역본 선택 (최대 2개)':'ကူးယူမည့် ဘာသာပြန်ရွေးချယ်ရန် (၂ ခုအထိ)'}</h2><button onClick={()=>setShowCopyModal(false)} aria-label="close"><X/></button></div><p className="copy-version-hint">{lang==='ko'?'두 역본을 선택하면 각각 구절 번호와 함께 한 번에 복사됩니다.':'ဘာသာပြန်နှစ်ခုရွေးပါက တစ်ကြိမ်တည်း ကူးယူနိုင်ပါသည်။'}</p><div className="copy-version-list">{[{id:'my',label:'Judson Burmese'},{id:'ko',label:'개역개정'},{id:'niv',label:'New International Version (NIV)'},{id:'kjv',label:'King James Version (KJV)'}].map(v=><button key={v.id} className={copyVersions.includes(v.id)?'copy-version-option selected':'copy-version-option'} onClick={()=>setCopyVersions(current=>current.includes(v.id)?current.filter(x=>x!==v.id):current.length<2?[...current,v.id]:current)}><span>{v.label}</span>{copyVersions.includes(v.id)&&<Check size={18}/>}</button>)}</div><div className="copy-modal-actions"><button className="copy-cancel" onClick={()=>setShowCopyModal(false)}>{lang==='ko'?'취소':'ပယ်ဖျက်'}</button><button className="copy-confirm" disabled={copyVersions.length===0} onClick={async()=>{try{const blocks=await Promise.all(copyVersions.map(async id=>{const loader=id==='my'?loadBurmeseBook:id==='ko'?loadKoreanBook:id==='niv'?loadNIVBook:loadKJVBook;const data=await loader(book);const entries=data?.chapters?.[chapter]||[];const chosen=entries.filter(v=>copySelection.includes(String(v.number)));const ref=bookTitle+' '+chapter+':'+copySelection.join(',');return ref+' ('+versionNames[id]+')\n'+chosen.map(v=>v.number+' '+v.text).join('\n')}));await navigator.clipboard.writeText(blocks.join('\n\n────────────────────\n\n'));setShowCopyModal(false);setCopyMode(false);setCopySelection([]);setCopyToast(lang==='ko'?'두 역본이 클립보드에 복사되었습니다':'ဘာသာပြန်နှစ်ခု ကူးယူပြီးပါပြီ');setTimeout(()=>setCopyToast(''),2500)}catch(e){setCopyToast(lang==='ko'?'복사에 실패했습니다.':'ကူးယူ၍ မရပါ');setTimeout(()=>setCopyToast(''),2200)}}}>{lang==='ko'?'선택한 역본 복사':'ကူးယူရန်'}</button></div></div></div>}{showNote&&<div role="presentation" onClick={()=>setShowNote(false)} style={{position:'fixed',inset:0,zIndex:110,background:'rgba(20,24,30,.58)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div role="dialog" aria-modal="true" aria-label={t.personalNote} onClick={e=>e.stopPropagation()} style={{width:'min(100%,440px)',maxHeight:'min(85dvh,690px)',overflowY:'auto',background:'var(--surface)',color:'var(--text)',borderRadius:18,padding:18,boxShadow:'0 16px 50px rgba(0,0,0,.22)',display:'flex',flexDirection:'column',gap:13}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}><strong>{t.personalNote} · {bookTitle} {chapter}:{noteMode==='edit'?noteEditVerses.join(', '):noteVerses.join(', ')}</strong><button aria-label={lang==='ko'?'닫기':'ပိတ်ရန်'} onClick={()=>setShowNote(false)} style={{border:0,background:'transparent',color:'var(--text)',padding:6}}><X size={20}/></button></div>
        {noteMode==='list'?<>
          <div style={{display:'flex',flexDirection:'column',gap:9}}>
            {notesForVerses(noteVerses).length===0&&<p style={{fontSize:13,color:'var(--muted)'}}>{lang==='ko'?'작성된 메모가 없습니다.':'မှတ်စု မရှိသေးပါ။'}</p>}
            {notesForVerses(noteVerses).map((item,index)=><div key={item.id} style={{border:'1px solid var(--line)',borderRadius:12,padding:12,background:'var(--bg)'}}>
              <div style={{fontSize:11,color:'var(--muted)',marginBottom:6}}>{lang==='ko'?'메모':'မှတ်စု'} {index+1} · {bookTitle} {chapter}:{item.verses.join(', ')}</div>
              <div style={{fontSize:11,color:'var(--muted)',marginBottom:8,lineHeight:1.55}}>{item.createdAt?(lang==='ko'?'작성: ':'ရေးသားချိန်: ')+formatNoteTime(item.createdAt):item.updatedAt?(lang==='ko'?'수정: ':'ပြင်ဆင်ချိန်: ')+formatNoteTime(item.updatedAt):(lang==='ko'?'이전 메모 · 작성 날짜 기록 없음':'မှတ်စုဟောင်း · ရက်စွဲမရှိ')}{item.createdAt&&item.updatedAt&&<span style={{display:'block'}}>{(lang==='ko'?'수정: ':'ပြင်ဆင်ချိန်: ')+formatNoteTime(item.updatedAt)}</span>}</div>
              <p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',margin:'0 0 12px',fontSize:13,lineHeight:1.7}}>{renderNoteText(item.text)}</p>
              <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
                <button onClick={()=>editSavedNote(item)} style={{border:'1px solid var(--line)',borderRadius:8,background:'var(--surface)',color:'var(--text)',padding:'7px 12px',font:'inherit',fontSize:12}}>{lang==='ko'?'수정':'ပြင်ဆင်ရန်'}</button>
                <button onClick={()=>deleteNote(item)} style={{border:'1px solid #efb5b5',borderRadius:8,background:'transparent',color:'#b14343',padding:'7px 12px',font:'inherit',fontSize:12}}>{lang==='ko'?'삭제':'ဖျက်ရန်'}</button>
              </div>
            </div>)}
          </div>
          <button onClick={beginNewNote} style={{width:'100%',border:0,borderRadius:10,background:'#435d7c',color:'#fff',padding:'12px 15px',font:'inherit',fontWeight:700}}>{lang==='ko'?'+ 새 메모 추가':'+ မှတ်စုအသစ် ရေးရန်'}</button>
        </>:<>
          <button type="button" className="menu-return-button" onClick={openQuoteAtCursor} style={{alignSelf:'flex-start'}}><span style={{fontWeight:700}}>@</span> {lang==='ko'?'성경 인용':'ကျမ်းပိုဒ် ကိုးကားရန်'}</button>
          <textarea ref={noteInputRef} aria-label={t.personalNote} placeholder={t.writeNote} value={note} onChange={changeNoteText} rows={6} style={{width:'100%',minHeight:150,resize:'vertical',border:'1px solid var(--line)',borderRadius:10,background:'var(--bg)',color:'var(--text)',padding:12,font:'inherit',fontSize:14,lineHeight:1.7}}/>
          <div style={{display:'flex',justifyContent:'flex-end',flexWrap:'wrap',gap:8}}>
            {noteTarget&&<button onClick={()=>deleteNote({id:noteTarget})} style={{border:'1px solid #efb5b5',background:'transparent',color:'#b14343',borderRadius:9,padding:'10px 13px',font:'inherit'}}>{lang==='ko'?'삭제':'ဖျက်ရန်'}</button>}
            <button onClick={()=>{setNoteMode('list');setNoteTarget(null);setNote('')}} style={{border:'1px solid var(--line)',background:'var(--surface2)',color:'var(--text)',borderRadius:9,padding:'10px 13px',font:'inherit'}}>{lang==='ko'?'목록':'စာရင်း'}</button>
            <button onClick={saveNote} disabled={!note.trim()} style={{border:0,background:'#435d7c',opacity:note.trim()?1:0.45,color:'#fff',borderRadius:9,padding:'10px 17px',font:'inherit',fontWeight:700}}>{t.keep}</button>
          </div>
        </>}
      </div>
    </div>}
    {showNote&&quotePicker&&<div className="overlay navigator-overlay" style={{zIndex:120}} onClick={()=>setQuotePicker(null)}>
      <div className="navigator-modal" role="dialog" aria-modal="true" aria-label={lang==='ko'?'성경 인용':'ကျမ်းပိုဒ် ကိုးကားရန်'} onClick={e=>e.stopPropagation()}>
        <div className="navigator-head"><h2>{lang==='ko'?'성경 인용':'ကျမ်းပိုဒ် ကိုးကားရန်'}</h2><button type="button" onClick={()=>setQuotePicker(null)} aria-label={lang==='ko'?'닫기':'ပိတ်ရန်'}><X/></button></div>
        <div style={{padding:'8px 14px'}}><label className="version-picker"><span>{lang==='ko'?'인용할 역본':'ကိုးကားမည့် ကျမ်းစာဘာသာပြန်'}</span><select value={quotePicker.version} onChange={e=>{setQuoteData(null);setQuoteLoading(true);setQuotePicker(p=>({...p,version:e.target.value,verses:[]}))}}>{Object.entries(versionNames).map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label></div>
        <div className="navigator-columns">
          <section className="navigator-books"><div className="navigator-section-label">{lang==='ko'?'성경':'ကျမ်းစာ'}</div>{books.map(b=><button type="button" key={b.code} className={quotePicker.book.code===b.code?'navigator-book selected':'navigator-book'} onClick={()=>{if(b.code!==quotePicker.book.code){setQuoteData(null);setQuoteLoading(true)}setQuotePicker(p=>({...p,book:b,chapter:1,verses:[]}))}}><span>{localBookName(b)}</span><small>{b.en}</small></button>)}</section>
          <section className="navigator-chapters"><div className="navigator-section-label">{lang==='ko'?'장':'အခန်း'}</div>{Array.from({length:quotePicker.book.chapters},(_,i)=>i+1).map(n=><button type="button" key={n} className={quotePicker.chapter===n?'navigator-number selected':'navigator-number'} onClick={()=>setQuotePicker(p=>({...p,chapter:n,verses:[]}))}>{n} {lang==='ko'?'장':'အခန်း'}</button>)}</section>
          <section className="navigator-verses"><div className="navigator-section-label">{lang==='ko'?'절':'အငယ်'}</div>{quoteLoading?<small style={{padding:8}}>{lang==='ko'?'불러오는 중':'ဖွင့်နေသည်'}</small>:quoteError||!quoteEntries.length?<small style={{padding:8}}>{lang==='ko'?'본문을 불러오지 못했습니다.':'ကျမ်းစာ ဖွင့်၍မရပါ။'}</small>:quoteEntries.map(v=><button type="button" key={v.number} className={quotePicker.verses.includes(String(v.number))?'navigator-number selected':'navigator-number'} onClick={()=>setQuotePicker(p=>({...p,verses:p.verses.includes(String(v.number))?p.verses.filter(n=>n!==String(v.number)):[...p.verses,String(v.number)]}))}>{v.number} {lang==='ko'?'절':'ပိုဒ်'}</button>)}</section>
        </div>
        <div className="navigator-current"><strong>{localBookName(quotePicker.book)} {quotePicker.chapter}{chosenQuoteEntries.length?':'+chosenQuoteEntries.map(v=>v.number).join(', '):lang==='ko'?'장':' အခန်း'}</strong><button type="button" disabled={quoteLoading||!chosenQuoteEntries.length} style={{opacity:(quoteLoading||!chosenQuoteEntries.length)?0.45:1}} onClick={insertQuote}>{lang==='ko'?'구절 삽입':'ကျမ်းပိုဒ် ထည့်ရန်'}</button></div>
      </div>
    </div>}{originalTarget&&<OriginalLanguageDialog target={originalTarget} lang={lang} onClose={()=>setOriginalTarget(null)}/>}{copyToast&&<div className="copy-toast">{copyToast}</div>}  </main>
}
