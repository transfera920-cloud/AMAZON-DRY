import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeTab } from './components/HomeTab';
import { CurriculumTab } from './components/CurriculumTab';
import { ScenarioTab } from './components/ScenarioTab';
import { DashboardTab } from './components/DashboardTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  // Handle URL hash changes on load and popstate/hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#ch-')) {
        setActiveTab('curriculum');
        // Smooth scroll to chapter
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash.startsWith('#sc-') || hash === '#scenario') {
        setActiveTab('scenario');
      } else if (hash === '#dashboard') {
        setActiveTab('dashboard');
      } else if (hash === '#curriculum') {
        setActiveTab('curriculum');
      } else {
        setActiveTab('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'home') {
      window.location.hash = '#home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabId === 'curriculum') {
      window.location.hash = '#curriculum';
    } else if (tabId === 'scenario') {
      window.location.hash = '#scenario';
    } else if (tabId === 'dashboard') {
      window.location.hash = '#dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1510] text-[#f0f6f2] flex flex-col font-sans selection:bg-[#22c55e]/30 selection:text-white">
      <Header activeTab={activeTab} onSelectTab={handleSelectTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Home Tab */}
        <div className={activeTab === 'home' ? 'block' : 'hidden'}>
          <HomeTab onNavigate={handleSelectTab} />
        </div>

        {/* Curriculum Tab:
            CRITICAL SEO Requirement:
            "教案章節的 34 章內容都要存在於 DOM 中，不要只在切換章節時才掛載。
             請用 <section id="ch-01"> … <section id="ch-34"> 搭配 <h2>"
            Always rendered in the DOM, toggled with display classes.
        */}
        <div className={activeTab === 'curriculum' ? 'block' : 'hidden'}>
          <CurriculumTab />
        </div>

        {/* Scenario Tab */}
        <div className={activeTab === 'scenario' ? 'block' : 'hidden'}>
          <ScenarioTab />
        </div>

        {/* Dashboard Tab */}
        <div className={activeTab === 'dashboard' ? 'block' : 'hidden'}>
          <DashboardTab />
        </div>
      </main>

      <Footer />
    </div>
  );
}
