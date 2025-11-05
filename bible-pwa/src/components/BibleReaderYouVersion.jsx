import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Search, 
  Book, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Sun, 
  Moon, 
  Type, 
  Share2,
  Home,
  BookOpen,
  Heart,
  Menu,
  Calendar,
  Users,
  MessageCircle,
  Bookmark,
  Star,
  Send,
  Copy,
  ExternalLink,
  Play,
  Pause,
  Volume2
} from 'lucide-react';
import { getBibles, getBooks, getChapters, getChapterContent, searchBible, getVerseOfTheDay } from '../services/bibleApi';
import BottomNavigation from './BottomNavigation';
import '../styles/verse-highlighting.css';

const BibleReader = () => {
  const [bibles, setBibles] = useState([]);
  const [selectedBible, setSelectedBible] = useState('');
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [verseOfTheDay, setVerseOfTheDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [notes, setNotes] = useState({});
  const [readingPlan, setReadingPlan] = useState(null);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [highlightedVerses, setHighlightedVerses] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Cargar Biblias al inicializar
  useEffect(() => {
    const loadBibles = async () => {
      try {
        setLoading(true);
        const biblesData = await getBibles();
        setBibles(biblesData);
        const spanishBible = biblesData.find(bible => 
          bible.language.name.toLowerCase().includes('spanish') || 
          bible.language.name.toLowerCase().includes('español')
        ) || biblesData[0];
        if (spanishBible) {
          setSelectedBible(spanishBible.id);
        }
      } catch (error) {
        console.error('Error loading bibles:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBibles();
  }, []);

  // Cargar libros cuando se selecciona una Biblia
  useEffect(() => {
    if (selectedBible) {
      const loadBooks = async () => {
        try {
          setLoading(true);
          const booksData = await getBooks(selectedBible);
          setBooks(booksData);
          const votd = await getVerseOfTheDay(selectedBible);
          setVerseOfTheDay(votd);
        } catch (error) {
          console.error('Error loading books:', error);
        } finally {
          setLoading(false);
        }
      };
      loadBooks();
    }
  }, [selectedBible]);

  // Cargar capítulos cuando se selecciona un libro
  useEffect(() => {
    if (selectedBible && selectedBook) {
      const loadChapters = async () => {
        try {
          setLoading(true);
          const chaptersData = await getChapters(selectedBible, selectedBook);
          setChapters(chaptersData);
        } catch (error) {
          console.error('Error loading chapters:', error);
        } finally {
          setLoading(false);
        }
      };
      loadChapters();
    }
  }, [selectedBible, selectedBook]);

  // Cargar contenido del capítulo cuando se selecciona un capítulo
  useEffect(() => {
    if (selectedBible && selectedChapter) {
      const loadChapterContent = async () => {
        try {
          setLoading(true);
          const content = await getChapterContent(selectedBible, selectedChapter);
          setChapterContent(content.content);
          setCurrentView('reader');
        } catch (error) {
          console.error('Error loading chapter content:', error);
        } finally {
          setLoading(false);
        }
      };
      loadChapterContent();
    }
  }, [selectedBible, selectedChapter]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !selectedBible) return;
    
    try {
      setLoading(true);
      const results = await searchBible(selectedBible, searchQuery);
      setSearchResults(results.verses || []);
      setCurrentView('search');
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateChapter = (direction) => {
    const currentIndex = chapters.findIndex(ch => ch.id === selectedChapter);
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedChapter(chapters[currentIndex - 1].id);
    } else if (direction === 'next' && currentIndex < chapters.length - 1) {
      setSelectedChapter(chapters[currentIndex + 1].id);
    }
  };

  const getCurrentBookName = () => {
    const book = books.find(b => b.id === selectedBook);
    return book ? book.name : '';
  };

  const getCurrentChapterNumber = () => {
    const chapter = chapters.find(ch => ch.id === selectedChapter);
    return chapter ? chapter.number : '';
  };

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  // Telegram Integration Functions
  const shareToTelegram = (verse, reference) => {
    const text = `"${verse}" - ${reference}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const connectTelegram = () => {
    setTelegramConnected(true);
    alert('¡Conectado con Telegram! Ahora puedes compartir versículos y unirte a grupos de estudio.');
  };

  const addToFavorites = (verse, reference) => {
    const favorite = { verse, reference, date: new Date().toISOString() };
    setFavorites(prev => [...prev, favorite]);
    showToastMessage('❤️ Agregado a favoritos', 'success');
  };

  const showToastMessage = (message, type = 'info') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 2000);
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      navigateChapter('next');
    }
    if (isRightSwipe) {
      navigateChapter('prev');
    }
  };

  const toggleHighlight = (verseId) => {
    setHighlightedVerses(prev => 
      prev.includes(verseId) 
        ? prev.filter(id => id !== verseId)
        : [...prev, verseId]
    );
  };

  const navigateToVerse = (reference) => {
    // Parse reference like "John 3:16"
    const parts = reference.split(' ');
    const bookName = parts.slice(0, -1).join(' ');
    const chapterVerse = parts[parts.length - 1].split(':');
    const chapterNum = chapterVerse[0];
    
    const book = books.find(b => b.name.toLowerCase().includes(bookName.toLowerCase()));
    if (book) {
      setSelectedBook(book.id);
      const chapter = chapters.find(ch => ch.number === parseInt(chapterNum));
      if (chapter) {
        setSelectedChapter(chapter.id);
      }
    }
  };

  const renderHome = () => (
    <div className="space-y-6">
      {/* Hero Section - Mobile Optimized */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white mx-2 sm:mx-0">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-4 py-8 sm:px-8 sm:py-12 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Biblia PWA</h1>
          <p className="text-base sm:text-xl opacity-90 mb-4 sm:mb-6">Conecta con Dios y tu comunidad</p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <Button 
              onClick={() => setCurrentView('reader')} 
              className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              size="lg"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Comenzar a Leer
            </Button>
            {!telegramConnected && (
              <Button 
                onClick={connectTelegram}
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
                size="lg"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Conectar Telegram
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Verse of the Day - Mobile Optimized */}
      <Card className="mx-2 sm:mx-auto max-w-4xl border-0 shadow-lg">
        <CardContent className="p-0">
          {verseOfTheDay ? (
            <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 sm:p-8 rounded-xl">
              <div className="mb-4 sm:absolute sm:top-4 sm:right-4 sm:mb-0">
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  Versículo del Día
                </Badge>
              </div>
              <blockquote className="text-lg sm:text-2xl font-medium leading-relaxed mb-4 sm:mb-6 text-gray-800 dark:text-gray-200">
                "{verseOfTheDay.content}"
              </blockquote>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <cite className="text-base sm:text-lg font-semibold text-amber-700 dark:text-amber-300">
                  {verseOfTheDay.reference}
                </cite>
                <div className="flex gap-2 justify-center sm:justify-end">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => addToFavorites(verseOfTheDay.content, verseOfTheDay.reference)}
                    className="flex-1 sm:flex-none hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="sm:hidden">Favorito</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      shareToTelegram(verseOfTheDay.content, verseOfTheDay.reference);
                      showToastMessage('📤 Compartido en Telegram', 'success');
                    }}
                    className="flex-1 sm:flex-none hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    <span className="sm:hidden">Compartir</span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-8 space-y-4">
              <Skeleton className="h-24 sm:h-32 w-full" />
              <Skeleton className="h-6 w-48" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature Cards - Mobile First */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 px-2 sm:px-0">
        <Card className="group active:scale-95 transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Planes</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Lectura diaria</p>
          </CardContent>
        </Card>
        
        <Card className="group active:scale-95 transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Grupos</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Telegram</p>
          </CardContent>
        </Card>
        
        <Card className="group active:scale-95 transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20" onClick={() => setCurrentView('favorites')}>
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
              <Bookmark className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Favoritos</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{favorites.length} guardados</p>
          </CardContent>
        </Card>
        
        <Card className="group active:scale-95 transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Compartir</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Telegram</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Telegram Status - Mobile Optimized */}
      {telegramConnected && (
        <Card className="mx-2 sm:mx-auto max-w-4xl border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">Conectado con Telegram</h3>
                  <p className="text-sm text-green-600 dark:text-green-300">Comparte versículos y únete a grupos</p>
                </div>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Telegram
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderReader = () => (
    <div className="space-y-6">
      {/* Enhanced Chapter Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {getCurrentBookName()} {getCurrentChapterNumber()}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {bibles.find(b => b.id === selectedBible)?.name}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateChapter('prev')}
                disabled={chapters.findIndex(ch => ch.id === selectedChapter) === 0}
                className="hover:bg-blue-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateChapter('next')}
                disabled={chapters.findIndex(ch => ch.id === selectedChapter) === chapters.length - 1}
                className="hover:bg-blue-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all"
                onClick={() => {
                  shareToTelegram(chapterContent, `${getCurrentBookName()} ${getCurrentChapterNumber()}`);
                  showToastMessage('📤 Capítulo compartido', 'success');
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all"
                onClick={() => {
                  addToFavorites(chapterContent, `${getCurrentBookName()} ${getCurrentChapterNumber()}`);
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Chapter Content */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          {loading ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div 
                className={`prose prose-lg max-w-none leading-relaxed ${fontSizeClasses[fontSize]} ${
                  darkMode ? 'prose-invert' : ''
                } hover:prose-a:text-blue-600 selection:bg-yellow-200 select-text`}
                dangerouslySetInnerHTML={{ __html: chapterContent }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseUp={() => {
                  const selection = window.getSelection();
                  if (selection.toString().trim()) {
                    setSelectedVerse(selection.toString());
                    setShowShareModal(true);
                  }
                }}
                onClick={(e) => {
                  // Detect verse clicks for highlighting
                  const target = e.target;
                  if (target.tagName === 'SPAN' && target.className.includes('verse')) {
                    const verseId = target.getAttribute('data-verse-id');
                    if (verseId) {
                      toggleHighlight(verseId);
                    }
                  }
                }}
                style={{
                  touchAction: 'pan-y'
                }}
              />
              
              {/* Quick Actions Bar */}
              <div className="flex justify-center pt-6 border-t">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all"
                    onClick={() => showToastMessage('📖 Capítulo guardado', 'success')}
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="hover:bg-green-50 hover:text-green-600 active:scale-95 transition-all"
                    onClick={() => {
                      shareToTelegram(chapterContent, `${getCurrentBookName()} ${getCurrentChapterNumber()}`);
                      showToastMessage('📤 Compartido en Telegram', 'success');
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="hover:bg-purple-50 hover:text-purple-600 active:scale-95 transition-all"
                    onClick={() => {
                      addToFavorites(chapterContent, `${getCurrentBookName()} ${getCurrentChapterNumber()}`);
                    }}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Favorito
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Share Modal */}
      {showShareModal && selectedVerse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShareModal(false)}>
          <Card className="w-96 m-4" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Compartir Versículo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm italic">"{selectedVerse}"</p>
                <p className="text-xs text-gray-500 mt-2">{getCurrentBookName()} {getCurrentChapterNumber()}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => shareToTelegram(selectedVerse, `${getCurrentBookName()} ${getCurrentChapterNumber()}`)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Telegram
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigator.clipboard.writeText(`"${selectedVerse}" - ${getCurrentBookName()} ${getCurrentChapterNumber()}`);
                    setShowShareModal(false);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const renderSearch = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Resultados de Búsqueda</CardTitle>
            <Badge variant="secondary">{searchResults.length} resultados</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer hover:shadow-md active:scale-98 ${
                    darkMode ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' : 'border-gray-200 bg-gray-50 hover:bg-white'
                  }`}
                  onClick={() => {
                    navigateToVerse(result.reference);
                    showToastMessage('📖 Navegando al versículo...', 'info');
                  }}
                >
                  <p className={`${fontSizeClasses[fontSize]} mb-2`} dangerouslySetInnerHTML={{ __html: result.text }} />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-blue-600 font-medium">{result.reference}</p>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={(e) => {
                        e.stopPropagation();
                        shareToTelegram(result.text, result.reference);
                        showToastMessage('📤 Versículo compartido', 'success');
                      }}
                      className="hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No se encontraron resultados para "{searchQuery}"
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="sm:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Book className="h-6 w-6 text-blue-600" />
              <h1 className="text-lg sm:text-xl font-bold">Biblia PWA</h1>
            </div>
            
            {/* Search Bar - Mobile Optimized */}
            <div className="flex-1 max-w-md mx-2 sm:mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 text-base"
                />
              </div>
            </div>

            {/* Settings Button - Hidden on mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hidden sm:flex"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className={`mt-3 p-4 rounded-lg border transition-colors duration-300 ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
            }`}>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2"
                  >
                    {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                  <span className="text-sm">Tema</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Type className="h-4 w-4" />
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeño</SelectItem>
                      <SelectItem value="medium">Mediano</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                      <SelectItem value="xlarge">Muy Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Hidden on mobile, use bottom nav instead */}
        <div className={`fixed inset-y-0 left-0 z-30 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r hidden sm:block`}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Navegación</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden"
                >
                  ×
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Navegación</h3>
                  <div className="space-y-1">
                    <Button
                      variant={currentView === 'home' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setCurrentView('home')}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Inicio
                    </Button>
                    {chapterContent && (
                      <Button
                        variant={currentView === 'reader' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setCurrentView('reader')}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Lectura
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setCurrentView('favorites')}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Favoritos ({favorites.length})
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Plan de Lectura
                    </Button>
                    {telegramConnected && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-green-600"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Grupos Telegram
                      </Button>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Selección</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Biblia</label>
                      <Select value={selectedBible} onValueChange={setSelectedBible} disabled={loading}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una Biblia" />
                        </SelectTrigger>
                        <SelectContent>
                          {bibles.map(bible => (
                            <SelectItem key={bible.id} value={bible.id}>
                              {bible.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Libro</label>
                      <Select 
                        value={selectedBook} 
                        onValueChange={setSelectedBook} 
                        disabled={!selectedBible || loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un libro" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="max-h-60 overflow-y-auto">
                            {books.map(book => (
                              <SelectItem key={book.id} value={book.id}>
                                {book.name}
                              </SelectItem>
                            ))}
                          </div>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Capítulo</label>
                      <Select 
                        value={selectedChapter} 
                        onValueChange={setSelectedChapter} 
                        disabled={!selectedBook || loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un capítulo" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="max-h-40 overflow-y-auto">
                            {chapters.map(chapter => (
                              <SelectItem key={chapter.id} value={chapter.id}>
                                Capítulo {chapter.number}
                              </SelectItem>
                            ))}
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black bg-opacity-50 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 px-2 sm:px-4 py-4 sm:py-6 max-w-7xl mx-auto">
          {loading && currentView === 'home' ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {currentView === 'home' && renderHome()}
              {currentView === 'reader' && renderReader()}
              {currentView === 'search' && renderSearch()}
              {currentView === 'favorites' && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        Mis Favoritos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {favorites.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No tienes versículos favoritos aún</p>
                          <p className="text-sm">Marca versículos como favoritos mientras lees</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {favorites.map((fav, index) => (
                            <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                              <p className="mb-2 italic">"{fav.verse}"</p>
                              <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-blue-600">{fav.reference}</p>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => {
                                    shareToTelegram(fav.verse, fav.reference);
                                    showToastMessage('📤 Favorito compartido', 'success');
                                  }}
                                  className="hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all"
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      
      {/* Bottom Navigation for Mobile */}
      <BottomNavigation 
        currentView={currentView}
        setCurrentView={setCurrentView}
        favorites={favorites}
        setShowSettings={setShowSettings}
      />
      
      {/* Toast Notifications */}
      {showToast && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
          showToast.type === 'success' ? 'bg-green-500 text-white' :
          showToast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {showToast.message}
        </div>
      )}
      
      {/* Bottom padding for mobile navigation */}
      <div className="h-20 sm:hidden"></div>
    </div>
  );
};

export default BibleReader;