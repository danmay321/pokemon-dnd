import { useState } from 'react';

interface SidebarProps {
  onNavigate: (page: string) => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [activePage, setActivePage] = useState('rules');

  const navigate = (page: string) => {
    setActivePage(page);
    onNavigate(page);
  };

  return (
    <aside className="w-64 h-screen border-r border-white/10 bg-slate-950 fixed left-0 top-0">
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
                  ? 'bg-black/20 text-slate-100 border-2 border-white/40 shadow-sm'
                  : 'bg-black/10 text-slate-100 border border-white/5 hover:bg-white/5'
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
                  ? 'bg-black/20 text-slate-100 border-2 border-white/40 shadow-sm'
                  : 'bg-black/10 text-slate-100 border border-white/5 hover:bg-white/5'
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
