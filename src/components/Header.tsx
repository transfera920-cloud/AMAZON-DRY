import React from 'react';
import { ShieldCheck, BookOpen, Compass, Activity, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: '首頁概覽', icon: ShieldCheck, hash: '#home' },
    { id: 'curriculum', label: '教案章節 (34章)', icon: BookOpen, hash: '#curriculum' },
    { id: 'scenario', label: '情境演練 (10案)', icon: Compass, hash: '#scenario' },
    { id: 'dashboard', label: '管理主控台', icon: Activity, hash: '#dashboard' },
  ];

  const handleNavClick = (tabId: string, hash: string) => {
    onSelectTab(tabId);
    window.location.hash = hash;
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0a1510]/95 backdrop-blur-md border-b border-[#1e3b30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand link to homepage - strictly <a href="https://amazon-hike.com/"> */}
          <div className="flex items-center gap-3">
            <a
              href="https://amazon-hike.com/"
              className="group flex flex-col text-white hover:text-[#4ade80] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4ade80]/50 rounded-lg py-1 px-1.5"
              title="前往 亞馬遜國家山岳協會 官方首頁"
            >
              <span className="font-serif-tc text-base sm:text-lg font-bold text-white tracking-wide group-hover:text-[#4ade80] transition-colors leading-tight">
                亞馬遜國家山岳協會
              </span>
              <span className="text-[10px] text-[#9ab3a6] tracking-widest font-mono uppercase">
                Amazon Alpine Association
              </span>
            </a>

            <div className="hidden md:block h-5 w-[1px] bg-[#1e3b30] mx-1"></div>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#162c23] text-[#4ade80] border border-[#2e5746]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
              全域乾燥管理實務教案
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.hash}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id, item.hash);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#162c23] text-[#4ade80] border border-[#2e5746] shadow-sm'
                      : 'text-[#9ab3a6] hover:text-[#f0f6f2] hover:bg-[#0f2019]'
                  }`}
                  aria-label={item.label}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#4ade80]' : 'text-[#9ab3a6]'}`} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#9ab3a6] hover:text-white hover:bg-[#162c23] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
              aria-label={mobileMenuOpen ? '關閉主選單' : '開啟主選單'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f2019] border-b border-[#1e3b30] px-4 pt-2 pb-4 space-y-1">
          <div className="py-2 px-3 text-xs text-[#9ab3a6] border-b border-[#1e3b30]/50 mb-1">
            登山全域乾燥管理實務教案・導航選單
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.hash}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id, item.hash);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-[#162c23] text-[#4ade80] border border-[#2e5746]'
                    : 'text-[#9ab3a6] hover:text-white hover:bg-[#162c23]/60'
                }`}
              >
                <Icon className="w-5 h-5 text-[#4ade80]" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};
