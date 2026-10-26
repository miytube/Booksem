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
    const newTime = (clickX / rect.width) * duration;
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
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('marketplace')}>
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
              onClick={() => setActiveTab('marketplace')}
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
                    onClick={() => setActiveTab('reader')}
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
                            onClick={() => setActiveTab('reader')}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                          >
                            Preview
                          </button>
                          <button 
                            onClick={() => setActiveTab('reader')}
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
                <h1 className="text-2xl font-bold text-white">The Art of War</h1>
                <p className="text-slate-400 text-sm">Author: Sun Tzu | Narrated by: Audio Classics (LibriVox Public Domain)</p>
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
                src="https://archive.org/download/art_of_war_librivox/art_of_war_01-02_sun_tzu_64kb.mp3"
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
                  <p className="text-sm font-semibold text-white">Chapter 1: Laying Plans</p>
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
                  {duration > 0 ? formatTime(duration) : '18:20'}
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
                <h2 className="text-2xl font-bold font-sans text-center text-amber-400 mb-8">Chapter 1: Laying Plans</h2>
                <p>
                  Sun Tzu said: The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.
                </p>
                <p>
                  The art of war, then, is governed by five constant factors, to be taken into account in one’s deliberations, when seeking to determine the conditions obtaining in the field. These are: The Moral Law; Heaven; Earth; The Commander; Method and discipline.
                </p>
                <p>
                  The Moral Law causes the people to be in complete accord with their ruler, so that they will follow him regardless of their lives, undismayed by any danger.
                </p>
                <p>
                  Heaven signifies night and day, cold and heat, times and seasons. Earth comprises distances, great and small; danger and security; open ground and narrow passes; the chances of life and death.
                </p>
                <p>
                  The Commander stands for the virtues of wisdom, sincerely, benevolence, courage and strictness. By method and discipline are to be understood the marshaling of the army in its proper subdivisions, the graduations of rank among the officers, the maintenance of roads by which supplies may reach the army, and the control of military expenditure.
                </p>
                <p>
                  These five heads should be familiar to every general: he who knows them will be victorious; he who knows them not will fail.
                </p>
                <p>
                  All warfare is based on deception. Hence, when able to attack, we must seem unable; when using our forces, we must seem inactive; when we are near, we must make the enemy believe we are far away; when far away, we must make him believe we are near.
                </p>
                <p>
                  Hold out baits to entice the enemy. Feign disorder, and crush him. If he is secure at all points, be prepared for him. If he is in superior strength, evade him.
                </p>
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
