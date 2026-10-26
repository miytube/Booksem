import React, { useState, useRef } from 'react';
import {
  BookOpen, Headphones, Mic, PenTool, ShoppingBag,
  Play, Pause, Star, Upload, Search, MessageSquare,
  Video, Users, Volume2, ShieldCheck, Heart, Share2,
  CheckCircle, ArrowRight
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
  const [selectedBookId, setSelectedBookId] = useState('1');

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
        "Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets. I feared to go very far from the station, as we arrived late and would start as near the correct time as possible."
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

  const AUDIO_URLS = {
    '1': 'https://archive.org/download/art_of_war_librivox/art_of_war_01-02_sun_tzu.mp3',
    '2': 'https://archive.org/download/audiobook-thinkandgrowrich/ch01.mp3',
    '3': 'https://archive.org/download/meditations_0708_librivox/meditations_01_marcusaurelius.mp3',
    '4': 'https://archive.org/download/pride_prejudice_1102_librivox/prideandprejudice_01_austen.mp3',
    '5': 'https://archive.org/download/prince_pa_librivox/prince_01_machiavelli.mp3',
    '6': 'https://archive.org/download/frankenstein_cs_librivox/frankenstein_01_shelley.mp3',
    '7': 'https://archive.org/download/TheScienceofGettingRich/01_Preface.mp3',
    '8': 'https://archive.org/download/dracula_librivox/dracula_01_stoker.mp3',
    '9': 'https://archive.org/download/thegreatgatsbyversion4_2402_librivox/greatgatsby4_00_fitzgerald_128kb.mp3',
    '10': 'https://archive.org/download/tale_two_cities_librivox/tale_of_two_cities_01_dickens.mp3',
    '11': 'https://archive.org/download/picture_dorian_gray_1204_librivox/pictureofdoriangray_01_wilde.mp3',
    '12': 'https://archive.org/download/prophet1_1901_librivox/prophet1_01_gibran.mp3'
  };

  const selectedBook = sampleBooks.find((b) => b.id === selectedBookId) || sampleBooks[0];
  const bookText = BOOK_TEXT[selectedBook.title] || { chapter: 'Preview', paragraphs: [selectedBook.description] };
  const audioSrc = AUDIO_URLS[selectedBook.id];

  const stopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
    setCurrentTime(0);
  };

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
              onClick={() => { stopAll(); setActiveTab('studio'); }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                activeTab === 'studio' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <PenTool className="w-4 h-4 inline mr-2" />
              Author Studio
            </button>
            <button
              onClick={() => { stopAll(); setActiveTab('interview'); }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                activeTab === 'interview' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Live Interview Room
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm transition shadow-lg shadow-amber-500/10"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Work</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. BODY CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* TAB 1: MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-10">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-slate-900 border border-amber-500/20 p-8 md:p-12">
              <div className="max-w-2xl space-y-4">
                <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Global Public Domain & Creator Marketplace
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Timeless Masterpieces & Modern Creator Audiobooks.
                </h1>
                <p className="text-slate-300 text-base md:text-lg">
                  Read and listen to classic literature with human narrations, or self-publish your own manuscripts to readers worldwide.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button 
                    onClick={() => openBook('1')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition flex items-center space-x-2 shadow-lg shadow-amber-500/20 text-sm"
                  >
                    <Headphones className="w-4 h-4" />
                    <span>Listen to The Art of War</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('studio')}
                    className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-6 py-3 rounded-xl transition text-sm"
                  >
                    Self-Publish a Book
                  </button>
                </div>
              </div>
            </div>

            {/* Catalog Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Featured Books & Audiobooks</h2>
                  <p className="text-xs text-slate-400">Click any title to preview or listen to the full narration</p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  {sampleBooks.length} Books Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sampleBooks.map((book) => (
                  <div 
                    key={book.id} 
                    className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 transition flex flex-col group"
                  >
                    <div 
                      className="relative aspect-[3/4] overflow-hidden bg-slate-800 cursor-pointer"
                      onClick={() => openBook(book.id)}
                    >
                      <img 
                        src={book.cover} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition" />
                      <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-200 border border-slate-800 flex items-center space-x-1">
                        <Headphones className="w-3 h-3 text-amber-400" />
                        <span>Audiobook</span>
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

        {/* TAB 3: INTEGRATED READER & REAL HUMAN AUDIOBOOK PLAYER */}
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
              {/* HTML5 Audio Element */}
              <audio
                ref={audioRef}
                key={selectedBook.id}
                src={audioSrc}
                onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                onEnded={() => setIsPlayingAudio(false)}
                preload="metadata"
              />

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-slate-950 font-bold transition shadow-lg shadow-amber-500/20 flex-shrink-0"
                  title={isPlayingAudio ? 'Pause Narration' : 'Play Narration'}
                >
                  {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div>
                  <span className="text-xs text-amber-400 font-bold block uppercase tracking-wider">Audiobook Track</span>
                  <p className="text-sm font-semibold text-white">{bookText.chapter}</p>
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
              </div>
            </div>

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
