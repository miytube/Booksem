  import React, { useState } from 'react';
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
  const [cartCount, setCartCount] = useState(0);

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
      cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777b?auto=format&fit=crop&q=80&w=400',
      description: 'A portrait of the Jazz Age, roaring twenties glamour, obsessive unrequited romance, and the illusion of the American Dream.'
    },
    {
      id: '10',
      title: 'As a Man Thinketh',
      author: 'James Allen',
      genre: 'Non-Fiction',
      format: 'Audiobook & E-Book',
      price: 0.00,
      rating: 4.8,
      reviewsCount: 880,
      cover: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400',
      description: 'A classic philosophical essay on how pure thoughts shape character, health, circumstances, and ultimate destiny.'
    },
    {
      id: '11',
      title: "Alice's Adventures in Wonderland",
      author: 'Lewis Carroll',
      genre: 'Fiction',
      format: 'Audiobook & E-Book',
      price: 0.00,
      rating: 4.7,
      reviewsCount: 2150,
      cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400',
      description: 'A young girl falls down a rabbit hole into a whimsical, topsy-turvy world of riddles, tea parties, and eccentric creatures.'
    },
    {
      id: '12',
      title: 'The Prophet',
      author: 'Kahlil Gibran',
      genre: 'Non-Fiction',
      format: 'Audiobook & E-Book',
      price: 0.00,
      rating: 4.9,
      reviewsCount: 1970,
      cover: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=400',
      description: 'Twenty-six poetic essays offering profound reflections on love, marriage, work, sorrow, freedom, and death.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('marketplace')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">Booksem<span className="text-amber-500">.com</span></span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
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
              <span className="relative inline-flex mr-2">
                <Mic className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </span>
              Interview Room
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="hidden sm:flex items-center bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-700"
            >
              <Upload className="w-4 h-4 mr-1.5 text-amber-400" />
              Upload Work
            </button>
            <div className="flex items-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-1.5 rounded-lg text-sm shadow-md transition cursor-pointer">
              Cart ({cartCount})
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* TAB 1: MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="relative rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-900/30 p-8 md:p-12 overflow-hidden">
              <div className="max-w-2xl relative z-10 space-y-4">
                <span className="bg-amber-500/20 text-amber-300 text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-amber-500/30">
                  Direct from Creators & Public Domain Classics
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                  Discover, Listen, & Read Books That Matter.
                </h1>
                <p className="text-slate-300 text-base md:text-lg">
                  Buy directly from independent authors and stream classic audiobooks and e-books for free.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search books, authors, narrators..." 
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition">
                    Browse All
                  </button>
                </div>
              </div>
            </div>

            {/* Book Catalog Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Trending Fiction & Non-Fiction</h2>
                  <p className="text-slate-400 text-sm">Free classics and creator-direct titles</p>
                </div>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-slate-800 text-xs font-semibold rounded-lg text-amber-400 border border-slate-700">All</span>
                  <span className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-xs font-semibold rounded-lg text-slate-400 border border-slate-800 cursor-pointer">Fiction</span>
                  <span className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-xs font-semibold rounded-lg text-slate-400 border border-slate-800 cursor-pointer">Non-Fiction</span>
                  <span className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-xs font-semibold rounded-lg text-slate-400 border border-slate-800 cursor-pointer">Audiobooks</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleBooks.map((book) => (
                  <div key={book.id} className="bg-slate-900 rounded-xl border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition">
                    <div className="flex space-x-4">
                      <img src={book.cover} alt={book.title} className="w-28 h-36 object-cover rounded-lg shadow-md" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-slate-800 text-slate-300 font-medium px-2 py-0.5 rounded border border-slate-700">
                            {book.genre}
                          </span>
                          <div className="flex items-center text-xs text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-current mr-1" />
                            {book.rating} ({book.reviewsCount})
                          </div>
                        </div>
                        <h3 className="font-bold text-white text-lg leading-snug">{book.title}</h3>
                        <p className="text-slate-400 text-xs">By {book.author}</p>
                        <span className="inline-block text-xs text-amber-400/90 font-medium">{book.format}</span>
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-xs line-clamp-2 my-4">{book.description}</p>
                    
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
                          onClick={() => setCartCount(cartCount + 1)}
                          className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition"
                        >
                          {book.price === 0 ? 'Read / Listen' : 'Buy Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUTHOR STUDIO (WRITING TOOL) */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <PenTool className="text-amber-500" /> Booksem Studio
                </h1>
                <p className="text-slate-400 text-sm">Write, draft, and organize your manuscript with auto-save.</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-emerald-400 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Changes Saved
                </span>
                <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg font-medium border border-slate-700">
                  Export EPUB / PDF
                </button>
                <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition">
                  Publish to Store
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Chapter Sidebar */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Chapters</span>
                  <button className="text-xs text-amber-400 font-semibold hover:underline">+ New Chapter</button>
                </div>
                <div className="space-y-1">
                  <button className="w-full text-left px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                    Chapter 1: The Origin
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 text-xs">
                    Chapter 2: Crossing the Threshold
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 text-xs">
                    Chapter 3: The Broken Horizon
                  </button>
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <div className="text-xs text-slate-500 space-y-1">
                    <div>Words: <span className="text-white font-mono">1,842</span></div>
                    <div>Target: <span className="text-white font-mono">50,000</span></div>
                  </div>
                </div>
              </div>

              {/* Text Writing Area */}
              <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[600px] overflow-hidden">
                <div className="bg-slate-850 p-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex space-x-3">
                    <button className="font-bold hover:text-white">B</button>
                    <button className="italic hover:text-white">I</button>
                    <button className="underline hover:text-white">U</button>
                    <span className="border-r border-slate-700 h-4"></span>
                    <button className="hover:text-white">H1</button>
                    <button className="hover:text-white">H2</button>
                    <button className="hover:text-white">Quote</button>
                  </div>
                  <span>Chapter 1: The Origin</span>
                </div>
                <textarea 
                  className="flex-1 bg-transparent p-6 text-slate-200 resize-none focus:outline-none font-serif text-lg leading-relaxed placeholder-slate-600"
                  placeholder="Begin writing your story here..."
                  defaultValue={`The storm had dismantled the perimeter alarms just before dawn. Dr. Rachel Scott watched the telemetry flicker against the cold glass of the research cupola.

Far below in the trench, something was displacing millions of gallons of water in rhythmic cycles. It was not volcanic; the seismographs showed a pulse too deliberate, too organized to be tectonic.`}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INTEGRATED READER & AUDIOBOOK PLAYER */}
        {activeTab === 'reader' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">The Art of War</h1>
                <p className="text-slate-400 text-sm">Author: Sun Tzu | Narrated by: Audio Classics</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
                  Font Size: A- A+
                </button>
              </div>
            </div>

            {/* Audio Player Bar */}
            <div className="bg-gradient-to-r from-slate-900 to-amber-950/40 border border-amber-900/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button 
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-slate-950 font-bold transition shadow-lg shadow-amber-500/20"
                >
                  {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div>
                  <span className="text-xs text-amber-400 font-bold block uppercase tracking-wider">Audiobook Track</span>
                  <p className="text-sm font-semibold text-white">Chapter 1: Laying Plans (03:45 / 18:20)</p>
                </div>
              </div>

              {/* Scrubber simulation */}
              <div className="w-full md:flex-1 max-w-lg flex items-center space-x-3">
                <span className="text-xs text-slate-500 font-mono">03:45</span>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer relative">
                  <div className="bg-amber-500 h-full w-[20%]" />
                </div>
                <span className="text-xs text-slate-500 font-mono">18:20</span>
              </div>

              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-300 font-medium">1.0x Speed</span>
              </div>
            </div>

            {/* Book Reading Canvas */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-3xl mx-auto shadow-xl">
              <div className="font-serif text-slate-200 text-lg leading-loose space-y-6">
                <h2 className="text-2xl font-bold font-sans text-center text-amber-400 mb-8">Chapter 1: Laying Plans</h2>
                <p>
                  Sun Tzu said: The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.
                </p>
                <p>
                  The art of war, then, is governed by five constant factors, to be taken into account in one’s deliberations, when seeking to determine the conditions obtaining in the field. These are: The Moral Law; Heaven; Earth; The Commander; Method and discipline.
                </p>
                <p>
                  All warfare is based on deception. Hence, when able to attack, we must seem unable; when using our forces, we must seem inactive; when we are near, we must make the enemy believe we are far away; when far away, we must make him believe we are near.
                </p>
              </div>

              {/* Reader Reviews Section */}
              <div className="mt-12 pt-8 border-t border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white">Community Reviews</h3>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-300">Marcus Sterling (Verified Reader)</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    "Essential strategic thinking that transcends warfare and applies directly to business, leadership, and personal resilience."
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTERVIEW ROOM (LIVE PODCAST / AUTHOR Q&A) */}
        {activeTab === 'interview' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-2 py-0.5 rounded flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block mr-1.5 animate-pulse" />
                    LIVE INTERVIEW
                  </span>
                  <span className="text-xs text-slate-400">Room ID: #BKM-8842</span>
                </div>
                <h1 className="text-2xl font-bold text-white mt-1">
                  In Conversation: The Timeless Relevance of Classic Literature
                </h1>
              </div>

              <div className="flex items-center space-x-2">
                <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg font-medium border border-slate-700">
                  <Share2 className="w-3.5 h-3.5 inline mr-1" /> Share Stream
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition">
                  Leave Room
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Stream Stage */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 aspect-video sm:aspect-auto">
                  {/* Host Feed */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-video flex items-center justify-center group">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600" 
                      alt="Host" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur px-2 py-1 rounded text-xs font-medium text-white flex items-center">
                      <Mic className="w-3 h-3 text-emerald-400 mr-1.5" />
                      Host: Marcus Cole
                    </div>
                  </div>

                  {/* Guest Feed */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-video flex items-center justify-center group">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600" 
                      alt="Guest Scholar" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur px-2 py-1 rounded text-xs font-medium text-white flex items-center">
                      <Mic className="w-3 h-3 text-emerald-400 mr-1.5" />
                      Guest: Dr. Robert Vance (Literary Historian)
                    </div>
                  </div>
                </div>

                {/* Broadcast Controls */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">
                      <Mic className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Users className="w-4 h-4" />
                    <span>342 Audience Members</span>
                  </div>
                  <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3 py-2 rounded-lg">
                    Request to Speak
                  </button>
                </div>
              </div>

              {/* Live Chat & Book Pin */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[480px]">
                {/* Pinned Book Promo inside Interview */}
                <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center space-x-3">
                  <BookOpen className="w-8 h-8 text-amber-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">Featured: The Art of War</p>
                    <p className="text-xs text-amber-400 font-semibold">FREE on Booksem</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('reader')}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-2.5 py-1.5 rounded transition"
                  >
                    Read
                  </button>
                </div>

                {/* Live Message Stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-300">David R: </span>
                    <span className="text-slate-400">The chapter on deceptive maneuvers feels incredibly modern.</span>
                  </div>
                  <div>
                    <span className="font-bold text-amber-400">Dr. Vance (Guest): </span>
                    <span className="text-slate-400">Exactly! It influenced military strategy and chess theory for 2,500 years.</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-300">Kendra M: </span>
                    <span className="text-slate-400">Loving the built-in reader canvas!</span>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-3 border-t border-slate-800 flex items-center space-x-2">
                  <input 
                    type="text" 
                    placeholder="Ask author a question..." 
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 3. UPLOAD MODAL FOR CREATORS */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Upload Book or Audiobook</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Book Title</label>
                <input type="text" placeholder="e.g. Beyond Horizons" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Genre</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none">
                    <option>Fiction</option>
                    <option>Non-Fiction</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Price (USD)</label>
                  <input type="number" step="0.01" placeholder="14.99" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center space-y-2 hover:border-amber-500 cursor-pointer transition">
                <Upload className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-xs text-slate-300 font-medium">Drag & Drop EPUB, PDF, or MP3/M4B audio files</p>
                <p className="text-[10px] text-slate-500">Supports files up to 2GB</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('Book metadata and files queued for upload & processing!');
                  setShowUploadModal(false);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs"
              >
                Start Upload & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <p>© 2026 Booksem.com. All rights reserved. The premier home for indie authors, audio narration, and live interviews.</p>
      </footer>
    </div>
  );
}
