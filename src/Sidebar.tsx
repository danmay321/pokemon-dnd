import { useState } from 'react';

interface SidebarProps {
  onNavigate: (page: string) => void;
  theme?: 'dark' | 'light';
}

export default function Sidebar({ onNavigate, theme = 'dark' }: SidebarProps) {
  const [activePage, setActivePage] = useState('rules');

  const navigate = (page: string) => {
    setActivePage(page);
    onNavigate(page);
  };

  const asideClass = theme === 'dark'
    ? 'w-64 h-screen border-r border-white/10 bg-slate-950 fixed left-0 top-0 transition-colors duration-300'
    : 'w-64 h-screen border-r border-black/10 bg-gray-50 fixed left-0 top-0 transition-colors duration-300';

  return (
    <aside className={asideClass}>
      <nav className="p-4 pt-20">
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
