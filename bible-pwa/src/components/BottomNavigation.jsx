import { Button } from '@/components/ui/button';
import { Home, BookOpen, Heart, Search, Settings } from 'lucide-react';

const BottomNavigation = ({ currentView, setCurrentView, favorites, setShowSettings }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'reader', icon: BookOpen, label: 'Leer' },
    { id: 'search', icon: Search, label: 'Buscar' },
    { id: 'favorites', icon: Heart, label: 'Favoritos', badge: favorites.length },
    { id: 'settings', icon: Settings, label: 'Config' }
  ];

  const handleNavClick = (id) => {
    if (id === 'settings') {
      setShowSettings(true);
    } else {
      setCurrentView(id);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 sm:hidden">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => handleNavClick(item.id)}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
              currentView === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
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
};

export default BottomNavigation;