import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen, Headphones, Mic, PenTool, ShoppingBag,
  Play, Pause, Star, Upload, Search, MessageSquare,
  Video, Users, Volume2, ShieldCheck, Heart, Share2,
  CheckCircle, ArrowRight, SkipBack, SkipForward, RotateCcw, RotateCw, Moon, List
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

  const sampleBooks = [
    {
      id: '1',
      title: 'The Art of War',
      author: 'Sun Tzu',
      genre: 'Non-Fiction',
      format: 'Audiobook & E-Book',
      price: 0.00,
      rating: 4.9,
      reviewsCount: 1420,
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
      description: 'The definitive ancient military treatise on strategy, tactical psychology, and overcoming conflict without confrontation.'
    },
    {
      id: '2',
      title: 'Think and Grow Rich',
      author: 'Napoleon Hill',
      genre: 'Non-Fiction',
      format: 'Audiobook & E-Book',
      price: 4.99,
      rating: 4.8,
      reviewsCount: 2890,
      cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
      description: 'The legendary blueprint on persistence, faith, and the 13 proven principles behind personal achievement and wealth creation.'
    },
    {
      id: '3',
      title: 'Meditations',
      author: 'Marcus Aurelius',
      genre: 'Non-Fiction',
      format: 'Audiobook & E-Book',
      price: 0.00,
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
      price: 0.00,
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
      price: 0.00,
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
      price: 0.00,
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
      price: 0.00,
      rating: 4.7,
      reviewsCount: 1120,
      cover: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=400',
      description: 'A practical, non-philosophical guide detailing how clear thought and purposeful daily action attract material abundance.'
    },
    {
      id: '8',
      title: 'Dracula',
      author: 'Bram Stoker',
      genre: 'Fiction',
      format: 'Audiobook & E-Book',
      price: 0.00,
      rating: 4.8,
      reviewsCount: 1980,
      cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
      description: 'The chilling epistolary horror adventure of Count Dracula attempting to migrate from Transylvania to Victorian England.'
    },
    {
      id: '9',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Fiction',
      format: 'Audiobook & E-Book',
      price: 0.00,
      rating: 4.9,
      reviewsCount: 3820,
      cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400',
      description: 'The glittering tragedy of Jay Gatsby, jazz age obsession, unreachable wealth, and the illusions of the American Dream.'
    },
    {
      id: '10',
      title: 'A Tale of Two Cities',
      author: 'Charles Dickens',
      genre: 'Fiction',
      format: 'Audiobook & E-Book',
      price: 0.00,
      rating: 4.7,
      reviewsCount: 1540,
      cover: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=400',
      description: 'It was the best of times, it was the worst of times: an epic panorama of Paris and London during the French Revolution.'
    },
    {
      id: '11',
      title: 'The Picture of Dorian Gray',
      author: 'Oscar Wilde',
      genre: 'Fiction',
      format: 'Audiobook & E-Book',
      price: 0.00,
      rating: 4.8,
      reviewsCount: 2210,
      cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
      description: 'A decadent philosophical novel about aesthetic hedonism, eternal youth, vanity, and the hidden rot of the soul.'
    },
    {
      id: '12',
      title: 'The Prophet',
      author: 'Kahlil Gibran',
      genre: 'Poetry & Philosophy',
      format: 'Audiobook & E-Book',
      price: 0.00,
      rating: 4.9,
      reviewsCount: 2750,
      cover: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400',
      description: 'Poetic fables offering spiritual wisdom on love, marriage, children, giving, work, joy, sorrow, and freedom.'
    }
  ];


  const BOOK_TEXT = {
    "The Art of War": {
      "chapter": "Chapter 1: Laying Plans",
      "paragraphs": [
        "Sun Tzu said: The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.",
        "The art of war, then, is governed by five constant factors, to be taken into account in one’s deliberations, when seeking to determine the conditions obtaining in the field. These are: The Moral Law; Heaven; Earth; The Commander; Method and discipline.",
        "The Moral Law causes the people to be in complete accord with their ruler, so that they will follow him regardless of their lives, undismayed by any danger.",
        "Heaven signifies night and day, cold and heat, times and seasons. Earth comprises distances, great and small; danger and security; open ground and narrow passes; the chances of life and death.",
        "The Commander stands for the virtues of wisdom, sincerely, benevolence, courage and strictness. By method and discipline are to be understood the marshaling of the army in its proper subdivisions, the graduations of rank among the officers, the maintenance of roads by which supplies may reach the army, and the control of military expenditure.",
        "These five heads should be familiar to every general: he who knows them will be victorious; he who knows them not will fail.",
        "All warfare is based on deception. Hence, when able to attack, we must seem unable; when using our forces, we must seem inactive; when we are near, we must make the enemy believe we are far away; when far away, we must make him believe we are near.",
        "Hold out baits to entice the enemy. Feign disorder, and crush him. If he is secure at all points, be prepared for him. If he is in superior strength, evade him."
      ]
    },
    "Think and Grow Rich": {
      "chapter": "Chapter 1: Thoughts Are Things",
      "paragraphs": [
        "Truly, thoughts are things, and powerful things at that, when they are mixed with definiteness of purpose, persistence, and a burning desire for their translation into riches, or other material objects.",
        "A little more than thirty years ago, Edwin C. Barnes discovered how true it is that men really do think and grow rich. His discovery did not come about at one sitting. It came little by little, beginning with a burning desire to become a business associate of the great Edison."
      ]
    },
    "Meditations": {
      "chapter": "Book One",
      "paragraphs": [
        "From my grandfather Verus I learned good morals and the government of my temper.",
        "From the reputation and remembrance of my father, modesty and a manly character. From my mother, piety and beneficence, and abstinence, not only from evil deeds, but even from evil thoughts; and further, simplicity in my way of living, far removed from the habits of the rich."
      ]
    },
    "Pride and Prejudice": {
      "chapter": "Chapter 1",
      "paragraphs": [
        "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
        "However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters."
      ]
    },
    "The Prince": {
      "chapter": "Chapter 1: How Many Kinds of Principalities There Are",
      "paragraphs": [
        "All states, all powers, that have held and hold rule over men have been and are either republics or principalities.",
        "Principalities are either hereditary, in which the family has been long established; or they are new. The new are either entirely new, or they are, as it were, members annexed to the hereditary state of the prince who has acquired them."
      ]
    },
    "Frankenstein": {
      "chapter": "Letter 1",
      "paragraphs": [
        "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.",
        "I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight."
      ]
    },
    "The Science of Getting Rich": {
      "chapter": "Chapter 1: The Right to Be Rich",
      "paragraphs": [
        "Whatever may be said in praise of poverty, the fact remains that it is not possible to live a really complete or successful life unless one is rich.",
        "No man can rise to his greatest possible height in talent or soul development unless he has plenty of money; for to unfold the soul and to develop talent he must have many things to use, and he cannot have these things unless he has money to buy them with."
      ]
    },
    "Dracula": {
      "chapter": "Chapter 1: Jonathan Harker's Journal",
      "paragraphs": [
        "Left Munich at 8:35 P.M., on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late.",
        "Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets. I feared to go very far from the station, as we had arrived late and would start as near the correct time as possible."
      ]
    },
    "The Great Gatsby": {
      "chapter": "Chapter 1",
      "paragraphs": [
        "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.",
        "Whenever you feel like criticizing any one, he told me, just remember that all the people in this world haven't had the advantages that you've had."
      ]
    },
    "A Tale of Two Cities": {
      "chapter": "Book the First, Chapter 1: The Period",
      "paragraphs": [
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
        "We had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way."
      ]
    },
    "The Picture of Dorian Gray": {
      "chapter": "Chapter 1",
      "paragraphs": [
        "The studio was filled with the rich odour of roses, and when the light summer wind stirred amidst the trees of the garden, there came through the open door the heavy scent of the lilac, or the more delicate perfume of the pink-flowering thorn.",
        "From the corner of the divan of Persian saddle-bags on which he was lying, smoking, as was his custom, innumerable cigarettes, Lord Henry Wotton could just catch the gleam of the honey-sweet and long-blossoming laburnum."
      ]
    },
    "The Prophet": {
      "chapter": "The Coming of the Ship",
      "paragraphs": [
        "Almustafa, the chosen and the beloved, who was a dawn unto his own day, had waited twelve years in the city of Orphalese for his ship that was to return and bear him back to the isle of his birth.",
        "And in the twelfth year, on the seventh day of Ielool, the month of reaping, he climbed the hill without the city walls and looked seaward; and he beheld his ship coming with the mist."
      ]
    }
  };
  const AUDIOBOOKS = {"1": {"base": "https://archive.org/download/art_of_war_librivox/", "chapters": [["1 Laying Plans - 2 Waging War", "art_of_war_01-02_sun_tzu.mp3"], ["3 Attack By Stratagem - 4 Tactical Dispositions", "art_of_war_03-04_sun_tzu.mp3"], ["5 Energy - 6 Weak Points and Strong", "art_of_war_05-06_sun_tzu.mp3"], ["7 Maneuvering - 8 Variation in Tactics", "art_of_war_07-08_sun_tzu.mp3"], ["9 The Army on the March - 10 Terrain", "art_of_war_09-10_sun_tzu.mp3"], ["11 The Nine Situations", "art_of_war_11_sun_tzu.mp3"], ["12 The Attack By Fire - 13 The Use of Spies", "art_of_war_12-13_sun_tzu.mp3"]]}, "2": {"base": "https://archive.org/download/think-and-grow-rich_202408/", "chapters": [["Chapter 0 Part 2 (What Do You Want Most)", "Think and Grow Rich - Chapter 0 Part 2 (What Do You Want Most).mp3"], ["Chapter 0 Part 3 (Author Tributes)", "Think and Grow Rich - Chapter 0 Part 3 (Author Tributes).mp3"], ["Chapter 0 Part 4 (Publisher's Preface)", "Think and Grow Rich - Chapter 0 Part 4 (Publisher's Preface).mp3"], ["Chapter 0 Part 5 (Author's Preface Part 1)", "Think and Grow Rich - Chapter 0 Part 5 (Author's Preface Part 1).mp3"], ["Chapter 0 Part 6 (Author's Preface Part 2)", "Think and Grow Rich - Chapter 0 Part 6 (Author's Preface Part 2).mp3"], ["Chapter 0 Part 7 (Author's Preface Part 3)", "Think and Grow Rich - Chapter 0 Part 7 (Author's Preface Part 3).mp3"], ["Chapter 1 Part 1", "Think and Grow Rich - Chapter 1 Part 1.mp3"], ["Chapter 1 Part 2", "Think and Grow Rich - Chapter 1 Part 2.mp3"], ["Chapter 1 Part 3", "Think and Grow Rich - Chapter 1 Part 3.mp3"], ["Chapter 1 Part 4", "Think and Grow Rich - Chapter 1 Part 4.mp3"], ["Chapter 1 Part 5", "Think and Grow Rich - Chapter 1 Part 5.mp3"], ["Chapter 2 Part 1", "Think and Grow Rich - Chapter 2 Part 1.mp3"], ["Chapter 2 Part 2", "Think and Grow Rich - Chapter 2 Part 2.mp3"], ["Chapter 2 Part 3", "Think and Grow Rich - Chapter 2 Part 3.mp3"], ["Chapter 2 Part 4", "Think and Grow Rich - Chapter 2 Part 4.mp3"], ["Chapter 2 Part 5", "Think and Grow Rich - Chapter 2 Part 5.mp3"], ["Chapter 2 Part 6", "Think and Grow Rich - Chapter 2 Part 6.mp3"], ["Chapter 2 Part 7", "Think and Grow Rich - Chapter 2 Part 7.mp3"], ["Chapter 3 Part 1", "Think and Grow Rich - Chapter 3 Part 1.mp3"], ["Chapter 3 Part 2", "Think and Grow Rich - Chapter 3 Part 2.mp3"], ["Chapter 3 Part 3", "Think and Grow Rich - Chapter 3 Part 3.mp3"], ["Chapter 3 Part 4", "Think and Grow Rich - Chapter 3 Part 4.mp3"], ["Chapter 3 Part 5", "Think and Grow Rich - Chapter 3 Part 5.mp3"], ["Chapter 3 Part 6", "Think and Grow Rich - Chapter 3 Part 6.mp3"], ["Chapter 3 Part 7", "Think and Grow Rich - Chapter 3 Part 7.mp3"], ["Chapter 4 Part 1", "Think and Grow Rich - Chapter 4 Part 1.mp3"], ["Chapter 4 Part 2", "Think and Grow Rich - Chapter 4 Part 2.mp3"], ["Chapter 5 Part 1", "Think and Grow Rich - Chapter 5 Part 1.mp3"], ["Chapter 5 Part 2", "Think and Grow Rich - Chapter 5 Part 2.mp3"], ["Chapter 5 Part 3", "Think and Grow Rich - Chapter 5 Part 3.mp3"], ["Chapter 5 Part 4", "Think and Grow Rich - Chapter 5 Part 4.mp3"], ["Chapter 5 Part 5", "Think and Grow Rich - Chapter 5 Part 5.mp3"], ["Chapter 6 Part 1", "Think and Grow Rich - Chapter 6 Part 1.mp3"], ["Chapter 6 Part 2", "Think and Grow Rich - Chapter 6 Part 2.mp3"], ["Chapter 6 Part 3", "Think and Grow Rich - Chapter 6 Part 3.mp3"], ["Chapter 6 Part 4", "Think and Grow Rich - Chapter 6 Part 4.mp3"], ["Chapter 6 Part 5", "Think and Grow Rich - Chapter 6 Part 5.mp3"], ["Chapter 7 Part 1", "Think and Grow Rich - Chapter 7 Part 1.mp3"], ["Chapter 7 Part 2", "Think and Grow Rich - Chapter 7 Part 2.mp3"], ["Chapter 7 Part 3", "Think and Grow Rich - Chapter 7 Part 3.mp3"], ["Chapter 7 Part 4", "Think and Grow Rich - Chapter 7 Part 4.mp3"], ["Chapter 7 Part 5", "Think and Grow Rich - Chapter 7 Part 5.mp3"], ["Chapter 7 Part 6", "Think and Grow Rich - Chapter 7 Part 6.mp3"], ["Chapter 7 Part 7", "Think and Grow Rich - Chapter 7 Part 7.mp3"], ["Chapter 7 Part 8", "Think and Grow Rich - Chapter 7 Part 8.mp3"], ["Chapter 7 Part 9", "Think and Grow Rich - Chapter 7 Part 9.mp3"], ["Chapter 7 Part 10", "Think and Grow Rich - Chapter 7 Part 10.mp3"], ["Chapter 7 Part 11", "Think and Grow Rich - Chapter 7 Part 11.mp3"], ["Chapter 7 Part 12", "Think and Grow Rich - Chapter 7 Part 12.mp3"], ["Chapter 7 Part 13", "Think and Grow Rich - Chapter 7 Part 13.mp3"], ["Chapter 7 Part 14", "Think and Grow Rich - Chapter 7 Part 14.mp3"], ["Chapter 7 Part 15", "Think and Grow Rich - Chapter 7 Part 15.mp3"], ["Chapter 8 Part 1", "Think and Grow Rich - Chapter 8 Part 1.mp3"], ["Chapter 8 Part 2", "Think and Grow Rich - Chapter 8 Part 2.mp3"], ["Chapter 8 Part 3", "Think and Grow Rich - Chapter 8 Part 3.mp3"], ["Chapter 8 Part 4", "Think and Grow Rich - Chapter 8 Part 4.mp3"], ["Chapter 9 Part 1", "Think and Grow Rich - Chapter 9 Part 1.mp3"], ["Chapter 9 Part 2", "Think and Grow Rich - Chapter 9 Part 2.mp3"], ["Chapter 9 Part 3", "Think and Grow Rich - Chapter 9 Part 3.mp3"], ["Chapter 9 Part 4", "Think and Grow Rich - Chapter 9 Part 4.mp3"], ["Chapter 9 Part 5", "Think and Grow Rich - Chapter 9 Part 5.mp3"], ["Chapter 9 Part 6", "Think and Grow Rich - Chapter 9 Part 6.mp3"], ["Chapter 10 Part 1", "Think and Grow Rich - Chapter 10 Part 1.mp3"], ["Chapter 10 Part 2", "Think and Grow Rich - Chapter 10 Part 2.mp3"], ["Chapter 11 Part 1", "Think and Grow Rich - Chapter 11 Part 1.mp3"], ["Chapter 11 Part 2", "Think and Grow Rich - Chapter 11 Part 2.mp3"], ["Chapter 11 Part 3", "Think and Grow Rich - Chapter 11 Part 3.mp3"], ["Chapter 11 Part 4", "Think and Grow Rich - Chapter 11 Part 4.mp3"], ["Chapter 11 Part 5", "Think and Grow Rich - Chapter 11 Part 5.mp3"], ["Chapter 11 Part 6", "Think and Grow Rich - Chapter 11 Part 6.mp3"], ["Chapter 11 Part 7", "Think and Grow Rich - Chapter 11 Part 7.mp3"], ["Chapter 11 Part 8", "Think and Grow Rich - Chapter 11 Part 8.mp3"], ["Chapter 12 Part 1", "Think and Grow Rich - Chapter 12 Part 1.mp3"], ["Chapter 12 Part 2", "Think and Grow Rich - Chapter 12 Part 2.mp3"], ["Chapter 12 Part 3", "Think and Grow Rich - Chapter 12 Part 3.mp3"], ["Chapter 13 Part 1", "Think and Grow Rich - Chapter 13 Part 1.mp3"], ["Chapter 13 Part 2", "Think and Grow Rich - Chapter 13 Part 2.mp3"], ["Chapter 14 Part 1", "Think and Grow Rich - Chapter 14 Part 1.mp3"], ["Chapter 14 Part 2", "Think and Grow Rich - Chapter 14 Part 2.mp3"], ["Chapter 14 Part 3", "Think and Grow Rich - Chapter 14 Part 3.mp3"], ["Chapter 14 Part 4", "Think and Grow Rich - Chapter 14 Part 4.mp3"], ["Chapter 15 Part 1", "Think and Grow Rich - Chapter 15 Part 1.mp3"], ["Chapter 15 Part 2", "Think and Grow Rich - Chapter 15 Part 2.mp3"], ["Chapter 15 Part 3", "Think and Grow Rich - Chapter 15 Part 3.mp3"], ["Chapter 15 Part 4", "Think and Grow Rich - Chapter 15 Part 4.mp3"], ["Chapter 15 Part 5", "Think and Grow Rich - Chapter 15 Part 5.mp3"], ["Chapter 15 Part 6", "Think and Grow Rich - Chapter 15 Part 6.mp3"], ["Chapter 15 Part 7", "Think and Grow Rich - Chapter 15 Part 7.mp3"], ["Chapter 15 Part 8", "Think and Grow Rich - Chapter 15 Part 8.mp3"], ["Chapter 15 Part 9", "Think and Grow Rich - Chapter 15 Part 9.mp3"], ["Chapter 15 Part 10", "Think and Grow Rich - Chapter 15 Part 10.mp3"], ["Chapter 15 Part 11", "Think and Grow Rich - Chapter 15 Part 11.mp3"], ["Chapter 15 Part 12", "Think and Grow Rich - Chapter 15 Part 12.mp3"]]}, "3": {"base": "https://archive.org/download/meditations_0708_librivox/", "chapters": [["00 - Introduction", "meditations_00_marcusaurelius.mp3"], ["01 - Section 01", "meditations_01_marcusaurelius.mp3"], ["02 - Section 02", "meditations_02_marcusaurelius.mp3"], ["03 - Section 03", "meditations_03_marcusaurelius.mp3"], ["04 - Section 04", "meditations_04_marcusaurelius.mp3"], ["05 - Section 05", "meditations_05_marcusaurelius.mp3"], ["06 - Section 06", "meditations_06_marcusaurelius.mp3"], ["07 - Section 07", "meditations_07_marcusaurelius.mp3"], ["08 - Section 08", "meditations_08_marcusaurelius.mp3"], ["09 - Section 09", "meditations_09_marcusaurelius.mp3"], ["10 - Section 10", "meditations_10_marcusaurelius.mp3"], ["11 - Section 11", "meditations_11_marcusaurelius.mp3"], ["12 - Section 12", "meditations_12_marcusaurelius.mp3"], ["13 - M. Aurelius Antoninus, by George Long M.A.", "meditations_13_marcusaurelius.mp3"], ["14 - The Philosophy of Marcus Aurelius by George Long", "meditations_14_marcusaurelius.mp3"]]}, "4": {"base": "https://archive.org/download/pride_prejudice_1102_librivox/", "chapters": [["01- Chapters 1-2", "prideandprejudice_01_austen.mp3"], ["02 - Chapter 3", "prideandprejudice_02_austen.mp3"], ["03 - Chapters 4-5", "prideandprejudice_03_austen.mp3"], ["04 - Chapter 6", "prideandprejudice_04_austen.mp3"], ["05 - Chapter 7", "prideandprejudice_05_austen.mp3"], ["06 - Chapter 8", "prideandprejudice_06_austen.mp3"], ["07 - Chapter 9", "prideandprejudice_07_austen.mp3"], ["08 - Chapter 10", "prideandprejudice_08_austen.mp3"], ["09 - Chapter 11", "prideandprejudice_09_austen.mp3"], ["10 - Chapters 12-13", "prideandprejudice_10_austen.mp3"], ["11 - Chapters 14-15", "prideandprejudice_11_austen.mp3"], ["12 - Chapter 16", "prideandprejudice_12_austen.mp3"], ["13 - Chapter 17", "prideandprejudice_13_austen.mp3"], ["14 - Chapter 18", "prideandprejudice_14_austen.mp3"], ["15 - Chapter 19", "prideandprejudice_15_austen.mp3"], ["16 - Chapter 20", "prideandprejudice_16_austen.mp3"], ["17 - Chapter 21", "prideandprejudice_17_austen.mp3"], ["18 - Chapter 22", "prideandprejudice_18_austen.mp3"], ["19 - Chapter 23", "prideandprejudice_19_austen.mp3"], ["20 - Chapter 24", "prideandprejudice_20_austen.mp3"], ["21 - Chapter 25", "prideandprejudice_21_austen.mp3"], ["22 - Chapter 26", "prideandprejudice_22_austen.mp3"], ["23 - Chapter 27", "prideandprejudice_23_austen.mp3"], ["24 - Chapter 28", "prideandprejudice_24_austen.mp3"], ["25 - Chapter 29", "prideandprejudice_25_austen.mp3"], ["26 - Chapter 30", "prideandprejudice_26_austen.mp3"], ["27 - Chapter 31", "prideandprejudice_27_austen.mp3"], ["28 - Chapter 32", "prideandprejudice_28_austen.mp3"], ["29 - Chapter 33", "prideandprejudice_29_austen.mp3"], ["30 - Chapter 34", "prideandprejudice_30_austen.mp3"], ["31 - Chapter 35", "prideandprejudice_31_austen.mp3"], ["32 - Chapter 36", "prideandprejudice_32_austen.mp3"], ["33 - Chapter 37", "prideandprejudice_33_austen.mp3"], ["34 - Chapter 38", "prideandprejudice_34_austen.mp3"], ["35 - Chapter 39", "prideandprejudice_35_austen.mp3"], ["36 - Chapter 40", "prideandprejudice_36_austen.mp3"], ["37 - Chapter 41", "prideandprejudice_37_austen.mp3"], ["38 - Chapter 42", "prideandprejudice_38_austen.mp3"], ["39 - Chapter 43", "prideandprejudice_39_austen.mp3"], ["40 - Chapter 44", "prideandprejudice_40_austen.mp3"], ["41 - Chapter 45", "prideandprejudice_41_austen.mp3"], ["42 - Chapter 46", "prideandprejudice_42_austen.mp3"], ["43 - Chapter 47", "prideandprejudice_43_austen.mp3"], ["44 - Chapter 48", "prideandprejudice_44_austen.mp3"], ["45 - Chapter 49", "prideandprejudice_45_austen.mp3"], ["46 - Chapter 50", "prideandprejudice_46_austen.mp3"], ["47 - Chapter 51", "prideandprejudice_47_austen.mp3"], ["48 - Chapter 52", "prideandprejudice_48_austen.mp3"], ["49 - Chapter 53", "prideandprejudice_49_austen.mp3"], ["50 - Chapter 54", "prideandprejudice_50_austen.mp3"], ["51 - Chapter 55", "prideandprejudice_51_austen.mp3"], ["52 - Chapter 56", "prideandprejudice_52_austen.mp3"], ["53 - Chapter 57", "prideandprejudice_53_austen.mp3"], ["54 - Chapter 58", "prideandprejudice_54_austen.mp3"], ["55 - Chapter 59", "prideandprejudice_55_austen.mp3"], ["56 - Chapter 60", "prideandprejudice_56_austen.mp3"], ["57 - Chapter 61", "prideandprejudice_57_austen.mp3"]]}, "5": {"base": "https://archive.org/download/prince_pa_librivox/", "chapters": [["00 - The Prince - Front matter", "prince_00_machiavelli.mp3"], ["01 - The Prince - Ch. 01-03", "prince_01_machiavelli.mp3"], ["02 - The Prince - Ch. 04-06", "prince_02_machiavelli.mp3"], ["03 - The Prince - Ch. 07-08", "prince_03_machiavelli.mp3"], ["04 - The Prince - Ch. 09-11", "prince_04_machiavelli.mp3"], ["05 - The Prince - Ch. 12-13", "prince_05_machiavelli.mp3"], ["06 - The Prince - Ch. 14-16", "prince_06_machiavelli.mp3"], ["07 - The Prince - Ch. 17-18", "prince_07_machiavelli.mp3"], ["08 - The Prince - Ch. 19", "prince_08_machiavelli.mp3"], ["09 - The Prince - Ch. 20-22", "prince_09_machiavelli.mp3"], ["10 - The Prince - Ch. 23-26", "prince_10_machiavelli.mp3"], ["11 - The Prince - Appendix 1", "prince_11_machiavelli.mp3"], ["12 - The Life of Castruccio Castracani of Lucca - Part 1", "prince_12_machiavelli.mp3"], ["13 - The Life of Castruccio Castracani of Lucca - Part 2", "prince_13_machiavelli.mp3"]]}, "6": {"base": "https://archive.org/download/frankenstein_cs_librivox/", "chapters": [["01 - Dedication and Preface", "frankenstein_01_shelley.mp3"], ["02 - Vol. I, Letter I", "frankenstein_02_shelley.mp3"], ["03 - Vol. I, Letter II", "frankenstein_03_shelley.mp3"], ["04 - Vol. I, Letter III", "frankenstein_04_shelley.mp3"], ["05 - Vol. I, Letter IV", "frankenstein_05_shelley.mp3"], ["06 - Vol. I, Chapter I", "frankenstein_06_shelley.mp3"], ["07 - Vol. I, Chapter II", "frankenstein_07_shelley.mp3"], ["08 - Vol. I, Chapter III", "frankenstein_08_shelley.mp3"], ["09 - Vol. I, Chapter IV", "frankenstein_09_shelley.mp3"], ["10 - Vol. I, Chapter V", "frankenstein_10_shelley.mp3"], ["11 - Vol. I, Chapter VI", "frankenstein_11_shelley.mp3"], ["12 - Vol. I, Chapter VII", "frankenstein_12_shelley.mp3"], ["13 - Vol. II, Chapter I", "frankenstein_13_shelley.mp3"], ["14 - Vol. II, Chapter II", "frankenstein_14_shelley.mp3"], ["15 - Vol. II, Chapter III", "frankenstein_15_shelley.mp3"], ["16 - Vol. II, Chapter IV", "frankenstein_16_shelley.mp3"], ["17 - Vol. II, Chapter V", "frankenstein_17_shelley.mp3"], ["18 - Vol. II, Chapter VI", "frankenstein_18_shelley.mp3"], ["19 - Vol. II, Chapter VII", "frankenstein_19_shelley.mp3"], ["20 - Vol. II, Chapter VIII", "frankenstein_20_shelley.mp3"], ["21 - Vol. II, Chapter IX", "frankenstein_21_shelley.mp3"], ["22 - Vol. III, Chapter I", "frankenstein_22_shelley.mp3"], ["23 - Vol. III, Chapter II", "frankenstein_23_shelley.mp3"], ["24 - Vol. III, Chapter III", "frankenstein_24_shelley.mp3"], ["25 - Vol. III, Chapter IV", "frankenstein_25_shelley.mp3"], ["26 - Vol. III, Chapter V", "frankenstein_26_shelley.mp3"], ["27 - Vol. III, Chapter VI", "frankenstein_27_shelley.mp3"], ["28 - Vol. III, Chapter VII", "frankenstein_28_shelley.mp3"], ["29 - Vol. III, Letters", "frankenstein_29_shelley.mp3"]]}, "7": {"base": "https://archive.org/download/TheScienceofGettingRich/", "chapters": [["Science of Getting Rich - Preface", "01_Preface.mp3"], ["Science of Getting Rich - Chapter 1: The Right to Be Rich", "02_ChapterOne.mp3"], ["Science of Getting Rich - Chapter 2: There Is a Science of Getting Rich", "03_ChapterTwo.mp3"], ["Science of Getting Rich - Chapter 3: Is Opportunity Monopolized?", "04_ChapterThree.mp3"], ["Science of Getting Rich - Chapter 4: The First Principle in The Science of Getting Rich", "05_ChapterFour.mp3"], ["Science of Getting Rich - Chapter 5: Increasing Life", "06_ChapterFive.mp3"], ["Science of Getting Rich - Chapter 6: How Riches Come to You", "07_ChapterSix.mp3"], ["Science of Getting Rich - Chapter 7: Gratitude", "08_ChapterSeven.mp3"], ["Science of Getting Rich - Chapter 8: Thinking in the Certain Way", "09_ChapterEight.mp3"], ["Science of Getting Rich - Chapter 9: How to Use the Will", "10_ChapterNine.mp3"], ["Science of Getting Rich - Chapter 10: Further Use of the Will", "11_ChapterTen.mp3"], ["Science of Getting Rich - Chapter 11: Acting in the Certain Way", "12_ChapterEleven.mp3"], ["Science of Getting Rich - Chapter 12: Efficient Action", "13_ChapterTwelve.mp3"], ["Science of Getting Rich - Chapter 13: Getting Into the Right Business", "14_ChapterThirteen.mp3"], ["Science of Getting Rich - Chapter 14: The Impression of Increase", "15_ChapterFourteen.mp3"], ["Science of Getting Rich - Chapter 15: The Advancing Man", "16_ChapterFifteen.mp3"], ["Science of Getting Rich - Chapter 16: Some Cautions, and Concluding Observations", "17_ChapterSixteen.mp3"], ["Science of Getting Rich - Chapter 17: Summary of the Science of Getting Rich", "18_ChapterSeventeen.mp3"]]}, "8": {"base": "https://archive.org/download/dracula_librivox/", "chapters": [["Chapter 01", "dracula_01_stoker.mp3"], ["Chapter 02", "dracula_02_stoker.mp3"], ["Chapter 03", "dracula_03_stoker.mp3"], ["Chapter 04", "dracula_04_stoker.mp3"], ["Chapter 05", "dracula_05_stoker.mp3"], ["Chapter 06", "dracula_06_stoker.mp3"], ["Chapter 07", "dracula_07_stoker.mp3"], ["Chapter 08", "dracula_08_stoker.mp3"], ["Chapter 09", "dracula_09_stoker.mp3"], ["Chapter 10", "dracula_10_stoker.mp3"], ["Chapter 11", "dracula_11_stoker.mp3"], ["Chapter 12", "dracula_12_stoker.mp3"], ["Chapter 13", "dracula_13_stoker.mp3"], ["Chapter 14", "dracula_14_stoker.mp3"], ["Chapter 15", "dracula_15_stoker.mp3"], ["Chapter 16", "dracula_16_stoker.mp3"], ["Chapter 17", "dracula_17_stoker.mp3"], ["Chapter 18", "dracula_18_stoker.mp3"], ["Chapter 19", "dracula_19_stoker.mp3"], ["Chapter 20", "dracula_20_stoker.mp3"], ["Chapter 21", "dracula_21_stoker.mp3"], ["Chapter 22", "dracula_22_stoker.mp3"], ["Chapter 23", "dracula_23_stoker.mp3"], ["Chapter 24", "dracula_24_stoker.mp3"], ["Chapter 25", "dracula_25_stoker.mp3"], ["Chapter 26", "dracula_26_stoker.mp3"], ["Chapter 27", "dracula_27_stoker.mp3"]]}, "9": {"base": "https://archive.org/download/thegreatgatsbyversion4_2402_librivox/", "chapters": [["00 - Introduction", "greatgatsby4_00_fitzgerald.mp3"], ["01 - Chapter 1", "greatgatsby4_01_fitzgerald.mp3"], ["02 - Chapter 2", "greatgatsby4_02_fitzgerald.mp3"], ["03 - Chapter 3", "greatgatsby4_03_fitzgerald.mp3"], ["04 - Chapter 4", "greatgatsby4_04_fitzgerald.mp3"], ["05 - Chapter 5", "greatgatsby4_05_fitzgerald.mp3"], ["06 - Chapter 6", "greatgatsby4_06_fitzgerald.mp3"], ["07 - Chapter 7", "greatgatsby4_07_fitzgerald.mp3"], ["08 - Chapter 8", "greatgatsby4_08_fitzgerald.mp3"], ["09 - Chapter 9", "greatgatsby4_09_fitzgerald.mp3"]]}, "10": {"base": "https://archive.org/download/tale_two_cities_librivox/", "chapters": [["Bk1 Ch01 - The Period", "tale_of_two_cities_01_dickens.mp3"], ["Bk1 Ch02 - The Mail", "tale_of_two_cities_02_dickens.mp3"], ["Bk1 Ch03 - The Night Shadows", "tale_of_two_cities_03_dickens.mp3"], ["Bk1 Ch04 - The Preparation", "tale_of_two_cities_04_dickens.mp3"], ["Bk1 Ch05 - The Wine Shop", "tale_of_two_cities_05_dickens.mp3"], ["Bk1 Ch06 - The Shoemaker", "tale_of_two_cities_06_dickens.mp3"], ["Bk2 Ch01 - Five Years Later", "tale_of_two_cities_07_dickens.mp3"], ["Bk2 Ch02 - A Sight", "tale_of_two_cities_08_dickens.mp3"], ["Bk2 Ch03 - A Disappointment", "tale_of_two_cities_09_dickens.mp3"], ["Bk2 Ch04 - Congratulatory", "tale_of_two_cities_10_dickens.mp3"], ["Bk2 Ch05 - The Jackal", "tale_of_two_cities_11_dickens.mp3"], ["Bk2 Ch06 - Hundreds of People", "tale_of_two_cities_12_dickens.mp3"], ["Bk2 Ch07 - Monseigneur in Town", "tale_of_two_cities_13_dickens.mp3"], ["Bk2 Ch08 - Monseigneur in the Country", "tale_of_two_cities_14_dickens.mp3"], ["Bk2 Ch09 - The Gorgon's Head", "tale_of_two_cities_15_dickens.mp3"], ["Bk2 Ch10 - Two Promises", "tale_of_two_cities_16_dickens.mp3"], ["Bk2 Ch11 - A Companion Picture", "tale_of_two_cities_17_dickens.mp3"], ["Bk2 Ch12 - The Fellow of Delicacy", "tale_of_two_cities_18_dickens.mp3"], ["Bk2 Ch13 - The Fellow of no Delicacy", "tale_of_two_cities_19_dickens.mp3"], ["Bk2 Ch14 - The Honest Tradesman", "tale_of_two_cities_20_dickens.mp3"], ["Bk2 Ch15 - Knitting", "tale_of_two_cities_21_dickens.mp3"], ["Bk2 Ch16 - Still Knitting", "tale_of_two_cities_22_dickens.mp3"], ["Bk2 Ch17 - One Night", "tale_of_two_cities_23_dickens.mp3"], ["Bk2 Ch18 - Nine Days", "tale_of_two_cities_24_dickens.mp3"], ["Bk2 Ch19 - An Opinion", "tale_of_two_cities_25_dickens.mp3"], ["Bk2 Ch20 - A Plea", "tale_of_two_cities_26_dickens.mp3"], ["Bk2 Ch21 - Echoing Footsteps", "tale_of_two_cities_27_dickens.mp3"], ["Bk2 Ch22 - The Sea Still Rises", "tale_of_two_cities_28_dickens.mp3"], ["Bk2 Ch23 - Fire Rises", "tale_of_two_cities_29_dickens.mp3"], ["Bk2 Ch24 - Drawn to the Loadstone Rock", "tale_of_two_cities_30_dickens.mp3"], ["Bk3 Ch01 - In Secret", "tale_of_two_cities_31_dickens.mp3"], ["Bk3 Ch02 - The Grindstone", "tale_of_two_cities_32_dickens.mp3"], ["Bk3 Ch03 - The Shadow", "tale_of_two_cities_33_dickens.mp3"], ["Bk3 Ch04 - Calm in Storm", "tale_of_two_cities_34_dickens.mp3"], ["Bk3 Ch05 - The Wood Sawyer", "tale_of_two_cities_35_dickens.mp3"], ["Bk3 Ch06 - Triumph", "tale_of_two_cities_36_dickens.mp3"], ["Bk3 Ch07 - A Knock at the Door", "tale_of_two_cities_37_dickens.mp3"], ["Bk3 Ch08 - A Hand at Cards", "tale_of_two_cities_38_dickens.mp3"], ["Bk3 Ch09 - The Game Made", "tale_of_two_cities_39_dickens.mp3"], ["Bk3 Ch10 - The Substance of the Shadow", "tale_of_two_cities_40_dickens.mp3"], ["Bk3 Ch11 - Dusk", "tale_of_two_cities_41_dickens.mp3"], ["Bk3 Ch12 - Darkness", "tale_of_two_cities_42_dickens.mp3"], ["Bk3 Ch13 - Fifty-two", "tale_of_two_cities_43_dickens.mp3"], ["Bk3 Ch14 - The Knitting Done", "tale_of_two_cities_44_dickens.mp3"], ["Bk3 Ch15 - The Footsteps Die Out For Ever", "tale_of_two_cities_45_dickens.mp3"]]}, "11": {"base": "https://archive.org/download/picture_dorian_gray_1204_librivox/", "chapters": [["00 - The Preface", "pictureofdoriangray_00_wilde.mp3"], ["01 - Chapter 1", "pictureofdoriangray_01_wilde.mp3"], ["02 - Chapter 2", "pictureofdoriangray_02_wilde.mp3"], ["03 - Chapter 3", "pictureofdoriangray_03_wilde.mp3"], ["04 - Chapter 4", "pictureofdoriangray_04_wilde.mp3"], ["05 - Chapter 5", "pictureofdoriangray_05_wilde.mp3"], ["06 - Chapter 6", "pictureofdoriangray_06_wilde.mp3"], ["07 - Chapter 7", "pictureofdoriangray_07_wilde.mp3"], ["08 - Chapter 08", "pictureofdoriangray_08_wilde.mp3"], ["09 - Chapter 9", "pictureofdoriangray_09_wilde.mp3"], ["10 - Chapter 10", "pictureofdoriangray_10_wilde.mp3"], ["11 - Chapter 11", "pictureofdoriangray_11_wilde.mp3"], ["12 - Chapter 12", "pictureofdoriangray_12_wilde.mp3"], ["13 - Chapter 13", "pictureofdoriangray_13_wilde.mp3"], ["14 - Chapter 14", "pictureofdoriangray_14_wilde.mp3"], ["15 - Chapter 15", "pictureofdoriangray_15_wilde.mp3"], ["16 - Chapter 16", "pictureofdoriangray_16_wilde.mp3"], ["17 - Chapter 17", "pictureofdoriangray_17_wilde.mp3"], ["18 - Chapter 18", "pictureofdoriangray_18_wilde.mp3"], ["19 - Chapter 19", "pictureofdoriangray_19_wilde.mp3"], ["20 - Chapter 20", "pictureofdoriangray_20_wilde.mp3"]]}, "12": {"base": "https://archive.org/download/prophet1_1901_librivox/", "chapters": [["01 - Ch 1-2", "prophet1_01_gibran.mp3"], ["02 - Ch 3-7", "prophet1_02_gibran.mp3"], ["03 - Ch 8-12", "prophet1_03_gibran.mp3"], ["04 - Ch 13-18", "prophet1_04_gibran.mp3"], ["05 - Ch 19-23", "prophet1_05_gibran.mp3"], ["06 - Ch 24-27", "prophet1_06_gibran.mp3"], ["07 - Ch 28", "prophet1_07_gibran.mp3"]]}};

  const selectedBook = sampleBooks.find((b) => b.id === selectedBookId) || sampleBooks[0];
  const bookText = BOOK_TEXT[selectedBook.title] || { chapter: 'Preview', paragraphs: [selectedBook.description] };
  const book = AUDIOBOOKS[selectedBook.id] || { base: '', chapters: [] };
  const chapters = book.chapters;
  const currentChapter = chapters[chapterIdx] || chapters[0];
  const audioSrc = currentChapter ? book.base + encodeURIComponent(currentChapter[1]) : '';

  const loadProgress = (id) => {
    try { return JSON.parse(localStorage.getItem('booksem_progress_' + id) || 'null'); } catch { return null; }
  };

  // When book changes, restore the saved chapter + time
  useEffect(() => {
    const p = loadProgress(selectedBookId);
    setChapterIdx(p && p.chapter < (AUDIOBOOKS[selectedBookId]?.chapters.length || 0) ? p.chapter : 0);
    resumeTimeRef.current = p ? p.time || 0 : 0;
    localStorage.setItem('booksem_player', JSON.stringify({ bookId: selectedBookId }));
  }, [selectedBookId]);

  // Save progress every few seconds
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
        audioRef.current && audioRef.current.pause();
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
    setDuration(a.duration);
    a.playbackRate = playbackRate;
    if (resumeTimeRef.current > 0) { a.currentTime = resumeTimeRef.current; resumeTimeRef.current = 0; }
    if (autoPlayRef.current) {
      autoPlayRef.current = false;
      a.play().then(() => setIsPlayingAudio(true)).catch(() => setIsPlayingAudio(false));
    }
  };

  const handleEnded = () => {
    if (sleepMode === 'chapter') { setIsPlayingAudio(false); setSleepMode(null); return; }
    if (chapterIdx + 1 < chapters.length) goToChapter(chapterIdx + 1, true);
    else { setIsPlayingAudio(false); localStorage.removeItem('booksem_progress_' + selectedBookId); }
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

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    if (isNaN(secs) || !secs) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle Audio Play / Pause
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

  // Seek bar click
  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min(duration, (clickX / rect.width) * duration));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Toggle playback speed (1.0x -> 1.25x -> 1.5x -> 2.0x)
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
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { stopAll(); setActiveTab('marketplace'); }}>
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                Booksem<span className="text-amber-400">.com</span>
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => { stopAll(); setActiveTab('marketplace'); }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                activeTab === 'marketplace' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 inline mr-2" />
              Store & Explore
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
              <Mic className="w-4 h-4 inline mr-2" />
              Interview Room
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold px-4 py-2 rounded-lg flex items-center border border-slate-700 transition"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Work
            </button>
            <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm px-4 py-2 rounded-lg transition shadow-md shadow-amber-500/20">
              Cart ({cartCount})
            </button>
          </div>
        </div>
      </header>

      {/* 2. BODY CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* TAB 1: STORE & EXPLORE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="max-w-2xl relative z-10">
                <span className="text-amber-400 font-bold tracking-wider text-xs uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Global Bookstore & Audio Reader
                </span>
                <h1 className="text-4xl font-extrabold text-white mt-4 mb-3 tracking-tight">
                  Read & Listen to the Greatest Books Ever Written.
                </h1>
                <p className="text-slate-400 text-base leading-relaxed mb-6">
                  Access free public domain classics and audiobooks instantly, or publish your own work to readers worldwide.
                </p>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => openBook('1')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition flex items-center shadow-lg shadow-amber-500/20"
                  >
                    <Headphones className="w-5 h-5 mr-2" />
                    Listen to The Art of War Free
                  </button>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl border border-slate-700 transition"
                  >
                    Sell Your Book
                  </button>
                </div>
              </div>
            </div>

            {/* Catalog Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Featured Books & Audiobooks</h2>
                  <p className="text-sm text-slate-400">12 Public Domain Classics & Global Bestsellers</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">
                    Showing 12 titles
                  </span>
                </div>
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
                            {book.price === 0 ? 'FREE' : `$${book.price}`}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openBook(book.id)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                          >
                            Preview
                          </button>
                          <button 
                            onClick={() => openBook(book.id)}
                            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition"
                          >
                            {book.price === 0 ? 'Read / Listen' : 'Buy Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUTHOR STUDIO */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Author Studio & Self-Publishing</h1>
                <p className="text-slate-400 text-sm">Write, edit, and publish your manuscripts directly to the Booksem marketplace.</p>
              </div>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition"
              >
                Upload Manuscript
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-2">Draft Editor</h2>
              <textarea 
                rows={12}
                placeholder="Start typing your chapter here, or paste your manuscript..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-200 font-serif leading-relaxed focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* TAB 3: INTEGRATED READER & REAL AUDIOBOOK PLAYER */}
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

            {/* Chapter list - the complete book */}
            {showChapters && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 max-w-3xl mx-auto">
                <h3 className="text-sm font-bold text-white mb-3">Complete Audiobook — {chapters.length} tracks · narrated by real human volunteers (LibriVox / Archive.org)</h3>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                  {chapters.map((c, i) => (
                    <button key={c[1]} onClick={() => goToChapter(i)} className={`w-full text-left px-3 py-2 text-sm flex items-center gap-3 transition ${i === chapterIdx ? 'bg-amber-500/10 text-amber-300' : 'text-slate-300 hover:bg-slate-800'}`}>
                      <span className="font-mono text-xs w-8 text-slate-500">{i + 1}</span>
                      {i === chapterIdx && isPlayingAudio ? <Volume2 className="w-4 h-4 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-slate-500" />}
                      <span className="truncate">{c[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Book Reading Canvas */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-3xl mx-auto shadow-xl">
              <div 
                className="font-serif text-slate-200 leading-loose space-y-6"
                style={{ fontSize: `${fontSize}px` }}
              >
                <h2 className="text-2xl font-bold font-sans text-center text-amber-400 mb-8">{bookText.chapter}</h2>
                {bookText.paragraphs.map((p, i) => (<p key={i}>{p}</p>))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTERVIEW ROOM */}
        {activeTab === 'interview' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Live Author Interview Room</h1>
              <p className="text-slate-400 text-sm">Join live book discussions, author Q&As, and community book launches.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center max-w-xl mx-auto space-y-4">
              <Video className="w-12 h-12 text-amber-400 mx-auto" />
              <h2 className="text-xl font-bold text-white">Next Live Event Starting Soon</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect with authors and fellow readers in real-time video audio discussions.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* 3. MODAL: UPLOAD WORK */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Upload Your Book or Audio</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Submit your manuscript or recorded audio to sell on Booksem.
            </p>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Book Title" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              <input 
                type="text" 
                placeholder="Author Name" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              <input 
                type="number" 
                placeholder="Price ($USD) - enter 0 for Free" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              <div className="border-2 border-dashed border-slate-800 rounded-xl p-6 text-center hover:border-amber-500/50 cursor-pointer transition">
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Drag & drop your PDF, EPUB, or MP3 file</p>
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
