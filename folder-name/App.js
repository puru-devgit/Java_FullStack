import React, { useState } from 'react';
import './index.css';

import Navbar      from './components/Navbar';
import Home        from './pages/Home';
import Login       from './pages/Login';
import JoinQueue   from './pages/JoinQueue';
import QueueStatus from './pages/QueueStatus';
import Feedback    from './pages/Feedback';

export default function App() {
  const [page, setPage]   = useState('home');
  const [user, setUser]   = useState(null);
  const [queue, setQueue] = useState(null); // { id, name, address }

  const nav = (p) => setPage(p);

  const renderPage = () => {
    switch (page) {
      case 'home':         return <Home        nav={nav} />;
      case 'login':        return <Login       nav={nav} setUser={setUser} />;
      case 'join-queue':   return <JoinQueue   nav={nav} user={user} setQueue={setQueue} />;
      case 'queue-status': return <QueueStatus nav={nav} user={user} queue={queue} />;
      case 'feedback':     return <Feedback    nav={nav} user={user} />;
      default:             return <Home        nav={nav} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar page={page} nav={nav} user={user} setUser={setUser} setPage={setPage} />
      <main style={{ paddingTop: 68 }}>
        {renderPage()}
      </main>
    </div>
  );
}