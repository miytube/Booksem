import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen, Headphones, Mic, PenTool, ShoppingBag,
  Play, Pause, Star, Upload, Search, MessageSquare,
  Video, Users, Volume2, ShieldCheck, Heart, Share2,
  CheckCircle, ArrowRight, SkipBack, SkipForward, RotateCcw, RotateCw, Moon, List,
  Lock, Unlock, Sparkles, Check, X, Loader2
} from 'lucide-react';

const STRIPE_ALL_ACCESS_URL = 'https://buy.stripe.com/cNi5kwgEae2K0M88Qw6kg00';
const STRIPE_SINGLE_BOOK_URLS = {
  '1': 'https://buy.stripe.com/8x27sE73A4sa0M8giY6kg01',
  '2': 'https://buy.stripe.com/5kQ14ggEaaQy1QcaYE6kg02',
  '3': 'https://buy.stripe.com/9B6bIUfA61fYeCYeaQ6kg03',
  '4': 'https://buy.stripe.com/aFaeV60Fc7Em3Yk8Qw6kg04',
  '5': 'https://buy.stripe.com/eVq00c87E9MufH21o46kg05',
  '6': 'https://buy.stripe.com/9B6dR20Fc0bUdyU3wc6kg06',
  '7': 'https://buy.stripe.com/aFa6oA5Zw6AifH2giY6kg07',
  '8': 'https://buy.stripe.com/5kQ4gs5ZwaQy9iE2s86kg08',
  '9': 'https://buy.stripe.com/3cI8wIfA69MugL6giY6kg09',
  '10': 'https://buy.stripe.com/14A9AMew22k20M80k06kg0a',
  '11': 'https://buy.stripe.com/5kQ5kwew22k2dyU5Ek6kg0b',
  '12': 'https://buy.stripe.com/3cI9AM4Vs3o6cuQd6M6kg0c',
};
const FREE_BOOK_IDS = ['13','14','15','16','17','18','19'];
const READING_LOUNGES = [
  { id: 'stoic', emoji: '🏛️', name: 'The Stoic & Strategy Study', mood: 'Polished oak, warm lantern light, calm focus.', ambience: 'fire', books: ['1','3','4','5'], gradient: 'from-amber-900/60 via-slate-900 to-slate-950' },
  { id: 'wealth', emoji: '💼', name: 'The Wealth & Enterprise Lounge', mood: 'An executive library with a quiet coffeehouse hum.', ambience: 'cafe', books: ['2','6'], gradient: 'from-emerald-900/60 via-slate-900 to-slate-950' },
  { id: 'gothic', emoji: '🕯️', name: 'The Gothic & Mystery Parlor', mood: 'Candlelit hearth and soft rain against the window.', ambience: 'rain', books: ['7','8','10','13','16','17','19'], gradient: 'from-purple-950/70 via-slate-900 to-slate-950' },
  { id: 'classic', emoji: '☕', name: 'The Classic Literature Salon', mood: 'A sunlit courtyard for long afternoons with great stories.', ambience: 'cafe', books: ['9','11','12','14','18'], gradient: 'from-rose-900/50 via-slate-900 to-slate-950' },
  { id: 'stage', emoji: '🎭', name: 'The Radio & Theatre Stage', mood: 'Velvet curtains, a warm spotlight, full-cast stories.', ambience: 'cafe', books: ['15','16','17','18','19','13'], gradient: 'from-red-950/60 via-slate-900 to-slate-950' },
];

function useAmbience() {
  const ctxRef = useRef(null);
  const nodesRef = useRef(null);
  const [kind, setKind] = useState(null);
  const stop = () => {
    if (nodesRef.current) { try { nodesRef.current.forEach(n => n.stop ? n.stop() : n.disconnect()); } catch (_) {} nodesRef.current = null; }
    setKind(null);
  };
  const start = (type) => {
    stop();
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const ctx = ctxRef.current || new AC(); ctxRef.current = ctx; ctx.resume();
    const len = ctx.sampleRate * 2; const buf = ctx.createBuffer(1, len, ctx.sampleRate); const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1;
      if (type === 'fire') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5 + (Math.random() < 0.0004 ? (Math.random() - 0.5) * 1.5 : 0); }
      else if (type === 'cafe') { last = (last + 0.05 * w) / 1.05; d[i] = last * 2.5; }
      else d[i] = w * 0.5; }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = type === 'rain' ? 'highpass' : 'lowpass';
    filter.frequency.value = type === 'rain' ? 900 : type === 'fire' ? 600 : 1200;
    const gain = ctx.createGain(); gain.gain.value = type === 'rain' ? 0.12 : 0.25;
    src.connect(filter).connect(gain).connect(ctx.destination); src.start();
    nodesRef.current = [src, gain]; setKind(type);
  };
  useEffect(() => () => stop(), []);
  return { kind, start, stop };
}

export default function BooksemApp() {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [activeLounge, setActiveLounge] = useState(null);
  const ambience = useAmbience();
  const [loungeNotes, setLoungeNotes] = useState(() => { try { return JSON.parse(localStorage.getItem('booksem_lounge_notes') || '{}'); } catch (_) { return {}; } });
  const [noteDraft, setNoteDraft] = useState('');
  const saveLoungeNote = () => {
    if (!activeLounge || !noteDraft.trim()) return;
    const list = [{ text: noteDraft.trim(), at: new Date().toLocaleDateString() }, ...(loungeNotes[activeLounge] || [])];
    const updated = { ...loungeNotes, [activeLounge]: list };
    setLoungeNotes(updated); localStorage.setItem('booksem_lounge_notes', JSON.stringify(updated)); setNoteDraft('');
  };
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [cartCount, setCartCount] = useState(0);
  const [fontSize, setFontSize] = useState(18); // px

  const audioRef = useRef(null);
  const savedState = (() => { try { return JSON.parse(localStorage.getItem('booksem_player') || '{}'); } catch { return {}; } })();
  const [selectedBookId, setSelectedBookId] = useState(savedState.bookId || '1');
  const [chapterIdx, setChapterIdx] = useState(0);
  const [sleepMode, setSleepMode] = useState(null); // null | minutes number | 'chapter'
  const [sleepEndsAt, setSleepEndsAt] = useState(null);
  const [showChapters, setShowChapters] = useState(true);
  const resumeTimeRef = useRef(0);
  const autoPlayRef = useRef(false);

  // Paywall & Membership State
  const [unlockedBooks, setUnlockedBooks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('booksem_unlocked_books') || '[]'); } catch { return []; }
  });
  const [hasMonthlyPass, setHasMonthlyPass] = useState(() => {
    return localStorage.getItem('booksem_has_pass') === 'true';
  });
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [paywallTargetBook, setPaywallTargetBook] = useState(null);
  const [purchaseFormat, setPurchaseFormat] = useState('audio');

  const isBookUnlocked = (bookId) => {
    if (FREE_BOOK_IDS.includes(bookId)) return true;
    if (hasMonthlyPass) return true;
    return unlockedBooks.includes(bookId);
  };

  const isChapterUnlocked = (bookId, trackIdx) => {
    if (trackIdx === 0) return true; // Chapter 1 is always 100% free preview
    return isBookUnlocked(bookId);
  };

  // Stripe return: unlock All-Access after checkout redirects back
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success' && params.get('type') === 'subscription') {
      setHasMonthlyPass(true);
      localStorage.setItem('booksem_has_pass', 'true');
      window.history.replaceState({}, '', window.location.pathname);
      alert('Thank you! Your Booksem All-Access Pass is active. Enjoy every audiobook.');
    } else if (params.get('payment') === 'success' && params.get('book_id')) {
      const bid = params.get('book_id');
      setUnlockedBooks(prev => {
        const updated = prev.includes(bid) ? prev : [...prev, bid];
        localStorage.setItem('booksem_unlocked_books', JSON.stringify(updated));
        return updated;
      });
      window.history.replaceState({}, '', window.location.pathname);
      alert('Thank you! Your purchase is complete. This audiobook is now unlocked.');
    }
  }, []);

  const unlockBook = (bookId) => {
    const updated = unlockedBooks.includes(bookId) ? unlockedBooks : [...unlockedBooks, bookId];
    setUnlockedBooks(updated);
    localStorage.setItem('booksem_unlocked_books', JSON.stringify(updated));
  };

  const sampleBooks = [
    {
      id: '1',
      title: 'The Art of War',
      author: 'Sun Tzu',
      genre: 'Non-Fiction',
      format: 'Audiobook & E-Book',
      price: 3.99,
      rating: 4.9,
      reviewsCount: 1420,
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
      description: 'The definitive ancient military treatise on strategy, tactical psychology, and overcoming conflict without confrontation.'
    },
    {
      id: '2',
      title: 'Think and Grow Rich',
      author: 'Napoleon Hill',
      genre: 'Self-Help',
      format: 'Audiobook & E-Book',
      price: 4.99,
      rating: 4.8,
      reviewsCount: 2840,
      cover: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=400',
      description: 'The world-famous philosophy of individual achievement, perseverance, and turning burning desire into lasting wealth.'
    },
    {
      id: '3',
      title: 'Meditations',
      author: 'Marcus Aurelius',
      genre: 'Philosophy',
      format: 'Audiobook & E-Book',
      price: 3.99,
      rating: 4.9,
      reviewsCount: 3105,
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
      description: 'Private spiritual journals of the Roman Emperor on emotional resilience, duty, and stoic inner peace.'
    },
    {
      id: '4',
      title: 'The Republic',
      author: 'Plato',
      genre: 'Philosophy',
      format: 'Audiobook & E-Book',
      price: 3.99,
      rating: 4.7,
      reviewsCount: 3120,
      cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
      description: 'Plato\'s timeless dialogue on justice, the ideal city, and the philosopher-king, featuring the famous Allegory of the Cave.'
    },
    {
      id: '5',
      title: 'The Prince',
      author: 'Niccolò Machiavelli',
      genre: 'Politics',
      format: 'Audiobook & E-Book',
      price: 3.99,
      rating: 4.7,
      reviewsCount: 980,
      cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=400',
      description: 'The foundational Renaissance handbook on acquiring, wielding, and maintaining sovereign power.'
    },
    {
      id: '6',
      title: 'The Science of Getting Rich',
      author: 'Wallace D. Wattles',
      genre: 'Self-Help',
      format: 'Audiobook & E-Book',
      price: 3.99,
      rating: 4.6,
      reviewsCount: 1120,
      cover: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=400',
      description: 'A pragmatic guide to mental discipline, creative thought, and purposeful action for financial abundance.'
    },
    {
      id: '7',
      title: 'Dracula',
      author: 'Bram Stoker',
      genre: 'Horror',
      format: 'Audiobook & E-Book',
      price: 2.99,
      rating: 4.8,
      reviewsCount: 2450,
      cover: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=400',
      description: 'The Gothic horror classic of Count Dracula’s attempt to move from Transylvania to England.'
    },
    {
      id: '8',
      title: 'Frankenstein',
      author: 'Mary Shelley',
      genre: 'Sci-Fi / Classics',
      format: 'Audiobook & E-Book',
      price: 2.99,
      rating: 4.7,
      reviewsCount: 3890,
      cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
      description: 'The legendary tale of Victor Frankenstein and the sentient creature brought to life by unorthodox science.'
    },
    {
      id: '9',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Classics',
      format: 'Audiobook & E-Book',
      price: 3.99,
      rating: 4.9,
      reviewsCount: 6100,
      cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400',
      description: 'A portrait of the Jazz Age, obsessed love, wealth, and illusion on Long Island’s Gold Coast.'
    },
    {
      id: '10',
      title: 'The Picture of Dorian Gray',
      author: 'Oscar Wilde',
      genre: 'Philosophical Fiction',
      format: 'Audiobook & E-Book',
      price: 2.99,
      rating: 4.8,
      reviewsCount: 1980,
      cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=400',
      description: 'A decadent tale of aestheticism, moral corruption, and a portrait that bears the sins of eternal youth.'
    },
    {
      id: '11',
      title: 'A Tale of Two Cities',
      author: 'Charles Dickens',
      genre: 'Historical Fiction',
      format: 'Audiobook & E-Book',
      price: 3.99,
      rating: 4.7,
      reviewsCount: 2310,
      cover: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=400',
      description: 'Set in London and Paris before and during the French Revolution, depicting love, sacrifice, and rebirth.'
    },
    {
      id: '12',
      title: 'The Prophet',
      author: 'Kahlil Gibran',
      genre: 'Poetry & Philosophy',
      format: 'Audiobook & E-Book',
      price: 2.99,
      rating: 4.9,
      reviewsCount: 1750,
      cover: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400',
      description: 'A poetic spiritual collection of twenty-eight fables offering wisdom on love, work, sorrow, freedom, and time.'
    },
    {
      id: '13',
      title: 'The Shadow Over Innsmouth',
      author: 'H.P. Lovecraft (BBC Radio)',
      genre: 'Horror',
      format: 'Free Audio Drama',
      price: 0,
      free: true,
      rating: 4.8,
      reviewsCount: 0,
      cover: 'https://dfwbddmckfzfocpruvtj.supabase.co/storage/v1/object/public/thumbnails/ca1dd9ce-a87c-414c-8efb-83570e2cde9b/1792991682389-mbj14r.jpg',
      description: 'A traveler uncovers the terrible secret of a decaying seaside town in this chilling BBC Radio adaptation.'
    },
    {
      id: '14',
      title: 'The Inheritance Clause',
      author: 'Regency Romance',
      genre: 'Romance',
      format: 'Free Audio Drama',
      price: 0,
      free: true,
      rating: 4.8,
      reviewsCount: 0,
      cover: 'https://dfwbddmckfzfocpruvtj.supabase.co/storage/v1/object/public/thumbnails/ca1dd9ce-a87c-414c-8efb-83570e2cde9b/1792991530388-q213cq.jpg',
      description: 'A full-length Regency romance where a strange clause in a will forces an unlikely match.'
    },
    {
      id: '15',
      title: 'Indiana Jones and the Well of Life',
      author: 'Audio Drama ft. Jerry Scullion',
      genre: 'Adventure',
      format: 'Free Audio Drama',
      price: 0,
      free: true,
      rating: 4.8,
      reviewsCount: 0,
      cover: 'https://dfwbddmckfzfocpruvtj.supabase.co/storage/v1/object/public/thumbnails/ca1dd9ce-a87c-414c-8efb-83570e2cde9b/1792991323378-f94qps.jpg',
      description: 'A cinematic adventure audio drama following Indy on the hunt for a legendary source of life.'
    },
    {
      id: '16',
      title: 'Columbo: Murder by the Book',
      author: 'Radio Mystery Theatre',
      genre: 'Mystery',
      format: 'Free Audio Drama',
      price: 0,
      free: true,
      rating: 4.8,
      reviewsCount: 0,
      cover: 'https://dfwbddmckfzfocpruvtj.supabase.co/storage/v1/object/public/thumbnails/ca1dd9ce-a87c-414c-8efb-83570e2cde9b/1792991093407-b0nix.jpg',
      description: 'The rumpled lieutenant takes on a mystery writer who thinks he has planned the perfect murder.'
    },
    {
      id: '17',
      title: 'The Book Club Blunder',
      author: 'Inspector Purbright (BBC Radio)',
      genre: 'Mystery',
      format: 'Free Audio Drama',
      price: 0,
      free: true,
      rating: 4.8,
      reviewsCount: 0,
      cover: 'https://dfwbddmckfzfocpruvtj.supabase.co/storage/v1/object/public/thumbnails/ca1dd9ce-a87c-414c-8efb-83570e2cde9b/1792991366376-lpns4.jpg',
      description: 'A cozy English village mystery with Inspector Purbright, from BBC Radio.'
    },
    {
      id: '18',
      title: 'Blithe Spirit',
      author: 'Noel Coward (BBC Theatre)',
      genre: 'Classic Comedy',
      format: 'Free Audio Drama',
      price: 0,
      free: true,
      rating: 4.8,
      reviewsCount: 0,
      cover: 'https://dfwbddmckfzfocpruvtj.supabase.co/storage/v1/object/public/thumbnails/ca1dd9ce-a87c-414c-8efb-83570e2cde9b/1792991155387-tlrqk8p.jpg',
      description: 'A seance goes hilariously wrong when the late first wife of a novelist returns to haunt his new marriage.'
    },
    {
      id: '19',
      title: 'The Rotted Crown',
      author: 'Full Cast Audio Drama',
      genre: 'Dark Fantasy',
      format: 'Free Audio Drama',
      price: 0,
      free: true,
      rating: 4.8,
      reviewsCount: 0,
      cover: 'https://dfwbddmckfzfocpruvtj.supabase.co/storage/v1/object/public/thumbnails/ca1dd9ce-a87c-414c-8efb-83570e2cde9b/1792991192532-jhh74f.jpg',
      description: 'A grim full-cast fantasy of a cursed throne and the kingdom rotting beneath it.'
    }
  ];

  // COMPLETE CHAPTER PLAYLISTS FOR ALL 12 BOOKS (Verified Direct Archive Endpoints)
  const BOOK_CHAPTERS = {
    '13': [['Full Drama (2h 22m)', 'https://miytube.s3.us-east-1.amazonaws.com/videos/The_Shadow_Over_Insmouth_-_H.P._Lovecraft_-_BBC_Radio-be7325.mp4']],
    '14': [['Full Audiobook (2h 23m)', 'https://miytube.s3.us-east-1.amazonaws.com/videos/The_Inheritance_Clause_Full-Length_Regency_Romance_Audiobook-cbb9f4.mp4']],
    '15': [['Full Drama (1h 45m)', 'https://miytube.s3.us-east-1.amazonaws.com/videos/Indiana_Jones_and_the_Well_Of_Life_AudioBook_Audio_Drama_Featuring_Jerry_Scullion-81fa64.mp4']],
    '16': [['Full Drama (1h 55m)', 'https://miytube.s3.us-east-1.amazonaws.com/videos/Audio_Drama_-_Columbo_MURDER_BY_THE_BOOK-6788eb.mp4']],
    '17': [['Full Drama (1h 11m)', 'https://miytube.s3.us-east-1.amazonaws.com/videos/The_Book_Club_Blunder_Inspector_Purbright_Mysteries_BBC_Radio_Drama-653764.mp4']],
    '18': [['Full Drama (1h 27m)', 'https://miytube.s3.us-east-1.amazonaws.com/videos/Blithe_Spirit_Noel_Coward_-_BBC_Saturday_Night_Theatre_Classic_Chesterton_Radio_Drama-5995b9.mp4']],
    '19': [['Full Drama (31m)', 'https://miytube.s3.us-east-1.amazonaws.com/videos/Dark_Fantasy_Audiobook_The_Rotted_Crown_Full_Cast_Audio_Drama-d0c46d.mp4']],
    '1': [
      ['Chapters 1-2: Laying Plans & Waging War', 'https://archive.org/download/art_of_war_librivox/art_of_war_01-02_sun_tzu_64kb.mp3'],
      ['Chapters 3-4: Attack by Stratagem & Tactical Dispositions', 'https://archive.org/download/art_of_war_librivox/art_of_war_03-04_sun_tzu_64kb.mp3'],
      ['Chapters 5-6: Energy & Weak Points and Strong', 'https://archive.org/download/art_of_war_librivox/art_of_war_05-06_sun_tzu_64kb.mp3'],
      ['Chapters 7-8: Maneuvering & Variation in Tactics', 'https://archive.org/download/art_of_war_librivox/art_of_war_07-08_sun_tzu_64kb.mp3'],
      ['Chapters 9-10: The Army on the March & Terrain', 'https://archive.org/download/art_of_war_librivox/art_of_war_09-10_sun_tzu_64kb.mp3'],
      ['Chapter 11: The Nine Situations', 'https://archive.org/download/art_of_war_librivox/art_of_war_11_sun_tzu_64kb.mp3'],
      ['Chapters 12-13: Attack by Fire & The Use of Spies', 'https://archive.org/download/art_of_war_librivox/art_of_war_12-13_sun_tzu_64kb.mp3']
    ],
    '2': (() => {
      const base = 'https://archive.org/download/think-and-grow-rich_202408/';
      return [
        ['Chapter 1 Part 1: Introduction & Desire', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%201%20Part%201.mp3'],
        ['Chapter 1 Part 2: The Three Feet from Gold', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%201%20Part%202.mp3'],
        ['Chapter 1 Part 3: Fifty-Six Words That Count', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%201%20Part%203.mp3'],
        ['Chapter 2 Part 1: Desire — The Turning Point', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%202%20Part%201.mp3'],
        ['Chapter 2 Part 2: Six Steps to Riches', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%202%20Part%202.mp3'],
        ['Chapter 3 Part 1: Faith — Visualization of Desire', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%203%20Part%201.mp3'],
        ['Chapter 3 Part 2: Self-Confidence Formula', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%203%20Part%202.mp3'],
        ['Chapter 4 Part 1: Auto-Suggestion', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%204%20Part%201.mp3'],
        ['Chapter 5 Part 1: Specialized Knowledge', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%205%20Part%201.mp3'],
        ['Chapter 6 Part 1: Imagination — The Workshop', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%206%20Part%201.mp3'],
        ['Chapter 7 Part 1: Organized Planning', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%207%20Part%201.mp3'],
        ['Chapter 8 Part 1: Decision — Mastery of Procrastination', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%208%20Part%201.mp3'],
        ['Chapter 9 Part 1: Persistence', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%209%20Part%201.mp3'],
        ['Chapter 10 Part 1: Power of the Master Mind', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2010%20Part%201.mp3'],
        ['Chapter 11 Part 1: The Subconscious Mind', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2011%20Part%201.mp3'],
        ['Chapter 12 Part 1: The Brain — A Broadcasting Station', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2012%20Part%201.mp3'],
        ['Chapter 13 Part 1: The Sixth Sense', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2013%20Part%201.mp3'],
        ['Chapter 14 Part 1: How to Outwit the Six Ghosts of Fear', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2014%20Part%201.mp3']
      ];
    })(),
        // 3. Meditations (Marcus Aurelius) - Verified LibriVox
    3: (() => {
      const base = 'https://archive.org/download/meditations_0708_librivox/';
      return [
        ['Book 1: Debts and Lessons', base + 'meditations_01_marcusaurelius.mp3'],
        ['Book 2: On the River Gran, Among the Quadi', base + 'meditations_02_marcusaurelius.mp3'],
        ['Book 3: In Carnuntum', base + 'meditations_03_marcusaurelius.mp3'],
        ['Book 4: The Inner Citadel', base + 'meditations_04_marcusaurelius.mp3'],
        ['Book 5: Morning Thoughts & Duty', base + 'meditations_05_marcusaurelius.mp3'],
        ['Book 6: The Ruling Center', base + 'meditations_06_marcusaurelius.mp3'],
        ['Book 7: The Art of Living', base + 'meditations_07_marcusaurelius.mp3'],
        ['Book 8: The Equilibrium of the Soul', base + 'meditations_08_marcusaurelius.mp3'],
        ['Book 9: Sincerity and Justice', base + 'meditations_09_marcusaurelius.mp3'],
        ['Book 10: The Whole & The Parts', base + 'meditations_10_marcusaurelius.mp3'],
        ['Book 11: The Properties of the Rational Soul', base + 'meditations_11_marcusaurelius.mp3'],
        ['Book 12: The Epilogue', base + 'meditations_12_marcusaurelius.mp3']
      ];
    })(),
    '4': (() => {
      const base = 'https://archive.org/download/republic_version_2_1310_librivox/';
      return [
        ['Book 1 - Part 1', base + 'republic_01_plato_64kb.mp3'],
        ['Book 1 - Part 2', base + 'republic_02_plato_64kb.mp3'],
        ['Book 2 - Part 1', base + 'republic_03_plato_64kb.mp3'],
        ['Book 2 - Part 2', base + 'republic_04_plato_64kb.mp3'],
        ['Book 3 - Part 1', base + 'republic_05_plato_64kb.mp3'],
        ['Book 3 - Part 2', base + 'republic_06_plato_64kb.mp3'],
        ['Book 4 - Part 1', base + 'republic_07_plato_64kb.mp3'],
        ['Book 4 - Part 2', base + 'republic_08_plato_64kb.mp3'],
        ['Book 5 - Part 1', base + 'republic_09_plato_64kb.mp3'],
        ['Book 5 - Part 2', base + 'republic_10_plato_64kb.mp3'],
        ['Book 5 - Part 3', base + 'republic_11_plato_64kb.mp3'],
        ['Book 6 - Part 1', base + 'republic_12_plato_64kb.mp3'],
        ['Book 6 - Part 2', base + 'republic_13_plato_64kb.mp3'],
        ['Book 7 - Part 1 (Allegory of the Cave)', base + 'republic_14_plato_64kb.mp3'],
        ['Book 7 - Part 2', base + 'republic_15_plato_64kb.mp3'],
        ['Book 8 - Part 1', base + 'republic_16_plato_64kb.mp3'],
        ['Book 8 - Part 2', base + 'republic_17_plato_64kb.mp3'],
        ['Book 9 - Part 1', base + 'republic_18_plato_64kb.mp3'],
        ['Book 9 - Part 2', base + 'republic_19_plato_64kb.mp3'],
        ['Book 10 - Part 1', base + 'republic_20_plato_64kb.mp3'],
        ['Book 10 - Part 2', base + 'republic_21_plato_64kb.mp3']
      ];
    })(),
    // 5. The Prince (Niccolo Machiavelli) - Verified LibriVox
    5: (() => {
      const base = 'https://archive.org/download/prince_librivox/';
      return [
        ['Dedication & Chapters 1-5: Types of Principalities', base + 'prince_01_machiavelli_64kb.mp3'],
        ['Chapters 6-9: New Principalities & Civic Rule', base + 'prince_02_machiavelli_64kb.mp3'],
        ['Chapters 10-14: Military Strengths & Mercenaries', base + 'prince_03_machiavelli_64kb.mp3'],
        ['Chapters 15-18: Things for Which Men Are Praised or Blamed', base + 'prince_04_machiavelli_64kb.mp3'],
        ['Chapters 19-21: Avoiding Contempt & Gaining Renown', base + 'prince_05_machiavelli_64kb.mp3'],
        ['Chapter 22: The Secretaries of Princes & Ministers', base + 'prince_06_machiavelli_64kb.mp3'],
        ['Chapters 23-26: Fortune & Exhortation to Liberate Italy', base + 'prince_07_machiavelli_64kb.mp3']
      ];
    })(),
    '6': (() => {
      const base = 'https://archive.org/download/science_gettingrich_1005_librivox/';
      return [
        ['Chapter 1: The Right to Be Rich', base + 'scienceofgettingrich_01_wattles_64kb.mp3'],
        ['Chapter 2: There is a Science of Getting Rich', base + 'scienceofgettingrich_02_wattles_64kb.mp3'],
        ['Chapter 3: Is Opportunity Monopolized?', base + 'scienceofgettingrich_03_wattles_64kb.mp3'],
        ['Chapter 4: The First Principle in The Science of Getting Rich', base + 'scienceofgettingrich_04_wattles_64kb.mp3'],
        ['Chapter 5: Increasing Life', base + 'scienceofgettingrich_05_wattles_64kb.mp3'],
        ['Chapter 6: How Riches Come to You', base + 'scienceofgettingrich_06_wattles_64kb.mp3'],
        ['Chapter 7: Gratitude', base + 'scienceofgettingrich_07_wattles_64kb.mp3'],
        ['Chapter 8: Thinking in the Certain Way', base + 'scienceofgettingrich_08_wattles_64kb.mp3'],
        ['Chapter 9: How to Use the Will', base + 'scienceofgettingrich_09_wattles_64kb.mp3'],
        ['Chapter 10: Further Use of the Will', base + 'scienceofgettingrich_10_wattles_64kb.mp3'],
        ['Chapter 11: Acting in the Certain Way', base + 'scienceofgettingrich_11_wattles_64kb.mp3'],
        ['Chapter 12: Efficient Action', base + 'scienceofgettingrich_12_wattles_64kb.mp3'],
        ['Chapter 13: Getting into the Right Business', base + 'scienceofgettingrich_13_wattles_64kb.mp3'],
        ['Chapter 14: The Impression of Increase', base + 'scienceofgettingrich_14_wattles_64kb.mp3'],
        ['Chapter 15: The Advancing Man', base + 'scienceofgettingrich_15_wattles_64kb.mp3'],
        ['Chapter 16: Some Cautions & Concluding Observations', base + 'scienceofgettingrich_16_wattles_64kb.mp3'],
        ['Chapter 17: Summary of the Science of Getting Rich', base + 'scienceofgettingrich_17_wattles_64kb.mp3']
      ];
    })(),
    '7': (() => {
      const base = 'https://archive.org/download/dracula_librivox/';
      return [
        ['Chapter 1: Jonathan Harker’s Journal (Bistritz to Castle)', base + 'dracula_01_stoker_64kb.mp3'],
        ['Chapter 2: Castle Dracula', base + 'dracula_02_stoker_64kb.mp3'],
        ['Chapter 3: The Three Sisters', base + 'dracula_03_stoker_64kb.mp3'],
        ['Chapter 4: Escape from the Castle', base + 'dracula_04_stoker_64kb.mp3'],
        ['Chapter 5: Letters of Mina & Lucy', base + 'dracula_05_stoker_64kb.mp3'],
        ['Chapter 6: Whitby and Mina’s Journal', base + 'dracula_06_stoker_64kb.mp3'],
        ['Chapter 7: Log of the Demeter', base + 'dracula_07_stoker_64kb.mp3'],
        ['Chapter 8: Lucy Sleepwalking', base + 'dracula_08_stoker_64kb.mp3'],
        ['Chapter 9: Renfield & Van Helsing Arrives', base + 'dracula_09_stoker_64kb.mp3'],
        ['Chapter 10: The First Transfusion', base + 'dracula_10_stoker_64kb.mp3'],
        ['Chapter 16: The Tomb of Lucy', base + 'dracula_16_stoker_64kb.mp3'],
        ['Chapter 21: The Attack on Mina', base + 'dracula_21_stoker_64kb.mp3'],
        ['Chapter 27: The Final Confrontation in Transylvania', base + 'dracula_27_stoker_64kb.mp3']
      ];
    })(),
    '8': (() => {
      const base = 'https://archive.org/download/frankenstein_shelley/';
      return [
        ['Letters 1-4: Captain Walton’s Arctic Letters', base + 'frankenstein_00_shelley_64kb.mp3'],
        ['Chapter 1: Victor’s Early Life in Geneva', base + 'frankenstein_01_shelley_64kb.mp3'],
        ['Chapter 2: Studies in Ingolstadt', base + 'frankenstein_02_shelley_64kb.mp3'],
        ['Chapter 3: The Secret of Life', base + 'frankenstein_03_shelley_64kb.mp3'],
        ['Chapter 4: Animating the Creature', base + 'frankenstein_04_shelley_64kb.mp3'],
        ['Chapter 5: Terror & Flight', base + 'frankenstein_05_shelley_64kb.mp3'],
        ['Chapter 10: Encounter on Montanvert', base + 'frankenstein_10_shelley_64kb.mp3'],
        ['Chapter 11: The Creature’s Awakening', base + 'frankenstein_11_shelley_64kb.mp3'],
        ['Chapter 16: Rage and the Vow of Revenge', base + 'frankenstein_16_shelley_64kb.mp3'],
        ['Chapter 24: The Pursuit Across the Frozen Sea', base + 'frankenstein_24_shelley_64kb.mp3']
      ];
    })(),
    '9': (() => {
      const base = 'https://archive.org/download/greatgatsby_2101_librivox/';
      return [
        ['Chapter 1: Nick Carraway Moves to West Egg', base + 'greatgatsby_01_fitzgerald_64kb.mp3'],
        ['Chapter 2: The Valley of Ashes & Myrtle Wilson', base + 'greatgatsby_02_fitzgerald_64kb.mp3'],
        ['Chapter 3: Gatsby’s Grand Party', base + 'greatgatsby_03_fitzgerald_64kb.mp3'],
        ['Chapter 4: Driving with Gatsby to New York', base + 'greatgatsby_04_fitzgerald_64kb.mp3'],
        ['Chapter 5: Tea with Daisy & The Reunion', base + 'greatgatsby_05_fitzgerald_64kb.mp3'],
        ['Chapter 6: The True History of James Gatz', base + 'greatgatsby_06_fitzgerald_64kb.mp3'],
        ['Chapter 7: The Sweltering Day at the Plaza Hotel', base + 'greatgatsby_07_fitzgerald_64kb.mp3'],
        ['Chapter 8: The Vigil at the Pool', base + 'greatgatsby_08_fitzgerald_64kb.mp3'],
        ['Chapter 9: The Funeral & The Green Light', base + 'greatgatsby_09_fitzgerald_64kb.mp3']
      ];
    })(),
    '10': (() => {
      const base = 'https://archive.org/download/dorian_gray_librivox/';
      return [
        ['Chapter 1: The Studio of Basil Hallward', base + 'picture_of_dorian_grey_01_wilde_64kb.mp3'],
        ['Chapter 2: Lord Henry Wotton Meets Dorian', base + 'picture_of_dorian_grey_02_wilde_64kb.mp3'],
        ['Chapter 3: Lord Henry’s Uncle & Society', base + 'picture_of_dorian_grey_03_wilde_64kb.mp3'],
        ['Chapter 4: Sibyl Vane at the Theatre', base + 'picture_of_dorian_grey_04_wilde_64kb.mp3'],
        ['Chapter 7: The Play & The Rejection', base + 'picture_of_dorian_grey_07_wilde_64kb.mp3'],
        ['Chapter 8: The First Change in the Portrait', base + 'picture_of_dorian_grey_08_wilde_64kb.mp3'],
        ['Chapter 13: Basil Hallward’s Fate', base + 'picture_of_dorian_grey_13_wilde_64kb.mp3'],
        ['Chapter 20: The Mirror, The Knife, and The End', base + 'picture_of_dorian_grey_20_wilde_64kb.mp3']
      ];
    })(),
    '11': (() => {
      const base = 'https://archive.org/download/tale_two_cities_librivox/';
      return [
        ['Book 1 Chapter 1: The Period', base + 'tale_of_two_cities_01_dickens_64kb.mp3'],
        ['Book 1 Chapter 2: The Mail', base + 'tale_of_two_cities_02_dickens_64kb.mp3'],
        ['Book 1 Chapter 3: The Night Shadows', base + 'tale_of_two_cities_03_dickens_64kb.mp3'],
        ['Book 1 Chapter 4: The Preparation', base + 'tale_of_two_cities_04_dickens_64kb.mp3'],
        ['Book 1 Chapter 5: The Wine-Shop in Saint Antoine', base + 'tale_of_two_cities_05_dickens_64kb.mp3'],
        ['Book 2 Chapter 1: Five Years Later', base + 'tale_of_two_cities_07_dickens_64kb.mp3'],
        ['Book 2 Chapter 3: A Disappointment at the Old Bailey', base + 'tale_of_two_cities_09_dickens_64kb.mp3'],
        ['Book 2 Chapter 21: Echoing Footsteps & Storming of the Bastille', base + 'tale_of_two_cities_27_dickens_64kb.mp3'],
        ['Book 3 Chapter 15: The Footsteps Die Out Forever', base + 'tale_of_two_cities_45_dickens_64kb.mp3']
      ];
    })(),
    '12': (() => {
      const base = 'https://archive.org/download/prophet1_1901_librivox/';
      return [
        ['Chapter 1: The Coming of the Ship & Love', base + 'prophet1_01_gibran_64kb.mp3'],
        ['Chapter 2: On Marriage & Children', base + 'prophet1_02_gibran_64kb.mp3'],
        ['Chapter 3: On Giving, Eating, and Drinking', base + 'prophet1_03_gibran_64kb.mp3'],
        ['Chapter 4: On Work, Joy, and Sorrow', base + 'prophet1_04_gibran_64kb.mp3'],
        ['Chapter 5: On Houses, Clothes, Buying and Selling', base + 'prophet1_05_gibran_64kb.mp3'],
        ['Chapter 6: On Crime, Punishment, and Laws', base + 'prophet1_06_gibran_64kb.mp3'],
        ['Chapter 7: On Freedom, Reason, Passion, and Farewell', base + 'prophet1_07_gibran_64kb.mp3']
      ];
    })()
  };

  const selectedBook = sampleBooks.find(b => b.id === selectedBookId) || sampleBooks[0];
  const chapters = BOOK_CHAPTERS[selectedBookId] || BOOK_CHAPTERS['1'];
  const currentChapter = chapters[chapterIdx] || chapters[0];
  const audioSrc = currentChapter ? currentChapter[1] : '';

  // Resume progress on book switch
  useEffect(() => {
    localStorage.setItem('booksem_player', JSON.stringify({ bookId: selectedBookId }));
    const saved = (() => {
      try { return JSON.parse(localStorage.getItem('booksem_progress_' + selectedBookId) || '{}'); } catch { return {}; }
    })();
    const ch = (typeof saved.chapter === 'number' && saved.chapter >= 0 && saved.chapter < chapters.length) ? saved.chapter : 0;
    setChapterIdx(ch);
    resumeTimeRef.current = saved.time || 0;
    setCurrentTime(saved.time || 0);
  }, [selectedBookId]);

  // Handle auto-playing when source updates
  useEffect(() => {
    if (autoPlayRef.current && audioRef.current) {
      const p = audioRef.current.play();
      if (p !== undefined) {
        p.then(() => setIsPlayingAudio(true)).catch(() => setIsPlayingAudio(false));
      }
    }
  }, [audioSrc]);

  // Save progress periodically
  useEffect(() => {
    if (!currentTime) return;
    if (Math.floor(currentTime) % 5 !== 0) return;
    localStorage.setItem('booksem_progress_' + selectedBookId, JSON.stringify({ chapter: chapterIdx, time: currentTime }));
  }, [Math.floor(currentTime)]);

  // Sleep timer countdown
  useEffect(() => {
    if (!sleepEndsAt) return;
    const t = setInterval(() => {
      if (Date.now() >= sleepEndsAt) {
        if (audioRef.current) audioRef.current.pause();
        setIsPlayingAudio(false);
        setSleepMode(null);
        setSleepEndsAt(null);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [sleepEndsAt]);

  const cycleSleep = () => {
    const order = [null, 15, 30, 45, 60, 'chapter'];
    const next = order[(order.indexOf(sleepMode) + 1) % order.length];
    setSleepMode(next);
    setSleepEndsAt(typeof next === 'number' ? Date.now() + next * 60000 : null);
  };

  const sleepLabel = sleepMode === null ? 'Sleep: Off' : sleepMode === 'chapter' ? 'Sleep: End of chapter'
    : `Sleep: ${Math.max(0, Math.ceil(((sleepEndsAt || 0) - Date.now()) / 60000))} min`;

  const stopAll = () => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlayingAudio(false);
  };

  const goToChapter = (idx, autoplay = true) => {
    if (idx < 0 || idx >= chapters.length) return;
    if (!isChapterUnlocked(selectedBookId, idx)) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlayingAudio(false);
      setPaywallTargetBook(selectedBook);
      setShowPaywallModal(true);
      return;
    }
    resumeTimeRef.current = 0;
    autoPlayRef.current = autoplay;
    setCurrentTime(0);
    setDuration(0);
    setChapterIdx(idx);
    localStorage.setItem('booksem_progress_' + selectedBookId, JSON.stringify({ chapter: idx, time: 0 }));
    if (autoplay) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
        }
      }, 100);
    }
  };

  const skip = (secs) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + secs));
  };

  const handleLoaded = () => {
    const a = audioRef.current;
    if (!a) return;
    setDuration(a.duration);
    a.playbackRate = playbackRate;
    if (resumeTimeRef.current > 0) {
      a.currentTime = resumeTimeRef.current;
      resumeTimeRef.current = 0;
    }
    if (autoPlayRef.current) {
      autoPlayRef.current = false;
      a.play().then(() => setIsPlayingAudio(true)).catch(() => setIsPlayingAudio(false));
    }
  };

  const handleEnded = () => {
    if (sleepMode === 'chapter') {
      setIsPlayingAudio(false);
      setSleepMode(null);
      return;
    }
    const nextIdx = chapterIdx + 1;
    if (nextIdx < chapters.length) {
      if (isChapterUnlocked(selectedBookId, nextIdx)) {
        goToChapter(nextIdx, true);
      } else {
        setIsPlayingAudio(false);
        setPaywallTargetBook(selectedBook);
        setShowPaywallModal(true);
      }
    } else {
      setIsPlayingAudio(false);
      localStorage.removeItem('booksem_progress_' + selectedBookId);
    }
  };

  // Lock-screen / headphone media session controls
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentChapter) return;
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentChapter[0],
        artist: selectedBook.author,
        album: selectedBook.title,
        artwork: [{ src: selectedBook.cover, sizes: '400x400', type: 'image/jpeg' }]
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => goToChapter(chapterIdx - 1));
      navigator.mediaSession.setActionHandler('nexttrack', () => goToChapter(chapterIdx + 1));
      navigator.mediaSession.setActionHandler('seekbackward', () => skip(-15));
      navigator.mediaSession.setActionHandler('seekforward', () => skip(15));
    } catch (_) {}
  }, [chapterIdx, selectedBookId]);

  const openBook = (id, playImmediately = true) => {
    stopAll();
    setSelectedBookId(id);
    setChapterIdx(0);
    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (playImmediately) {
      autoPlayRef.current = true;
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
        }
      }, 150);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || !secs) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((err) => {
        console.error('Audio playback error:', err);
        setIsPlayingAudio(false);
      });
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min(duration, (clickX / rect.width) * duration));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const speeds = [1.0, 1.25, 1.5, 2.0];
  const toggleSpeed = () => {
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackRate(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. TOP NAVIGATION */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('marketplace')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-amber-500/20">
              B
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Booksem
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium">Listen & Read Audiobooks</span>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search classics, stoicism, self-help, or authors..."
                className="w-full bg-slate-950/60 border border-slate-800 rounded-full py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {hasMonthlyPass ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-amber-500/15 text-amber-300 px-3 py-1.5 rounded-full border border-amber-500/30 font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> All-Access Pass Active
              </span>
            ) : (
              <button
                onClick={() => {
                  setPaywallTargetBook(selectedBook);
                  setShowPaywallModal(true);
                }}
                className="hidden sm:flex items-center gap-1.5 text-xs bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 px-3.5 py-1.5 rounded-lg font-bold transition shadow-md shadow-amber-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" /> Get All-Access ($9.99/mo)
              </button>
            )}
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700 hidden sm:flex items-center"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Publish Work
            </button>
            <div className="relative cursor-pointer p-2 text-slate-300 hover:text-white" onClick={() => setActiveTab('marketplace')}>
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. SUB NAVIGATION TABS */}
      <nav className="border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 sm:space-x-4 py-2">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              activeTab === 'marketplace' ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Storefront
          </button>
          <button
            onClick={() => { setActiveTab('lounges'); setActiveLounge(null); }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              activeTab === 'lounges' ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="mr-2">🛋️</span>
            Reading Lounges
          </button>
          <button
            onClick={() => setActiveTab('reader')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              activeTab === 'reader' ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Headphones className="w-4 h-4 inline mr-2" />
            Listen & Read
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              activeTab === 'studio' ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-4 h-4 inline mr-2" />
            Author Studio
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              activeTab === 'interview' ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 inline mr-2" />
            Live Author Room
          </button>
        </div>
      </nav>

      {/* 3. MAIN CONTENT BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* TAB 1: MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-8">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-amber-600/20 via-slate-900 to-slate-900 border border-slate-800 p-8 sm:p-12">
              <div className="max-w-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 block">
                  Listen & Read Worldwide Classics
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  High-Quality Audiobooks Read By Real Human Voices
                </h1>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                  Chapter 1 free for every single title. Stream the world's most enduring wisdom, stoic philosophies, timeless novels, and strategic masterpieces on any device.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button 
                    onClick={() => openBook('1', true)}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center"
                  >
                    <Play className="w-4 h-4 mr-2 fill-slate-950" />
                    Start Listening Now (Ch. 1 Free)
                  </button>
                  <button 
                    onClick={() => {
                      setPaywallTargetBook(sampleBooks[0]);
                      setShowPaywallModal(true);
                    }}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-sm transition border border-slate-700 flex items-center"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
                    All-Access Pass ($9.99/mo)
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Featured Audiobooks & Classics</h2>
                <span className="text-xs text-slate-400">{sampleBooks.length} titles available</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sampleBooks.map((book) => (
                  <div key={book.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col hover:border-amber-500/40 transition group">
                    <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden cursor-pointer" onClick={() => openBook(book.id, true)}>
                      <img 
                        src={book.cover} 
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-slate-950/80 backdrop-blur text-amber-400 text-xs font-semibold px-2 py-1 rounded">
                          {book.format}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg">
                          <Play className="w-5 h-5 ml-0.5 fill-slate-950" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>{book.genre}</span>
                          <span className="flex items-center text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400 mr-1" />
                            {book.rating}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-amber-400 transition cursor-pointer" onClick={() => openBook(book.id, true)}>
                          {book.title}
                        </h3>
                        <p className="text-xs text-slate-400 mb-1">by {book.author}</p>
                        <p className="text-[10px] uppercase tracking-wider text-amber-400/80 font-semibold mb-2">{book.free ? '🎭 Free Audio Drama • Instant Play' : '🎧 Audiobook • 📖 Paperback • 📚 Hardcover'}</p>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {book.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                        <div>
                          <span className="text-xs text-slate-500 block">Price</span>
                          <span className={`text-lg font-bold ${book.free ? 'text-emerald-400' : 'text-white'}`}>
                            {book.free ? 'FREE' : `$${book.price}`}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openBook(book.id, true)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition"
                            title="Listen to Chapter 1 free immediately"
                          >
                            <Play className="w-3 h-3 fill-slate-950" />
                            <span>{book.free ? 'Play Now' : 'Listen Free'}</span>
                          </button>
                          {book.free ? (
                            <span className="px-2.5 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold">Free</span>
                          ) : isBookUnlocked(book.id) ? (
                            <button 
                              onClick={() => openBook(book.id, true)}
                              className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Unlocked
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                setPaywallTargetBook(book);
                                setPurchaseFormat('audio');
                                setShowPaywallModal(true);
                              }}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700"
                              title="Unlock full book"
                            >
                              <Lock className="w-3 h-3 text-amber-400" />
                              <span>Buy</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: READER & AUDIOBOOK PLAYER */}
        {activeTab === 'reader' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{selectedBook.title}</h1>
                <p className="text-slate-400 text-sm">Author: {selectedBook.author} | Narrated by: Real Human Voice (Public Domain Archive / LibriVox)</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                  className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300"
                  title="Smaller font"
                >
                  Font A-
                </button>
                <button 
                  onClick={() => setFontSize(Math.min(26, fontSize + 2))}
                  className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300"
                  title="Larger font"
                >
                  Font A+
                </button>
              </div>
            </div>

            {/* Membership & Unlock status banner */}
            {!isBookUnlocked(selectedBookId) && (
              <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/15 border border-amber-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Listening to Free Preview (Chapter 1)</div>
                    <div className="text-xs text-slate-400">Chapters 2–{chapters.length} require unlocking this title or an All-Access Pass.</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPaywallTargetBook(selectedBook);
                    setShowPaywallModal(true);
                  }}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition shadow-md shadow-amber-500/20 whitespace-nowrap"
                >
                  Unlock Full Audiobook (${selectedBook.price})
                </button>
              </div>
            )}

            {/* REAL Working Audio Player Bar */}
            <div className="bg-gradient-to-r from-slate-900 to-amber-950/40 border border-amber-900/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              {/* HTML5 Audio Element */}
              <audio
                ref={audioRef}
                src={audioSrc || undefined}
                onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                onLoadedMetadata={handleLoaded}
                onCanPlay={() => {
                  setIsBuffering(false);
                  if (autoPlayRef.current && audioRef.current) {
                    audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
                  }
                }}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => { setIsBuffering(false); setIsPlayingAudio(true); }}
                onEnded={handleEnded}
                onPause={() => setIsPlayingAudio(false)}
                onError={(e) => {
                  console.error('Audio load error:', e);
                  setIsBuffering(false);
                  setIsPlayingAudio(false);
                }}
                preload="auto"
              />

              <div className="flex items-center space-x-2 w-full md:w-auto">
                <button onClick={() => goToChapter(chapterIdx - 1)} disabled={chapterIdx === 0} className="p-2 text-slate-300 hover:text-amber-400 disabled:opacity-30" title="Previous chapter"><SkipBack className="w-5 h-5" /></button>
                <button onClick={() => skip(-15)} className="p-2 text-slate-300 hover:text-amber-400" title="Back 15 seconds"><RotateCcw className="w-5 h-5" /></button>
                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-slate-950 font-bold transition shadow-lg shadow-amber-500/20 flex-shrink-0"
                  title={isPlayingAudio ? 'Pause Narration' : 'Play Narration'}
                >
                  {isBuffering ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isPlayingAudio ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>
                <button onClick={() => skip(15)} className="p-2 text-slate-300 hover:text-amber-400" title="Forward 15 seconds"><RotateCw className="w-5 h-5" /></button>
                <button onClick={() => goToChapter(chapterIdx + 1)} disabled={chapterIdx >= chapters.length - 1} className="p-2 text-slate-300 hover:text-amber-400 disabled:opacity-30" title="Next chapter"><SkipForward className="w-5 h-5" /></button>
                <div className="ml-2 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                      Track {chapterIdx + 1} of {chapters.length}
                    </span>
                    {chapterIdx === 0 && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-semibold border border-emerald-500/30">
                        FREE
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white truncate max-w-[220px]">{currentChapter ? currentChapter[0] : ''}</p>
                </div>
              </div>

              {/* Working Scrubber with real dynamic progress */}
              <div className="w-full md:flex-1 max-w-lg flex items-center space-x-3">
                <span className="text-xs text-slate-400 font-mono w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <div 
                  onClick={handleSeek}
                  className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden cursor-pointer relative hover:h-3 transition-all"
                  title="Click anywhere to jump in the audio"
                >
                  <div 
                    className="bg-amber-500 h-full transition-[width] duration-150" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 font-mono w-10">
                  {duration > 0 ? formatTime(duration) : '--:--'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleSpeed}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition border border-slate-700"
                  title="Click to change playback speed"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{playbackRate}x Speed</span>
                </button>
                <button onClick={cycleSleep} className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${sleepMode ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`} title="Sleep timer">
                  <Moon className="w-3.5 h-3.5" /><span>{sleepLabel}</span>
                </button>
                <button onClick={() => setShowChapters(!showChapters)} className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700" title="Chapters">
                  <List className="w-3.5 h-3.5 text-amber-400" /><span>Chapters</span>
                </button>
              </div>
            </div>

            {/* Chapter Selection Drawer */}
            {showChapters && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center">
                    <List className="w-4 h-4 mr-2 text-amber-400" />
                    Complete Audiobook Tracklist ({chapters.length} Tracks)
                  </h3>
                  <span className="text-xs text-slate-400">
                    {isBookUnlocked(selectedBookId) ? 'All chapters unlocked' : 'Chapter 1 free preview'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-2">
                  {chapters.map((c, i) => {
                    const isCh1 = i === 0;
                    const unlocked = isCh1 || isBookUnlocked(selectedBookId);
                    const isSelected = i === chapterIdx;
                    return (
                      <button
                        key={c[1] || i}
                        onClick={() => goToChapter(i, true)}
                        className={`w-full text-left px-3 py-2.5 text-sm flex items-center justify-between rounded-lg transition ${
                          isSelected
                            ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <span className="truncate mr-2 flex items-center gap-1.5">
                          {isSelected && <Play className="w-3 h-3 fill-amber-400 flex-shrink-0" />}
                          <span className="truncate">{c[0]}</span>
                        </span>
                        {isCh1 ? (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            Free
                          </span>
                        ) : !unlocked ? (
                          <Lock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Book Info and Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <img 
                  src={selectedBook.cover} 
                  alt={selectedBook.title}
                  className="w-full aspect-[3/4] object-cover rounded-lg shadow-lg"
                />
                <div>
                  <h3 className="font-bold text-white text-lg">{selectedBook.title}</h3>
                  <p className="text-sm text-slate-400 mb-3">by {selectedBook.author}</p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{selectedBook.description}</p>
                  
                  {!isBookUnlocked(selectedBookId) ? (
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <button
                        onClick={() => {
                          setPaywallTargetBook(selectedBook);
                          setShowPaywallModal(true);
                        }}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow"
                      >
                        <Lock className="w-3.5 h-3.5" /> Unlock Book (${selectedBook.price})
                      </button>
                      <button
                        onClick={() => {
                          setPaywallTargetBook(selectedBook);
                          setShowPaywallModal(true);
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 rounded-lg text-xs transition border border-slate-700"
                      >
                        All-Access Pass ($9.99/mo)
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>All chapters unlocked for your library.</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Listening Guide & Features</h2>
                  <p className="text-xs text-slate-400 mb-6">Enjoy continuous uninterrupted playback across all chapters.</p>
                  
                  <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                    <p><strong>Chapter 1 Free Forever:</strong> Listen to the entire first chapter without signing up. Try any book in our catalog risk-free.</p>
                    <p><strong>Binge-Listening Auto-Play:</strong> Unlocked books transition smoothly from chapter to chapter automatically.</p>
                    <p><strong>Bookmark Memory:</strong> Your chapter position and timestamps are automatically saved so you never lose your place.</p>
                    <p><strong>Mobile Controls:</strong> Full lock-screen and headphone skip support for hands-free listening on iOS and Android.</p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Source: LibriVox Public Domain Recordings</span>
                  <span>Audio Format: 64kbps MP3</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUTHOR STUDIO */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-2">Author Publishing Studio</h2>
              <p className="text-slate-400 text-sm mb-6">Upload your manuscript or narrate audio directly from your browser to sell on Booksem.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Book Title</label>
                  <input type="text" placeholder="e.g. The Architecture of Mind" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Genre</label>
                  <input type="text" placeholder="e.g. Philosophy / Self-Help" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Price (USD)</label>
                  <input type="number" placeholder="4.99" step="0.01" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                </div>
                <div className="pt-2">
                  <button onClick={() => alert('Publishing system connects to your author dashboard.')} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition">
                    Submit Manuscript for Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: READING LOUNGES */}
        {activeTab === 'lounges' && !activeLounge && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-2">Booksem Reading Lounges</h2>
              <p className="text-slate-400">Pick a room, take a seat, and settle in with a book on the subject you love.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {READING_LOUNGES.map(room => (
                <div key={room.id} className={`rounded-2xl border border-slate-800 bg-gradient-to-br ${room.gradient} p-6 flex flex-col`}>
                  <div className="text-4xl mb-3">{room.emoji}</div>
                  <h3 className="text-xl font-bold text-white">{room.name}</h3>
                  <p className="text-slate-300 text-sm mt-1 mb-4">{room.mood}</p>
                  <div className="flex -space-x-3 mb-5">
                    {room.books.map(id => { const b = sampleBooks.find(x => x.id === id); return b ? <img key={id} src={b.cover} alt={b.title} className="w-12 h-16 object-cover rounded border-2 border-slate-900" /> : null; })}
                  </div>
                  <button onClick={() => { setActiveLounge(room.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="mt-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold text-sm">Take a Seat →</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'lounges' && activeLounge && (() => {
          const room = READING_LOUNGES.find(r => r.id === activeLounge);
          const notes = loungeNotes[room.id] || [];
          const labels = { fire: '🔥 Fireplace', rain: '🌧️ Rain', cafe: '☕ Café hum' };
          return (
            <div className="space-y-6">
              <button onClick={() => { ambience.stop(); setActiveLounge(null); }} className="text-sm text-slate-400 hover:text-white">← All lounges</button>
              <div className={`rounded-2xl border border-slate-800 bg-gradient-to-br ${room.gradient} p-8`}>
                <div className="text-5xl mb-2">{room.emoji}</div>
                <h2 className="text-3xl font-bold text-white">{room.name}</h2>
                <p className="text-slate-300 mt-1">{room.mood}</p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {Object.keys(labels).map(k => (
                    <button key={k} onClick={() => ambience.kind === k ? ambience.stop() : ambience.start(k)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${ambience.kind === k ? 'bg-amber-500 text-slate-950 border-amber-500' : 'border-slate-600 text-slate-300 hover:text-white'}`}>
                      {labels[k]} {ambience.kind === k ? '· On' : ''}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-bold text-white mb-3">The Room's Shelf</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {room.books.map(id => { const b = sampleBooks.find(x => x.id === id); if (!b) return null; return (
                      <div key={id} className="flex gap-3 bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                        <img src={b.cover} alt={b.title} className="w-16 h-24 object-cover rounded" />
                        <div className="flex flex-col flex-1">
                          <div className="font-semibold text-white text-sm">{b.title}</div>
                          <div className="text-xs text-slate-400 mb-2">{b.author}</div>
                          <button onClick={() => openBook(b.id, true)} className="mt-auto px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 w-fit">
                            <Play className="w-3 h-3 fill-slate-950" /> Sit & Listen (Ch. 1 free)
                          </button>
                        </div>
                      </div>
                    ); })}
                  </div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-white mb-1">Reader Notes</h3>
                  <p className="text-xs text-slate-500 mb-3">Save favorite quotes and thoughts from this room (kept on this device).</p>
                  <textarea value={noteDraft} onChange={e => setNoteDraft(e.target.value)} rows={3} placeholder="A passage or thought worth keeping..." className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white" />
                  <button onClick={saveLoungeNote} className="mt-2 w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold">Save Note</button>
                  <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
                    {notes.length === 0 && <p className="text-xs text-slate-500">No notes yet.</p>}
                    {notes.map((n, i) => (
                      <div key={i} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-300">
                        “{n.text}” <span className="block text-[10px] text-slate-500 mt-1">{n.at}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 4: LIVE AUTHOR ROOM */}
        {activeTab === 'interview' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
                <Video className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Live Author Interview Room</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                Host live broadcast discussions, Q&As, and exclusive readings with authors.
              </p>
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-6 text-left max-w-lg mx-auto">
                <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-2">
                  <span>UPCOMING BROADCAST</span>
                  <span>7:00 PM EST</span>
                </div>
                <h3 className="font-bold text-white text-base">Stoic Philosophy in Modern Tech</h3>
                <p className="text-xs text-slate-400 mt-1">Live reading & discussion on Marcus Aurelius with community guest speakers.</p>
                <button onClick={() => alert('Reminder set!')} className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition">
                  Remind Me When Live
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL: UPLOAD WORK */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Publish to Booksem</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Independent authors keep 70% of every sale. Direct audio and e-book distribution.</p>
            <div className="space-y-3">
              <input type="text" placeholder="Title" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs" />
              <input type="text" placeholder="Author name" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs" />
              <button onClick={() => setShowUploadModal(false)} className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg mt-2">
                Continue Setup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYWALL / UNLOCK MODAL */}
      {showPaywallModal && paywallTargetBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <button 
              onClick={() => setShowPaywallModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-[11px] uppercase tracking-wider font-bold bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20 inline-flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Chapter 1 Free Preview Complete
              </span>
              <h3 className="text-2xl font-bold mt-3 text-white">Unlock Full Audiobook & E-Book</h3>
              <p className="text-slate-400 text-sm mt-1">
                Continue reading & listening to <span className="text-amber-400 font-semibold">{paywallTargetBook.title}</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
              {[
                { key: 'audio', label: '🎧 Audiobook', price: '$' + paywallTargetBook.price },
                { key: 'paperback', label: '📖 Paperback', price: '$14.99' },
                { key: 'hardcover', label: '📚 Hardcover', price: '$24.99' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setPurchaseFormat(f.key)}
                  className={`py-2 rounded-lg text-xs font-bold transition flex flex-col items-center ${purchaseFormat === f.key ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <span>{f.label}</span>
                  <span className={`text-[11px] font-semibold ${purchaseFormat === f.key ? 'text-slate-900' : 'text-slate-500'}`}>{f.price}</span>
                </button>
              ))}
            </div>

            {purchaseFormat === 'audio' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Option A: Buy this single book */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
                <div>
                  <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">A La Carte</div>
                  <h4 className="font-bold text-white text-base mt-1">Buy This Book</h4>
                  <div className="text-3xl font-extrabold text-amber-400 mt-2">${paywallTargetBook.price}</div>
                  <p className="text-xs text-slate-400 mt-1">One-time payment. Permanent lifetime access to all chapters & audio.</p>
                </div>
                {STRIPE_SINGLE_BOOK_URLS[paywallTargetBook.id] ? (
                  <button 
                    onClick={() => { window.location.href = STRIPE_SINGLE_BOOK_URLS[paywallTargetBook.id]; }}
                    className="mt-5 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-lg shadow transition"
                  >
                    Buy for ${paywallTargetBook.price} (Stripe)
                  </button>
                ) : (
                  <button 
                    disabled
                    className="mt-5 w-full bg-slate-800 text-slate-400 font-bold text-xs py-2.5 rounded-lg cursor-not-allowed"
                  >
                    Single-book purchase coming soon
                  </button>
                )}
              </div>

              {/* Option B: All-Access Monthly Pass */}
              <div className="bg-gradient-to-b from-amber-500/10 via-slate-950/80 to-slate-950/80 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between relative shadow-lg">
                <span className="absolute -top-2.5 right-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                  Best Value
                </span>
                <div>
                  <div className="text-xs uppercase font-semibold text-amber-400 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Unlimited
                  </div>
                  <h4 className="font-bold text-white text-base mt-1">All-Access Pass</h4>
                  <div className="text-3xl font-extrabold text-white mt-2">
                    $9.99<span className="text-xs font-normal text-slate-400">/mo</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Unlimited streaming of all 12 complete audiobooks & future releases.</p>
                </div>
                <button 
                  onClick={() => {
                    if (audioRef.current) audioRef.current.pause();
                    window.location.href = STRIPE_ALL_ACCESS_URL;
                  }}
                  className="mt-5 w-full bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs py-2.5 rounded-lg transition"
                >
                  Pay with Stripe ($9.99/mo)
                </button>
              </div>
            </div>
            ) : (
            <div className="mb-6 bg-slate-950/60 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">{purchaseFormat === 'paperback' ? 'Paperback Edition' : 'Hardcover Edition'}</div>
                  <h4 className="font-bold text-white text-base mt-1">{paywallTargetBook.title}</h4>
                  <p className="text-xs text-slate-400">by {paywallTargetBook.author}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-amber-400">{purchaseFormat === 'paperback' ? '$14.99' : '$24.99'}</div>
                  <div className="text-[11px] text-slate-500">+ shipping</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                {purchaseFormat === 'paperback'
                  ? 'Classic softcover print edition, delivered to your door.'
                  : 'Premium hardbound edition — perfect for collectors and gifts.'}
              </p>
              <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-xs text-emerald-300">
                📦 Ships directly from independent bookstore partners. Tracked delivery within 3–5 business days.
              </div>
              <button
                disabled
                className="mt-4 w-full bg-slate-800 text-slate-400 font-bold text-xs py-2.5 rounded-lg cursor-not-allowed"
              >
                Print editions coming soon
              </button>
            </div>
            )}

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure 256-bit checkout
              </span>
              <span className="text-slate-500">Cancel pass anytime</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Booksem.com — A Partner Platform of MiyTube.</p>
          <div className="flex space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Author Program</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
