import { useState } from 'react';

interface SidebarProps {
  onNavigate: (page: string) => void;
  theme?: 'dark' | 'light';
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ onNavigate, theme = 'dark', isOpen = false, onClose }: SidebarProps) {
  const [activePage, setActivePage] = useState('rules');

  const navigate = (page: string) => {
    setActivePage(page);
    onNavigate(page);
    if (onClose) onClose();
  };

  const asideClass = theme === 'dark'
    ? 'w-64 h-screen border-r border-white/10 bg-slate-950 fixed left-0 top-0 transition-colors duration-300'
    : 'w-64 h-screen border-r border-black/10 bg-gray-50 fixed left-0 top-0 transition-colors duration-300';

  // Mobile slide-in classes
  const mobileClass = isOpen
    ? 'translate-x-0 visible'
    : '-translate-x-full invisible md:visible md:translate-x-0';

  return (
    <aside className={`${asideClass} transform transition-transform duration-300 ${mobileClass}`}>
      <nav className="p-4 pt-6 md:pt-20">
        {/* Mobile close button */}
        <div className="md:hidden mb-4 flex items-center justify-end">
          <button
            onClick={() => onClose && onClose()}
            className="rounded-md p-2 bg-black/10 text-slate-100"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        {/* Always show both entries with short descriptions */}
        <ul className="space-y-3">
          <li>
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate('rules')}
              onKeyDown={(e) => e.key === 'Enter' && navigate('rules')}
              className={`w-full p-3 rounded-2xl transition-colors cursor-pointer ${
                activePage === 'rules'
                  ? (theme === 'dark' ? 'bg-black/20 text-slate-100 border-2 border-white/40 shadow-sm' : 'bg-white text-slate-900 border-2 border-black/20 shadow-sm')
                  : (theme === 'dark' ? 'bg-black/10 text-slate-100 border border-white/5 hover:bg-white/5' : 'bg-white text-slate-900 border border-black/10 hover:bg-gray-100')
              }`}
            >
              <div className="font-semibold">Rules</div>
            </div>
          </li>

          <li>
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate('classes')}
              onKeyDown={(e) => e.key === 'Enter' && navigate('classes')}
              className={`w-full p-3 rounded-2xl transition-colors cursor-pointer ${
                activePage === 'classes'
                  ? (theme === 'dark' ? 'bg-black/20 text-slate-100 border-2 border-white/40 shadow-sm' : 'bg-white text-slate-900 border-2 border-black/20 shadow-sm')
                  : (theme === 'dark' ? 'bg-black/10 text-slate-100 border border-white/5 hover:bg-white/5' : 'bg-white text-slate-900 border border-black/10 hover:bg-gray-100')
              }`}
            >
              <div className="font-semibold">Classes</div>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
