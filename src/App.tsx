import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function App() {
  const [party, setParty] = useState<string[]>(["Bulbasaur", "Charmander"]);
  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState("rules");
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
    if (stored === 'light' || stored === 'dark') setTheme(stored);
  }, []);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const add = () => {
    if (!name.trim()) return;
    setParty((p) => [...p, name.trim()]);
    setName("");
  };

  const rootBg = theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-gray-100 text-slate-900';
  const headerBg = theme === 'dark' ? 'bg-slate-950/70 border-white/10' : 'bg-white/80 border-black/10';
  const sectionClass = (theme === 'dark')
    ? 'rounded-2xl border border-white/10 p-4 md:p-6 bg-white/5 transition-colors duration-300 w-full'
    : 'rounded-2xl border border-black/10 p-4 md:p-6 bg-white transition-colors duration-300 w-full';

  const cardClass = (theme === 'dark')
    ? 'rounded-xl border border-white/10 p-4 bg-black/20 hover:bg-black/30 transition-colors duration-300 cursor-pointer w-full'
    : 'rounded-xl border border-black/10 p-4 bg-white hover:bg-gray-50 transition-colors duration-300 cursor-pointer w-full';

  // class to make a section occupy the full mobile viewport (below the header)
  const mobileFullClass = 'md:relative md:inset-auto md:top-0 md:z-auto md:p-0 fixed inset-0 top-16 z-40 p-0 overflow-auto';

  const backButtonClass = theme === 'dark'
    ? 'rounded-xl px-3 py-1 font-semibold bg-white/10 text-slate-100 hover:bg-white/20'
    : 'rounded-xl px-3 py-1 font-semibold bg-gray-200 text-slate-900 hover:bg-gray-300';

  const toggleButtonClass = theme === 'dark'
    ? 'rounded-xl px-3 py-1 text-sm bg-white/10 hover:bg-white/20 flex items-center gap-2'
    : 'rounded-xl px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 flex items-center gap-2';

  return (
    <div className={`min-h-dvh ${rootBg}`}>
      <Sidebar onNavigate={(p) => { setCurrentPage(p); setMobileSidebarOpen(false); }} theme={theme} isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <header className={`sticky top-0 backdrop-blur md:ml-64 ${headerBg}`}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen((v) => !v)}
              className="md:hidden rounded-md p-2 bg-black/10 text-slate-100"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-[hsl(var(--brand))]">Pokémon</span> DnD
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={toggleButtonClass}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <> 
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                  Light
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Dark
                </>
              )}
            </button>
            <span className="text-sm opacity-75">v0.1</span>
          </div>
        </div>
      </header>
      
      <main className="ml-64">
  <div className="w-full md:max-w-5xl md:mx-auto px-0 md:px-4 py-6 md:py-8 grid gap-6">
          {currentPage === 'rules' ? (
            <section className={`${sectionClass} ${mobileFullClass}`}>
              <h2 className="text-xl font-semibold mb-3">Game Rules</h2>
              <p className="opacity-80 mb-4">Basic rules and guidelines for playing Pokémon in a D&D setting.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'capturing', title: 'Capturing Pokémon' },
                  { id: 'combat', title: 'Combat' }
                ].map((r) => (
                  <div
                    key={r.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setCurrentPage(`rule:${r.id}`)}
                    onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(`rule:${r.id}`)}
                    className={cardClass}
                  >
                    <h3 className="font-medium">{r.title}</h3>
                  </div>
                ))}
              </div>
            </section>
            ) : currentPage.startsWith('rule:') ? (
            <section className={`${sectionClass} ${mobileFullClass}`}>
                <h2 className="text-xl font-semibold mb-3">Rule</h2>
                <p className="opacity-90 text-lg">{`Rule: ${currentPage.replace('rule:', '') === 'capturing' ? 'Capturing Pokémon' : currentPage.replace('rule:', '') === 'combat' ? 'Combat' : currentPage.replace('rule:', '')}`}</p>
                <div className="mt-4">
                  <button
                  onClick={() => setCurrentPage('rules')}
                  className={backButtonClass}
                  >
                    Back to Rules
                  </button>
                </div>
              </section>
            ) : currentPage === 'classes' ? (
            <section className={`${sectionClass} ${mobileFullClass}`}>
              <h2 className="text-xl font-semibold mb-3">Trainer Types</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  'Normal',
                  'Fire',
                  'Water',
                  'Electric',
                  'Grass',
                  'Ice',
                  'Fighting',
                  'Poison',
                  'Ground',
                  'Flying',
                  'Psychic',
                  'Bug',
                  'Rock',
                  'Ghost',
                  'Dragon',
                  'Dark',
                  'Steel',
                  'Fairy'
                ].map((type) => (
                  <div
                    key={type}
                    role="button"
                    tabIndex={0}
                    onClick={() => setCurrentPage(`type:${type}`)}
                    onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(`type:${type}`)}
                    className={cardClass}
                  >
                    <h3 className="font-medium">{type}</h3>
                  </div>
                ))}
              </div>
            </section>
          ) : currentPage.startsWith('type:') ? (
            // Trainer type detail page
            <section className={`${sectionClass} ${mobileFullClass}`}> 
              <h2 className="text-xl font-semibold mb-3">Trainer Type</h2>
              <p className="opacity-90 text-lg">{`Trainer Type: ${currentPage.replace('type:', '')}`}</p>
              <div className="mt-4">
                <button
                  onClick={() => setCurrentPage('classes')}
                  className={backButtonClass}
                >
                  Back to Types
                </button>
              </div>
            </section>
          ) : (
            <>
              <section className="rounded-2xl border border-white/10 p-6 bg-white/5">
                <h2 className="text-xl font-semibold mb-3">Your Party</h2>
                <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {party.map((p, i) => (
                    <li key={i} className="rounded-xl border border-white/10 p-4 bg-black/20">
                      <div className="text-lg font-medium">{p}</div>
                      <div className="text-xs opacity-60">Level {10 + i} • Neutral</div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Add a Pokémon…"
                    className="flex-1 rounded-xl bg-black/30 border border-white/10 px-4 py-2 outline-none focus:ring-2 ring-[hsl(var(--brand))]"
                  />
                  <button
                    onClick={add}
                    className="rounded-xl px-4 py-2 font-semibold bg-[hsl(var(--brand))] text-slate-950 hover:opacity-90"
                  >
                    Add
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 p-6 bg-white/5">
                <h2 className="text-xl font-semibold mb-3">Session Notes</h2>
                <p className="opacity-80">
                  Use Tailwind classes to style locations, encounters, and custom rules for your Pokémon-DnD sessions.
                </p>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}