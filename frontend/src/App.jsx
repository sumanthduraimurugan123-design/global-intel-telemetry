import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import WorldExplorer from './pages/WorldExplorer';
import EventRadar from './pages/EventRadar';
import CityIntelligence from './pages/CityIntelligence';

function App() {
  const getInitialPage = () => {
    const h = window.location.hash;
    if (h === '#/explorer' || h === '#/world-explorer') return 'world-explorer';
    if (h === '#/radar' || h === '#/event-radar') return 'event-radar';
    if (h === '#/city' || h === '#/city-intelligence') return 'city-intelligence';
    return 'dashboard';
  };

  const [activePage, setActivePage] = useState(getInitialPage);

  useEffect(() => {
    const handleHashChange = () => {
      const h = window.location.hash;
      if (h === '#/explorer' || h === '#/world-explorer') setActivePage('world-explorer');
      else if (h === '#/radar' || h === '#/event-radar') setActivePage('event-radar');
      else if (h === '#/city' || h === '#/city-intelligence') setActivePage('city-intelligence');
      else setActivePage('dashboard');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigatePage = (pageName) => {
    setActivePage(pageName);
    const HASH_MAP = {
      'world-explorer': '#/explorer',
      'event-radar': '#/radar',
      'city-intelligence': '#/city',
      'dashboard': '#/',
    };
    window.location.hash = HASH_MAP[pageName] || '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-slate-950">
      {activePage === 'world-explorer' ? (
        <WorldExplorer
          onNavigateBack={() => handleNavigatePage('dashboard')}
          onNavigatePage={handleNavigatePage}
        />
      ) : activePage === 'event-radar' ? (
        <EventRadar
          onNavigateBack={() => handleNavigatePage('dashboard')}
          onNavigatePage={handleNavigatePage}
        />
      ) : activePage === 'city-intelligence' ? (
        <CityIntelligence
          onNavigateBack={() => handleNavigatePage('dashboard')}
          onNavigatePage={handleNavigatePage}
        />
      ) : (
        <Dashboard
          activePage={activePage}
          onNavigatePage={handleNavigatePage}
        />
      )}
    </div>
  );
}

export default App;
