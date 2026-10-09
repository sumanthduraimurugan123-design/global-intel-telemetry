import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import WorldExplorer from './pages/WorldExplorer';

function App() {
  // Support route hash: #/explorer or default #/
  const getInitialPage = () => {
    if (window.location.hash === '#/explorer' || window.location.hash === '#/world-explorer') {
      return 'world-explorer';
    }
    return 'dashboard';
  };

  const [activePage, setActivePage] = useState(getInitialPage);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/explorer' || window.location.hash === '#/world-explorer') {
        setActivePage('world-explorer');
      } else {
        setActivePage('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigatePage = (pageName) => {
    setActivePage(pageName);
    if (pageName === 'world-explorer') {
      window.location.hash = '#/explorer';
    } else {
      window.location.hash = '#/';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-slate-950">
      {activePage === 'world-explorer' ? (
        <WorldExplorer
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
