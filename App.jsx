import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen, Headphones, Mic, PenTool, ShoppingBag,
  Play, Pause, Star, Upload, Search, MessageSquare,
  Video, Users, Volume2, ShieldCheck, Heart, Share2,
  CheckCircle, ArrowRight, SkipBack, SkipForward, RotateCcw, RotateCw, Moon, List,
  Lock, Unlock, Sparkles, Check, X
} from 'lucide-react';

export default function BooksemApp() {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
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

  const isBookUnlocked = (bookId) => {
    if (hasMonthlyPass) return true;
    return unlockedBooks.includes(bookId);
  };

  const isChapterUnlocked = (bookId, trackIdx) => {
    if (trackIdx === 0) return true; // Chapter 1 is always 100% free preview
    return isBookUnlocked(bookId);
  };

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
      genre: 'Non-Fiction',
      format: 'Audiobook & E-Book',
      price: 4.99,
      rating: 4.9,
      reviewsCount: 3100,
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
      description: 'Private spiritual writings of the Roman Emperor on Stoic resilience, virtue, focus, and navigating human trials.'
    },
    {
      id: '4',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      genre: 'Fiction',
      format: 'Audiobook & E-Book',
      price: 4.99,
      rating: 4.8,
      reviewsCount: 4210,
      cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=400',
      description: 'The timeless romantic masterpiece exploring societal class, family expectations, witty banter, and enduring love.'
    },
    {
      id: '5',
      title: 'The Prince',
      author: 'Niccolò Machiavelli',
      genre: 'Non-Fiction',
      format: 'Audiobook & E-Book',
      price: 3.99,
      rating: 4.7,
      reviewsCount: 1650,
      cover: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=400',
      description: 'The piercing handbook on realpolitik, acquiring and retaining political power, statecraft, and leadership ruthlessness.'
    },
    {
      id: '6',
      title: 'Frankenstein',
      author: 'Mary Shelley',
      genre: 'Fiction',
      format: 'Audiobook & E-Book',
      price: 4.99,
      rating: 4.8,
      reviewsCount: 2430,
      cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=400',
      description: 'The gothic science-fiction classic on unchecked human ambition, scientific ethics, alienation, and monstrous creation.'
    },
    {
      id: '7',
      title: 'The Science of Getting Rich',
      author: 'Wallace D. Wattles',
      genre: 'Non-Fiction',
      format: 'Audiobook & E-Book',
      price: 3.99,
      rating: 4.7,
      reviewsCount: 1120,
      cover: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=400',
      description: 'A pragmatic mental guide detailing how creative thought, positive expectation, and focused action generate prosperity.'
    },
    {
      id: '8',
      title: 'Dracula',
      author: 'Bram Stoker',
      genre: 'Fiction',
      format: 'Audiobook & E-Book',
      price: 5.99,
      rating: 4.8,
      reviewsCount: 3500,
      cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=400',
      description: 'The atmospheric epistolary horror masterpiece documenting Count Dracula’s attempt to move from Transylvania to England.'
    },
    {
      id: '9',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Fiction',
      format: 'Audiobook & E-Book',
      price: 4.99,
      rating: 4.6,
      reviewsCount: 4890,
      cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
      description: 'A tragic portrait of Jazz Age obsession, high society wealth, unrequited desire, and the elusive American Dream.'
    },
    {
      id: '10',
      title: 'A Tale of Two Cities',
      author: 'Charles Dickens',
      genre: 'Fiction',
      format: 'Audiobook & E-Book',
      price: 5.99,
      rating: 4.7,
      reviewsCount: 1980,
      cover: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=400',
      description: 'Set between London and Paris during the brutality of the French Revolution, depicting sacrifice, redemption, and rebirth.'
    },
    {
      id: '11',
      title: 'The Picture of Dorian Gray',
      author: 'Oscar Wilde',
      genre: 'Fiction',
      format: 'Audiobook & E-Book',
      price: 4.99,
      rating: 4.8,
      reviewsCount: 2210,
      cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400',
      description: 'The dark philosophical tale of eternal youth, hedonism, aesthetic corruption, and a portrait that bears the soul’s sins.'
    },
    {
      id: '12',
      title: 'The Prophet',
      author: 'Kahlil Gibran',
      genre: 'Poetry',
      format: 'Audiobook & E-Book',
      price: 2.99,
      rating: 4.9,
      reviewsCount: 1750,
      cover: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400',
      description: 'A poetic spiritual collection of twenty-eight fables offering wisdom on love, work, sorrow, freedom, and time.'
    }
  ];

  // COMPLETE CHAPTER PLAYLISTS FOR ALL 12 BOOKS
  const BOOK_CHAPTERS = {
    '1': [
      ['Chapters 1-2: Laying Plans & Waging War', 'https://ia800206.us.archive.org/16/items/art_of_war_0709_librivox/art_of_war_01-02_sun_tzu_64kb.mp3'],
      ['Chapters 3-4: Attack by Stratagem & Tactical Dispositions', 'https://ia800206.us.archive.org/16/items/art_of_war_0709_librivox/art_of_war_03-04_sun_tzu_64kb.mp3'],
      ['Chapters 5-6: Energy & Weak Points and Strong', 'https://ia800206.us.archive.org/16/items/art_of_war_0709_librivox/art_of_war_05-06_sun_tzu_64kb.mp3'],
      ['Chapters 7-8: Maneuvering & Variation in Tactics', 'https://ia800206.us.archive.org/16/items/art_of_war_0709_librivox/art_of_war_07-08_sun_tzu_64kb.mp3'],
      ['Chapters 9-10: The Army on the March & Terrain', 'https://ia800206.us.archive.org/16/items/art_of_war_0709_librivox/art_of_war_09-10_sun_tzu_64kb.mp3'],
      ['Chapters 11-12: The Nine Situations & Attack by Fire', 'https://ia800206.us.archive.org/16/items/art_of_war_0709_librivox/art_of_war_11-12_sun_tzu_64kb.mp3'],
      ['Chapter 13: The Use of Spies', 'https://ia800206.us.archive.org/16/items/art_of_war_0709_librivox/art_of_war_13_sun_tzu_64kb.mp3']
    ],
    '2': (() => {
      const base = 'https://ia800108.us.archive.org/27/items/think-and-grow-rich_202408/';
      const list = [
        ['Chapter 1 Part 1: Introduction & Desire', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%201%20Part%201.mp3'],
        ['Chapter 1 Part 2', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%201%20Part%202.mp3'],
        ['Chapter 1 Part 3', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%201%20Part%203.mp3'],
        ['Chapter 1 Part 4', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%201%20Part%204.mp3'],
        ['Chapter 1 Part 5', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%201%20Part%205.mp3'],
        ['Chapter 1 Part 6', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%201%20Part%206.mp3'],
        ['Chapter 2 Part 1: Desire — The Turning Point', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%202%20Part%201.mp3'],
        ['Chapter 2 Part 2', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%202%20Part%202.mp3'],
        ['Chapter 2 Part 3', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%202%20Part%203.mp3'],
        ['Chapter 2 Part 4', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%202%20Part%204.mp3'],
        ['Chapter 2 Part 5', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%202%20Part%205.mp3'],
        ['Chapter 2 Part 6', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%202%20Part%206.mp3'],
        ['Chapter 3 Part 1: Faith — Visualization of Desire', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%203%20Part%201.mp3'],
        ['Chapter 3 Part 2', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%203%20Part%202.mp3'],
        ['Chapter 3 Part 3', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%203%20Part%203.mp3'],
        ['Chapter 3 Part 4', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%203%20Part%204.mp3'],
        ['Chapter 3 Part 5', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%203%20Part%205.mp3'],
        ['Chapter 3 Part 6', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%203%20Part%206.mp3'],
        ['Chapter 4 Part 1: Auto-Suggestion', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%204%20Part%201.mp3'],
        ['Chapter 4 Part 2', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%204%20Part%202.mp3'],
        ['Chapter 4 Part 3', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%204%20Part%203.mp3'],
        ['Chapter 4 Part 4', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%204%20Part%204.mp3'],
        ['Chapter 5 Part 1: Specialized Knowledge', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%205%20Part%201.mp3'],
        ['Chapter 5 Part 2', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%205%20Part%202.mp3'],
        ['Chapter 5 Part 3', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%205%20Part%203.mp3'],
        ['Chapter 5 Part 4', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%205%20Part%204.mp3'],
        ['Chapter 5 Part 5', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%205%20Part%205.mp3'],
        ['Chapter 6 Part 1: Imagination — The Workshop of the Mind', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%206%20Part%201.mp3'],
        ['Chapter 6 Part 2', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%206%20Part%202.mp3'],
        ['Chapter 6 Part 3', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%206%20Part%203.mp3'],
        ['Chapter 6 Part 4', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%206%20Part%204.mp3'],
        ['Chapter 6 Part 5', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%206%20Part%205.mp3'],
        ['Chapter 6 Part 6', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%206%20Part%206.mp3'],
        ['Chapter 7 Part 1: Organized Planning', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%207%20Part%201.mp3'],
        ['Chapter 7 Part 2', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%207%20Part%202.mp3'],
        ['Chapter 7 Part 3', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%207%20Part%203.mp3'],
        ['Chapter 7 Part 4', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%207%20Part%204.mp3'],
        ['Chapter 7 Part 5', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%207%20Part%205.mp3'],
        ['Chapter 7 Part 6', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%207%20Part%206.mp3'],
        ['Chapter 7 Part 7', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%207%20Part%207.mp3'],
        ['Chapter 7 Part 8', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%207%20Part%208.mp3'],
        ['Chapter 7 Part 9', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%207%20Part%209.mp3'],
        ['Chapter 7 Part 10', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%207%20Part%2010.mp3'],
        ['Chapter 8 Part 1: Decision — The Mastery of Procrastination', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%208%20Part%201.mp3'],
        ['Chapter 8 Part 2', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%208%20Part%202.mp3'],
        ['Chapter 8 Part 3', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%208%20Part%203.mp3'],
        ['Chapter 8 Part 4', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%208%20Part%204.mp3'],
        ['Chapter 9 Part 1: Persistence', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%209%20Part%201.mp3'],
        ['Chapter 9 Part 2', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%209%20Part%202.mp3'],
        ['Chapter 9 Part 3', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%209%20Part%203.mp3'],
        ['Chapter 9 Part 4', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%209%20Part%204.mp3'],
        ['Chapter 9 Part 5', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%209%20Part%205.mp3'],
        ['Chapter 10 Part 1: Power of the Master Mind', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2010%20Part%201.mp3'],
        ['Chapter 10 Part 2', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2010%20Part%202.mp3'],
        ['Chapter 11 Part 1: Mystery of Sex Transmutation', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2011%20Part%201.mp3'],
        ['Chapter 11 Part 2', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2011%20Part%202.mp3'],
        ['Chapter 11 Part 3', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2011%20Part%203.mp3'],
        ['Chapter 11 Part 4', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2011%20Part%204.mp3'],
        ['Chapter 11 Part 5', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2011%20Part%205.mp3'],
        ['Chapter 12 Part 1: The Subconscious Mind', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2012%20Part%201.mp3'],
        ['Chapter 12 Part 2', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2012%20Part%202.mp3'],
        ['Chapter 12 Part 3', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2012%20Part%203.mp3'],
        ['Chapter 13 Part 1: The Brain — Broadcasting Station', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2013%20Part%201.mp3'],
        ['Chapter 13 Part 2', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2013%20Part%202.mp3'],
        ['Chapter 14 Part 1: The Sixth Sense', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2014%20Part%201.mp3'],
        ['Chapter 14 Part 2', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2014%20Part%202.mp3'],
        ['Chapter 14 Part 3', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2014%20Part%203.mp3'],
        ['Chapter 15 Part 1: Six Ghosts of Fear', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2015%20Part%201.mp3'],
        ['Chapter 15 Part 2', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2015%20Part%202.mp3'],
        ['Chapter 15 Part 3', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2015%20Part%203.mp3'],
        ['Chapter 15 Part 4', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2015%20Part%204.mp3'],
        ['Chapter 15 Part 5', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2015%20Part%205.mp3'],
        ['Chapter 15 Part 6', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2015%20Part%206.mp3'],
        ['Chapter 15 Part 7', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2015%20Part%207.mp3'],
        ['Chapter 15 Part 8', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2015%20Part%208.mp3'],
        ['Chapter 15 Part 9', base + 'Think%20and%20Grow%20Rich%20-%20Chapter%2015%20Part%209.mp3']
      ];
      return list;
    })(),
    '3': [
      ['Introduction', 'https://ia800301.us.archive.org/31/items/meditations_0804_librivox/meditations_00_aurelius_64kb.mp3'],
      ['Book 1', 'https://ia800301.us.archive.org/31/items/meditations_0804_librivox/meditations_01_aurelius_64kb.mp3'],
      ['Book 2', 'https://ia800301.us.archive.org/31/items/meditations_0804_librivox/meditations_02_aurelius_64kb.mp3'],
      ['Book 3', 'https://ia800301.us.archive.org/31/items/meditations_0804_librivox/meditations_03_aurelius_64kb.mp3'],
      ['Book 4', 'https://ia800301.us.archive.org/31/items/meditations_0804_librivox/meditations_04_aurelius_64kb.mp3'],
      ['Book 5', 'https://ia800301.us.archive.org/31/items/meditations_0804_librivox/meditations_05_aurelius_64kb.mp3'],
      ['Book 6', 'https://ia800301.us.archive.org/31/items/meditations_0804_librivox/meditations_06_aurelius_64kb.mp3'],
      ['Book 7', 'https://ia800301.us.archive.org/31/items/meditations_0804_librivox/meditations_07_aurelius_64kb.mp3'],
      ['Book 8', 'https://ia800301.us.archive.org/31/items/meditations_0804_librivox/meditations_08_aurelius_64kb.mp3'],
      ['Book 9', 'https://ia800301.us.archive.org/31/items/meditations_0804_librivox/meditations_09_aurelius_64kb.mp3'],
      ['Book 10', 'https://ia800301.us.archive.org/31/items/meditations_0804_librivox/meditations_10_aurelius_64kb.mp3'],
      ['Book 11', 'https://ia800301.us.archive.org/31/items/meditations_0804_librivox/meditations_11_aurelius_64kb.mp3'],
      ['Book 12', 'https://ia800301.us.archive.org/31/items/meditations_0804_librivox/meditations_12_aurelius_64kb.mp3']
    ],
    '4': (() => {
      const base = 'https://ia800302.us.archive.org/1/items/pride_and_prejudice_librivox/';
      const list = [];
      for (let i = 1; i <= 61; i++) {
        const s = String(i).padStart(2, '0');
        list.push([`Chapter ${i}`, `${base}prideandprejudice_${s}_austen_64kb.mp3`]);
      }
      return list;
    })(),
    '5': [
      ['Introduction & Dedication', 'https://ia800204.us.archive.org/28/items/prince_librivox/prince_01_machiavelli_64kb.mp3'],
      ['Chapters 1-5: Types of Principalities', 'https://ia800204.us.archive.org/28/items/prince_librivox/prince_02_machiavelli_64kb.mp3'],
      ['Chapters 6-9: New Dominions & Civil Principality', 'https://ia800204.us.archive.org/28/items/prince_librivox/prince_03_machiavelli_64kb.mp3'],
      ['Chapters 10-14: Defense, Mercenaries & Military Affairs', 'https://ia800204.us.archive.org/28/items/prince_librivox/prince_04_machiavelli_64kb.mp3'],
      ['Chapters 15-19: Conduct, Cruelty & Avoiding Contempt', 'https://ia800204.us.archive.org/28/items/prince_librivox/prince_05_machiavelli_64kb.mp3'],
      ['Chapters 20-23: Fortresses, Honors & Choosing Counselors', 'https://ia800204.us.archive.org/28/items/prince_librivox/prince_06_machiavelli_64kb.mp3'],
      ['Chapters 24-26: Fortune & Exhortation to Liberate Italy', 'https://ia800204.us.archive.org/28/items/prince_librivox/prince_07_machiavelli_64kb.mp3']
    ],
    '6': (() => {
      const base = 'https://ia800205.us.archive.org/16/items/frankenstein_shelley_librivox/';
      const list = [
        ['Author Preface & Letters 1-4', base + 'frankenstein_01_shelley_64kb.mp3']
      ];
      for (let i = 1; i <= 24; i++) {
        const s = String(i + 1).padStart(2, '0');
        list.push([`Chapter ${i}`, `${base}frankenstein_${s}_shelley_64kb.mp3`]);
      }
      return list;
    })(),
    '7': (() => {
      const base = 'https://ia800208.us.archive.org/10/items/science_getting_rich_librivox/';
      const list = [
        ['Preface', base + 'scienceofgettingrich_00_wattles_64kb.mp3']
      ];
      for (let i = 1; i <= 17; i++) {
        const s = String(i).padStart(2, '0');
        list.push([`Chapter ${i}`, `${base}scienceofgettingrich_${s}_wattles_64kb.mp3`]);
      }
      return list;
    })(),
    '8': (() => {
      const base = 'https://ia800301.us.archive.org/14/items/dracula_librivox/';
      const list = [];
      for (let i = 1; i <= 27; i++) {
        const s = String(i).padStart(2, '0');
        list.push([`Chapter ${i}`, `${base}dracula_${s}_stoker_64kb.mp3`]);
      }
      return list;
    })(),
    '9': (() => {
      const base = 'https://ia800902.us.archive.org/28/items/thegreatgatsby_2101_librivox/';
      const list = [];
      for (let i = 1; i <= 10; i++) {
        const s = String(i).padStart(2, '0');
        list.push([`Chapter ${i}`, `${base}greatgatsby_${s}_fitzgerald_64kb.mp3`]);
      }
      return list;
    })(),
    '10': (() => {
      const base = 'https://ia800301.us.archive.org/1/items/tale_two_cities_librivox/';
      const list = [];
      for (let i = 1; i <= 45; i++) {
        const s = String(i).padStart(2, '0');
        list.push([`Track ${i}`, `${base}two_cities_${s}_dickens_64kb.mp3`]);
      }
      return list;
    })(),
    '11': (() => {
      const base = 'https://ia800201.us.archive.org/31/items/picture_of_dorian_gray_librivox/';
      const list = [
        ['Preface', base + 'doriangray_00_wilde_64kb.mp3']
      ];
      for (let i = 1; i <= 20; i++) {
        const s = String(i).padStart(2, '0');
        list.push([`Chapter ${i}`, `${base}doriangray_${s}_wilde_64kb.mp3`]);
      }
      return list;
    })(),
    '12': (() => {
      const base = 'https://ia800204.us.archive.org/2/items/the_prophet_librivox/';
      return [
        ['Part 1: The Coming of the Ship & Love', base + 'theprophet_01_gibran_64kb.mp3'],
        ['Part 2: Marriage, Children & Giving', base + 'theprophet_02_gibran_64kb.mp3'],
        ['Part 3: Eating, Drinking, Work & Joy', base + 'theprophet_03_gibran_64kb.mp3'],
        ['Part 4: Houses, Clothes, Buying & Selling', base + 'theprophet_04_gibran_64kb.mp3'],
        ['Part 5: Crime, Punishment, Laws & Freedom', base + 'theprophet_05_gibran_64kb.mp3'],
        ['Part 6: Reason, Passion, Pain & Self-Knowledge', base + 'theprophet_06_gibran_64kb.mp3'],
        ['Part 7: Teaching, Friendship, Talking, Time & Farewell', base + 'theprophet_07_gibran_64kb.mp3']
      ];
    })()
  };

  const selectedBook = sampleBooks.find(b => b.id === selectedBookId) || sampleBooks[0];
  const chapters = BOOK_CHAPTERS[selectedBookId] || BOOK_CHAPTERS['1'];
  const currentChapter = chapters[chapterIdx] || chapters[0];
  const audioSrc = currentChapter ? currentChapter[1] : '';

  // Resume progress on book switch
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('booksem_progress_' + selectedBookId) || '{}');
      const idx = (typeof p.chapter === 'number' && p.chapter < chapters.length) ? p.chapter : 0;
      setChapterIdx(idx);
      resumeTimeRef.current = p.time || 0;
      localStorage.setItem('booksem_player', JSON.stringify({ bookId: selectedBookId }));
    } catch {
      setChapterIdx(0);
      resumeTimeRef.current = 0;
    }
    setCurrentTime(0);
    setDuration(0);
  }, [selectedBookId]);

  // Save progress periodically
  useEffect(() => {
    if (!isPlayingAudio) return;
    const t = setInterval(() => {
      if (audioRef.current && audioRef.current.currentTime > 2) {
        localStorage.setItem('booksem_progress_' + selectedBookId, JSON.stringify({
          chapter: chapterIdx,
          time: Math.floor(audioRef.current.currentTime)
        }));
      }
    }, 4000);
    return () => clearInterval(t);
  }, [isPlayingAudio, selectedBookId, chapterIdx]);

  // Sleep timer engine
  useEffect(() => {
    if (!sleepEndsAt || sleepMode === 'chapter') return;
    const interval = setInterval(() => {
      if (Date.now() >= sleepEndsAt) {
        if (audioRef.current) audioRef.current.pause();
        setIsPlayingAudio(false);
        setSleepMode(null);
        setSleepEndsAt(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sleepEndsAt, sleepMode]);

  const setSleepTimer = (mins) => {
    if (mins === null) { setSleepMode(null); setSleepEndsAt(null); return; }
    if (mins === 'chapter') { setSleepMode('chapter'); setSleepEndsAt(null); return; }
    setSleepMode(mins);
    setSleepEndsAt(Date.now() + mins * 60 * 1000);
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
  };

  const skip = (secs) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + secs));
  };

  const handleLoaded = () => {
    const a = audioRef.current;
    if (!a) return;
    setDuration(a.duration || 0);
    a.playbackRate = playbackRate;
    if (resumeTimeRef.current > 0) { a.currentTime = resumeTimeRef.current; resumeTimeRef.current = 0; }
    if (autoPlayRef.current) {
      autoPlayRef.current = false;
      a.play().then(() => setIsPlayingAudio(true)).catch(() => setIsPlayingAudio(false));
    }
  };

  const handleEnded = () => {
    if (sleepMode === 'chapter') { setIsPlayingAudio(false); setSleepMode(null); return; }
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

  // Lock-screen / headphone controls
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentChapter) return;
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: currentChapter[0], artist: selectedBook.author, album: selectedBook.title,
      artwork: [{ src: selectedBook.cover, sizes: '400x400', type: 'image/jpeg' }]
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => goToChapter(chapterIdx - 1));
    navigator.mediaSession.setActionHandler('nexttrack', () => goToChapter(chapterIdx + 1));
    navigator.mediaSession.setActionHandler('seekbackward', () => skip(-15));
    navigator.mediaSession.setActionHandler('seekforward', () => skip(15));
  }, [chapterIdx, selectedBookId]);

  const openBook = (id) => {
    stopAll();
    setSelectedBookId(id);
    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlayingAudio) {
      a.pause();
      setIsPlayingAudio(false);
    } else {
      a.play().then(() => setIsPlayingAudio(true)).catch(err => {
        console.warn('Playback error:', err);
        setIsPlayingAudio(false);
      });
    }
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) audioRef.current.currentTime = val;
  };

  const changeRate = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) audioRef.current.playbackRate = rate;
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('marketplace')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <BookOpen className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
                Booksem<span className="text-amber-400">.com</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium">Listen & Read Audiobooks</span>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search audiobooks, classics, philosophy..." 
                className="w-full pl-9 pr-4 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg border border-slate-700 text-slate-200 transition"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Self-Publish</span>
            </button>
            <div className="relative cursor-pointer p-2 hover:bg-slate-800 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-slate-300" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-amber-500 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. SUB NAVIGATION */}
      <nav className="border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 flex space-x-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              activeTab === 'marketplace' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Book Store
          </button>
          <button
            onClick={() => setActiveTab('reader')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              activeTab === 'reader' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Headphones className="w-4 h-4 inline mr-2" />
            Listen & Read
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              activeTab === 'studio' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-4 h-4 inline mr-2" />
            Author Studio
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              activeTab === 'interview' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 inline mr-2" />
            Live Author Room
          </button>
        </div>
      </nav>

      {/* 3. MAIN CONTENT BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
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
                  Chapter 1 free for every title. Stream the world's most enduring wisdom, stoic philosophies, timeless novels, and strategic masterpieces on any device.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button 
                    onClick={() => openBook('1')}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center"
                  >
                    <Play className="w-4 h-4 mr-2 fill-slate-950" />
                    Start Listening Now
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
                    <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden">
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
                        <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-amber-400 transition">
                          {book.title}
                        </h3>
                        <p className="text-xs text-slate-400 mb-2">by {book.author}</p>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {book.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                        <div>
                          <span className="text-xs text-slate-500 block">Price</span>
                          <span className="text-lg font-bold text-white">
                            ${book.price}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openBook(book.id)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                            title="Listen to Chapter 1 free preview"
                          >
                            Ch. 1 Free
                          </button>
                          {isBookUnlocked(book.id) ? (
                            <button 
                              onClick={() => openBook(book.id)}
                              className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" /> Owned
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                setPaywallTargetBook(book);
                                setShowPaywallModal(true);
                              }}
                              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition shadow-sm shadow-amber-500/20"
                            >
                              Buy ${book.price}
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

        {/* TAB 2: READER & COMPLETE AUDIOBOOK PLAYER */}
        {activeTab === 'reader' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{selectedBook.title}</h1>
                <p className="text-slate-400 text-sm">Author: {selectedBook.author} | Narrated by: Real Human Voice (Public Domain LibriVox / Internet Archive)</p>
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
                    <div className="text-xs text-slate-400">Chapters 2–{chapters.length} require unlocking or an All-Access Pass.</div>
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
              {/* Invisible HTML5 Audio Element */}
              <audio
                ref={audioRef}
                src={audioSrc || undefined}
                onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                onLoadedMetadata={handleLoaded}
                onEnded={handleEnded}
                onPause={() => setIsPlayingAudio(false)}
                onPlay={() => setIsPlayingAudio(true)}
                preload="metadata"
              />

              <div className="flex items-center space-x-2 w-full md:w-auto">
                <button onClick={() => goToChapter(chapterIdx - 1)} disabled={chapterIdx === 0} className="p-2 text-slate-300 hover:text-amber-400 disabled:opacity-30" title="Previous chapter"><SkipBack className="w-5 h-5" /></button>
                <button onClick={() => skip(-15)} className="p-2 text-slate-300 hover:text-amber-400" title="Back 15 seconds"><RotateCcw className="w-5 h-5" /></button>
                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-slate-950 font-bold transition shadow-lg shadow-amber-500/20 flex-shrink-0"
                  title={isPlayingAudio ? 'Pause Narration' : 'Play Narration'}
                >
                  {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <button onClick={() => skip(15)} className="p-2 text-slate-300 hover:text-amber-400" title="Forward 15 seconds"><RotateCw className="w-5 h-5" /></button>
                <button onClick={() => goToChapter(chapterIdx + 1)} disabled={chapterIdx >= chapters.length - 1} className="p-2 text-slate-300 hover:text-amber-400 disabled:opacity-30" title="Next chapter"><SkipForward className="w-5 h-5" /></button>
                <div className="ml-2 min-w-0">
                  <span className="text-xs text-amber-400 font-bold block uppercase tracking-wider">Full Audiobook · Track {chapterIdx + 1} of {chapters.length}</span>
                  <p className="text-sm font-semibold text-white truncate max-w-[220px]">{currentChapter ? currentChapter[0] : ''}</p>
                </div>
              </div>

              {/* Working Scrubber with real dynamic progress */}
              <div className="w-full md:flex-1 max-w-lg flex items-center space-x-3">
                <span className="text-xs text-slate-400 font-mono w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <input 
                  type="range" 
                  min="0" 
                  max={duration || 100} 
                  value={currentTime} 
                  onChange={handleSeek}
                  className="flex-1 accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-xs text-slate-400 font-mono w-10">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Speed, Sleep & Chapter toggle */}
              <div className="flex items-center space-x-2">
                <select 
                  value={playbackRate} 
                  onChange={(e) => changeRate(parseFloat(e.target.value))}
                  className="bg-slate-800 border border-slate-700 text-xs rounded px-2 py-1 text-slate-200 cursor-pointer"
                >
                  <option value="0.75">0.75x</option>
                  <option value="1.0">1.0x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2.0">2.0x</option>
                </select>

                <select
                  value={sleepMode === null ? 'off' : sleepMode}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === 'off') setSleepTimer(null);
                    else if (v === 'chapter') setSleepTimer('chapter');
                    else setSleepTimer(parseInt(v, 10));
                  }}
                  className="bg-slate-800 border border-slate-700 text-xs rounded px-2 py-1 text-slate-200 cursor-pointer"
                  title={sleepLabel}
                >
                  <option value="off">Sleep: Off</option>
                  <option value="15">Sleep: 15m</option>
                  <option value="30">Sleep: 30m</option>
                  <option value="45">Sleep: 45m</option>
                  <option value="chapter">End of Ch.</option>
                </select>

                <button 
                  onClick={() => setShowChapters(!showChapters)}
                  className={`p-1.5 rounded text-xs border ${showChapters ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
                  title="Toggle chapter list"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chapter list - the complete book */}
            {showChapters && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 max-w-3xl mx-auto">
                <h3 className="text-sm font-bold text-white mb-3">Complete Audiobook — {chapters.length} tracks · narrated by real human volunteers (LibriVox / Archive.org)</h3>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                  {chapters.map((c, i) => {
                    const unlocked = isChapterUnlocked(selectedBookId, i);
                    return (
                      <button 
                        key={c[1]} 
                        onClick={() => goToChapter(i)} 
                        className={`w-full text-left px-3 py-2.5 text-sm flex items-center justify-between gap-3 transition ${
                          i === chapterIdx ? 'bg-amber-500/10 text-amber-300' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-xs w-8 text-slate-500">{i + 1}</span>
                          {i === chapterIdx && isPlayingAudio ? (
                            <Volume2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          ) : unlocked ? (
                            <Play className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" />
                          )}
                          <span className="truncate">{c[0]}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {i === 0 ? (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Free Preview
                            </span>
                          ) : !unlocked ? (
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400/90 border border-amber-500/20 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> Locked
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-500">
                              Unlocked
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Book Reading Canvas */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-3xl mx-auto shadow-sm">
              <div className="border-b border-slate-800 pb-4 mb-6 flex justify-between items-center text-xs text-slate-500 uppercase tracking-widest">
                <span>Reading Canvas</span>
                <span>{selectedBook.format}</span>
              </div>
              <div 
                className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4"
                style={{ fontSize: `${fontSize}px` }}
              >
                <h2 className="text-xl font-bold text-white mb-2">{currentChapter ? currentChapter[0] : selectedBook.title}</h2>
                <p>
                  Welcome to the complete unabridged edition of <em>{selectedBook.title}</em> on Booksem.
                  Use the player above to listen to the narration while you read along.
                </p>
                <p className="text-slate-400 italic">
                  "{selectedBook.description}"
                </p>
                <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
                  <p><strong>Chapter Navigation:</strong> Use the previous/next track buttons or click any track in the tracklist to jump directly to that chapter.</p>
                  <p><strong>Auto-Play:</strong> Tracks continuously advance to the next chapter automatically so you can binge-listen hands-free.</p>
                  <p><strong>Bookmark Memory:</strong> Your book, chapter, and position are saved automatically in your browser.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUTHOR STUDIO */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Author Recording Studio</h1>
                <p className="text-slate-400 text-sm">Self-narrate your book using our high-definition browser audio recorder.</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-xl mx-auto text-center space-y-6">
              <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-400">
                <Mic className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Direct-to-Booksem Narration</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Record your audiobook chapter by chapter. Audio files are automatically synchronized with your manuscript e-book.
                </p>
              </div>
              <div className="flex justify-center space-x-3">
                <button 
                  onClick={() => alert("Microphone access will initialize studio session.")}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition"
                >
                  Start Recording Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE AUTHOR INTERVIEW */}
        {activeTab === 'interview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Live Author Stage</h1>
                <p className="text-slate-400 text-sm">Interactive broadcast rooms for book signings, readings, and live audience Q&A.</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-xl mx-auto text-center space-y-6">
              <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-400">
                <Video className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Next Live Event Starting Soon</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Join upcoming live video interviews with featured authors and voice artists. Connect your microphone or submit questions via live chat.
                </p>
              </div>
              <button 
                onClick={() => alert("You'll be notified when the next author interview begins!")}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg transition border border-slate-700"
              >
                Notify Me When Live
              </button>
            </div>
          </div>
        )}

      </main>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 text-white space-y-4">
            <h3 className="text-lg font-bold">Publish to Booksem</h3>
            <p className="text-xs text-slate-400">Upload your PDF/EPUB manuscript along with your audio chapters to monetize on Booksem.</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Book Title</label>
                <input type="text" placeholder="Enter title" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Price (USD)</label>
                <input type="number" placeholder="4.99" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg"
              >
                Publish Book
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
                <Lock className="w-3 h-3" /> Chapter 1 Preview Complete
              </span>
              <h3 className="text-2xl font-bold mt-3 text-white">Unlock Full Audiobook & E-Book</h3>
              <p className="text-slate-400 text-sm mt-1">
                Continue reading & listening to <span className="text-amber-400 font-semibold">{paywallTargetBook.title}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Option A: Buy this single book */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
                <div>
                  <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">A La Carte</div>
                  <h4 className="font-bold text-white text-base mt-1">Buy This Book</h4>
                  <div className="text-3xl font-extrabold text-amber-400 mt-2">${paywallTargetBook.price}</div>
                  <p className="text-xs text-slate-400 mt-1">One-time payment. Permanent lifetime access to all chapters & audio.</p>
                </div>
                <button 
                  onClick={() => {
                    unlockBook(paywallTargetBook.id);
                    setShowPaywallModal(false);
                    if (selectedBookId === paywallTargetBook.id) {
                      setIsPlayingAudio(true);
                      if (audioRef.current) audioRef.current.play().catch(() => {});
                    }
                  }}
                  className="mt-5 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-lg transition shadow-md shadow-amber-500/20"
                >
                  Buy for ${paywallTargetBook.price}
                </button>
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
                    setHasMonthlyPass(true);
                    localStorage.setItem('booksem_has_pass', 'true');
                    setShowPaywallModal(false);
                    if (selectedBookId === paywallTargetBook.id) {
                      setIsPlayingAudio(true);
                      if (audioRef.current) audioRef.current.play().catch(() => {});
                    }
                  }}
                  className="mt-5 w-full bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs py-2.5 rounded-lg transition"
                >
                  Start Monthly Pass
                </button>
              </div>
            </div>

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
