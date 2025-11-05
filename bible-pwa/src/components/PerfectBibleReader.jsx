import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, Book, Heart, Share2, Bookmark, Settings, Sun, Moon,
  ChevronLeft, ChevronRight, Play, Pause, Volume2, MessageCircle,
  Sparkles, Flame, Users, Calendar, Star, Send, Copy, X, Menu
} from 'lucide-react';
import { getBibles, getBooks, getChapters, getChapterContent, searchBible, getVerseOfTheDay } from '../services/bibleApi';

const PerfectBibleReader = () => {
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
  const [favorites, setFavorites] = useState([]);
  const [showBibleSelector, setShowBibleSelector] = useState(true);
  const [showToast, setShowToast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [readingStreak, setReadingStreak] = useState(7);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load data
  useEffect(() => {
    const loadBibles = async () => {
      try {
        setLoading(true);
        const biblesData = await getBibles();
        setBibles(biblesData);
        const spanishBible = biblesData.find(bible => 
          bible.name.toLowerCase().includes('1909') ||
          bible.name.toLowerCase().includes('reina') ||
          bible.language.name.toLowerCase().includes('spanish')
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

  useEffect(() => {
    if (selectedBible) {
      const loadBooks = async () => {
        try {
          const booksData = await getBooks(selectedBible);
          setBooks(booksData);
          const votd = await getVerseOfTheDay(selectedBible);
          setVerseOfTheDay(votd);
        } catch (error) {
          console.error('Error loading books:', error);
        }
      };
      loadBooks();
    }
  }, [selectedBible]);

  useEffect(() => {
    if (selectedBible && selectedBook) {
      const loadChapters = async () => {
        try {
          const chaptersData = await getChapters(selectedBible, selectedBook);
          setChapters(chaptersData);
        } catch (error) {
          console.error('Error loading chapters:', error);
        }
      };
      loadChapters();
    }
  }, [selectedBible, selectedBook]);

  useEffect(() => {
    if (selectedBible && selectedChapter) {
      const loadChapterContent = async () => {
        try {
          setLoading(true);
          const content = await getChapterContent(selectedBible, selectedChapter);
          setChapterContent(content.content);
          setCurrentView('reader');
          setShowBibleSelector(false);
        } catch (error) {
          console.error('Error loading chapter content:', error);
        } finally {
          setLoading(false);
        }
      };
      loadChapterContent();
    }
  }, [selectedBible, selectedChapter]);

  const showToastMessage = (message, type = 'info') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const addToFavorites = (verse, reference) => {
    const favorite = { verse, reference, date: new Date().toISOString() };
    setFavorites(prev => [...prev, favorite]);
    showToastMessage('💖 Agregado a favoritos', 'success');
  };

  const shareToTelegram = (verse, reference) => {
    const text = `"${verse}" - ${reference}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showToastMessage('📤 Compartido en Telegram', 'success');
  };

  const getCurrentBookName = () => books.find(b => b.id === selectedBook)?.name || '';
  const getCurrentChapterNumber = () => chapters.find(ch => ch.id === selectedChapter)?.number || '';

  const fontSizeClasses = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl',
    xlarge: 'text-2xl'
  };

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

  const renderSearch = () => (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Buscar en la Biblia</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar versículos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 text-base"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((result, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <p className="mb-2" dangerouslySetInnerHTML={{ __html: result.text }} />
                <p className="text-sm text-blue-600 font-medium">{result.reference}</p>
              </Card>
            ))}
          </div>
        ) : searchQuery && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron resultados para "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mis Favoritos</h1>
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No tienes versículos favoritos aún</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((fav, index) => (
              <Card key={index} className="p-4">
                <p className="mb-2 italic">"{fav.verse}"</p>
                <p className="text-sm text-blue-600 font-medium">{fav.reference}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Perfect Home Screen
  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Floating Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Flame className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Biblia
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
              <Flame className="h-3 w-3 mr-1" />
              {readingStreak} días
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Hero Card */}
        <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <CardContent className="p-8 text-white relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">Versículo del Día</span>
              </div>
              {verseOfTheDay ? (
                <>
                  <blockquote className="text-xl font-medium leading-relaxed mb-4">
                    "{verseOfTheDay.content}"
                  </blockquote>
                  <cite className="text-sm opacity-90">{verseOfTheDay.reference}</cite>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 border-0">
                      <Heart className="h-4 w-4 mr-1" />
                      Favorito
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 border-0">
                      <Share2 className="h-4 w-4 mr-1" />
                      Compartir
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full bg-white/20" />
                  <Skeleton className="h-4 w-32 bg-white/20" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group" 
                onClick={() => setShowBibleSelector(true)}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Book className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Leer Ahora</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Selecciona un pasaje</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => setCurrentView('favorites')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Favoritos</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{favorites.length} versículos</p>
            </CardContent>
          </Card>
        </div>

        {/* Continue Reading */}
        {chapterContent && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Continuar Leyendo</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getCurrentBookName()} {getCurrentChapterNumber()}
                  </p>
                </div>
                <Button onClick={() => setCurrentView('reader')} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Continuar
                </Button>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{width: '65%'}}></div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Community */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Únete a la Comunidad</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Comparte y estudia con otros</p>
              </div>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              Conectar con Telegram
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Perfect Reader
  const renderReader = () => (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Reader Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('home')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">{getCurrentBookName()} {getCurrentChapterNumber()}</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {bibles.find(b => b.id === selectedBible)?.name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm">
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="max-w-4xl mx-auto p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : (
          <div className={`prose prose-lg max-w-none leading-relaxed ${fontSizeClasses[fontSize]} ${
            darkMode ? 'prose-invert' : ''
          } selection:bg-blue-100 dark:selection:bg-blue-900`}>
            <div dangerouslySetInnerHTML={{ __html: chapterContent }} />
          </div>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-3">
        <Button size="sm" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-pink-500 to-red-500">
          <Heart className="h-5 w-5" />
        </Button>
        <Button size="sm" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-blue-500 to-purple-500">
          <Share2 className="h-5 w-5" />
        </Button>
        <Button size="sm" className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-green-500 to-emerald-500">
          <Bookmark className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  // Sidebar
  const renderSidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Navegación</h2>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            <Button
              onClick={() => setShowBibleSelector(true)}
              variant="outline"
              className="w-full justify-start h-auto p-4"
            >
              <div className="text-left">
                <div className="font-medium flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  Seleccionar Pasaje
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Navegar a cualquier versículo
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Perfect Bottom Navigation
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 z-50">
      <div className="flex justify-around py-2">
        {[
          { id: 'home', icon: Sparkles, label: 'Inicio' },
          { id: 'search', icon: Search, label: 'Buscar' },
          { id: 'bible', icon: Book, label: 'Biblia' },
          { id: 'favorites', icon: Heart, label: 'Favoritos', badge: favorites.length },
          { id: 'more', icon: Settings, label: 'Más' }
        ].map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => {
              if (item.id === 'bible') setShowBibleSelector(true);
              else if (item.id === 'more') setShowSettings(true);
              else setCurrentView(item.id);
            }}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
              (currentView === item.id || (item.id === 'bible' && currentView === 'reader')) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {currentView === 'home' && renderHome()}
      {currentView === 'reader' && renderReader()}
      {currentView === 'search' && renderSearch()}
      {currentView === 'favorites' && renderFavorites()}
      
      {/* Sidebar */}
      {renderSidebar()}
      
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Bible Selector */}
      {showBibleSelector && (
        <div className="fixed inset-0 z-50">
          <div className="bg-white dark:bg-gray-900 h-full overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Seleccionar Pasaje</h1>
              <Button variant="ghost" onClick={() => setShowBibleSelector(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-center text-gray-500">Selector de Biblia aquí</p>
          </div>
        </div>
      )}
      
      <BottomNav />
      
      {/* Toast */}
      {showToast && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg backdrop-blur-xl transition-all duration-300 ${
          showToast.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-blue-500/90 text-white'
        }`}>
          {showToast.message}
        </div>
      )}
      
      {/* Bottom padding */}
      <div className="h-20"></div>
    </div>
  );
};

export default PerfectBibleReader;