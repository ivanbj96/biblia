import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
  Menu
} from 'lucide-react';
import { getBibles, getBooks, getChapters, getChapterContent, searchBible, getVerseOfTheDay } from '../services/bibleApi';

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

  const renderHome = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <Book className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Bienvenido a Biblia PWA</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Explora las Escrituras con una experiencia de lectura moderna y accesible
        </p>
      </div>

      {/* Verse of the Day */}
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center justify-center">
            <Heart className="h-5 w-5 text-red-500" />
            Versículo del Día
          </CardTitle>
        </CardHeader>
        <CardContent>
          {verseOfTheDay ? (
            <div className="text-center">
              <blockquote className="text-lg italic leading-relaxed mb-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                "{verseOfTheDay.content}"
              </blockquote>
              <cite className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {verseOfTheDay.reference}
              </cite>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Start Guide */}
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Comenzar a Leer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                </div>
                <h3 className="font-medium mb-1">Selecciona una Biblia</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Elige tu traducción preferida</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
                </div>
                <h3 className="font-medium mb-1">Elige un Libro</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Navega por los libros bíblicos</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
                </div>
                <h3 className="font-medium mb-1">Selecciona Capítulo</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Comienza tu lectura</p>
              </div>
            </div>
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Usa la barra lateral para navegar o la búsqueda para encontrar pasajes específicos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReader = () => (
    <div className="space-y-4">
      {/* Chapter Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {getCurrentBookName()} {getCurrentChapterNumber()}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {bibles.find(b => b.id === selectedBible)?.name}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateChapter('prev')}
                disabled={chapters.findIndex(ch => ch.id === selectedChapter) === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateChapter('next')}
                disabled={chapters.findIndex(ch => ch.id === selectedChapter) === chapters.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chapter Content */}
      <Card>
        <CardContent className="p-8">
          {loading ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          ) : (
            <div 
              className={`prose prose-lg max-w-none leading-relaxed ${fontSizeClasses[fontSize]} ${
                darkMode ? 'prose-invert' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: chapterContent }}
            />
          )}
        </CardContent>
      </Card>
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
                <div key={index} className={`p-4 rounded-lg border transition-colors duration-300 ${
                  darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}>
                  <p className={`${fontSizeClasses[fontSize]} mb-2`} dangerouslySetInnerHTML={{ __html: result.text }} />
                  <p className="text-sm text-gray-500 font-medium">{result.reference}</p>
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
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Book className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold">Biblia PWA</h1>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar en la Biblia..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4"
                />
              </div>
            </div>

            {/* Settings Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="p-2"
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
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-30 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
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
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Acciones Rápidas</h3>
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
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {loading && currentView === 'home' ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {currentView === 'home' && renderHome()}
              {currentView === 'reader' && renderReader()}
              {currentView === 'search' && renderSearch()}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default BibleReader;

