import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Book, ChevronRight, X } from 'lucide-react';

const BibleSelector = ({ 
  bibles, 
  books, 
  chapters, 
  selectedBible, 
  selectedBook, 
  selectedChapter,
  onBibleSelect,
  onBookSelect,
  onChapterSelect,
  onClose 
}) => {
  const [currentStep, setCurrentStep] = useState('bible');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter(book => 
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );



  const handleBibleSelect = (bible) => {
    onBibleSelect(bible.id);
    setCurrentStep('book');
  };

  const handleBookSelect = (book) => {
    onBookSelect(book.id);
    setCurrentStep('chapter');
  };

  const handleChapterSelect = (chapter) => {
    onChapterSelect(chapter.id);
    // El selector se cerrará automáticamente cuando se cargue el capítulo
  };

  const renderBibleSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Selecciona una Biblia</h2>
        <p className="text-gray-600 dark:text-gray-400">Elige tu traducción preferida</p>
      </div>
      
      <div className="grid gap-3">
        {bibles.map(bible => (
          <Card 
            key={bible.id}
            className={`cursor-pointer transition-all hover:shadow-md active:scale-98 ${
              selectedBible === bible.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => handleBibleSelect(bible)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{bible.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{bible.language?.name}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBookSelection = () => {
    // Separar libros por testamento basado en índice
    const oldTestamentBooks = filteredBooks.slice(0, 39);
    const newTestamentBooks = filteredBooks.slice(39);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Selecciona un Libro</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {bibles.find(b => b.id === selectedBible)?.name}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setCurrentStep('bible')}>
            Cambiar Biblia
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar libro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-6">
          {oldTestamentBooks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Antiguo Testamento
                </Badge>
                <span className="text-sm text-gray-500">{oldTestamentBooks.length} libros</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {oldTestamentBooks.map(book => (
                  <Button
                    key={book.id}
                    variant={selectedBook === book.id ? "default" : "outline"}
                    className="h-auto p-3 text-left justify-start hover:scale-105 active:scale-95 transition-all"
                    onClick={() => handleBookSelect(book)}
                  >
                    <div>
                      <div className="font-medium text-sm">{book.name}</div>
                      <div className="text-xs opacity-70">Libro bíblico</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {newTestamentBooks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Nuevo Testamento
                </Badge>
                <span className="text-sm text-gray-500">{newTestamentBooks.length} libros</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {newTestamentBooks.map(book => (
                  <Button
                    key={book.id}
                    variant={selectedBook === book.id ? "default" : "outline"}
                    className="h-auto p-3 text-left justify-start hover:scale-105 active:scale-95 transition-all"
                    onClick={() => handleBookSelect(book)}
                  >
                    <div>
                      <div className="font-medium text-sm">{book.name}</div>
                      <div className="text-xs opacity-70">Libro bíblico</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChapterSelection = () => {
    const selectedBookData = books.find(b => b.id === selectedBook);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{selectedBookData?.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selecciona un capítulo
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setCurrentStep('book')}>
            Cambiar Libro
          </Button>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {chapters.map(chapter => (
            <Button
              key={chapter.id}
              variant={selectedChapter === chapter.id ? "default" : "outline"}
              className="aspect-square p-0 hover:scale-110 active:scale-95 transition-all"
              onClick={() => handleChapterSelect(chapter)}
            >
              {chapter.number}
            </Button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            💡 Toca un número para ir directamente a ese capítulo
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">Navegación Bíblica</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {currentStep === 'bible' && renderBibleSelection()}
          {currentStep === 'book' && renderBookSelection()}
          {currentStep === 'chapter' && renderChapterSelection()}
        </CardContent>
      </Card>
    </div>
  );
};

export default BibleSelector;