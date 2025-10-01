import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function App() {
  const [pokemon] = useState<string[]>(["Squirtle", "Bulbasaur", "Charmander"]);
  const [currentPage, setCurrentPage] = useState("rules");
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
    if (stored === 'light' || stored === 'dark') setTheme(stored);
  }, []);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  // available pokemon are static for now

  const rootBg = theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-gray-100 text-slate-900';
  const headerBg = theme === 'dark' ? 'bg-slate-950/70 border-white/10' : 'bg-white/80 border-black/10';
  const sectionClass = (theme === 'dark')
    ? 'rounded-2xl border border-white/10 p-4 md:p-6 bg-white/5 transition-colors duration-300 w-full'
    : 'rounded-2xl border border-black/10 p-4 md:p-6 bg-white transition-colors duration-300 w-full';

  const cardClass = (theme === 'dark')
    ? 'rounded-xl border border-white/10 p-4 bg-black/20 hover:bg-black/30 transition-colors duration-300 cursor-pointer w-full'
    : 'rounded-xl border border-black/10 p-4 bg-white hover:bg-gray-50 transition-colors duration-300 cursor-pointer w-full';

  const searchInputClass = theme === 'dark'
    ? 'rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none text-slate-100 placeholder-slate-400 focus:ring-2 ring-[hsl(var(--brand))]'
    : 'rounded-xl bg-white border border-black/10 px-3 py-2 outline-none text-slate-900 placeholder-slate-500 focus:ring-2 ring-[hsl(var(--brand))]';

  const typesList = ['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy'];
  const rulesList = [{ id: 'capturing', title: 'Capturing Pokémon' }, { id: 'combat', title: 'Combat' }];

  const lower = search.trim().toLowerCase();
  const filteredTypes = lower ? typesList.filter(t => t.toLowerCase().includes(lower)) : typesList;
  const filteredRules = lower ? rulesList.filter(r => r.title.toLowerCase().includes(lower)) : rulesList;
  const filteredPokemon = lower ? pokemon.filter(p => p.toLowerCase().includes(lower)) : pokemon;

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
      <Sidebar
        onNavigate={(p) => { setCurrentPage(p); setMobileSidebarOpen(false); }}
        theme={theme}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
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
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search types, rules, pokemon…"
              className={`${searchInputClass} hidden sm:inline-block w-48 md:w-64`}
            />
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
      
      {/* Mobile search results panel */}
      {search.trim() && (
        <>
          <div className="md:hidden fixed top-16 left-0 right-0 z-50 bg-black/60 p-2">
            <div className={theme === 'dark' ? 'bg-slate-900 border border-white/10 text-slate-100 rounded-lg p-2' : 'bg-gray-100 text-slate-900 rounded-lg p-2'}>
              {filteredRules.length > 0 && (
                <div className="mb-2">
                  <div className="text-sm font-semibold mb-1">Rules</div>
                  <div className="grid gap-2">
                    {filteredRules.map(r => (
                      <button key={r.id} onClick={() => { setCurrentPage(`rule:${r.id}`); setSearch(''); }} className={cardClass}>{r.title}</button>
                    ))}
                  </div>
                </div>
              )}
              {filteredTypes.length > 0 && (
                <div className="mb-2">
                  <div className="text-sm font-semibold mb-1">Types</div>
                  <div className="grid gap-2">
                    {filteredTypes.map(t => (
                      <button key={t} onClick={() => { setCurrentPage(`type:${t}`); setSearch(''); }} className={cardClass}>{t}</button>
                    ))}
                  </div>
                </div>
              )}
              {filteredPokemon.length > 0 && (
                <div>
                  <div className="text-sm font-semibold mb-1">Pokemon</div>
                  <div className="grid gap-2">
                    {filteredPokemon.map((p, i) => (
                      <button key={i} onClick={() => { setCurrentPage(`pokemon:${p}`); setSearch(''); }} className={cardClass}>{p}</button>
                    ))}
                  </div>
                </div>
              )}
              {filteredRules.length === 0 && filteredTypes.length === 0 && filteredPokemon.length === 0 && (
                <div className="py-4 text-sm opacity-80 italic">No results found...</div>
              )}
            </div>
          </div>

          {/* Desktop / tablet search dropdown */}
          <div className="hidden md:block absolute left-0 right-0 top-16 z-50 pointer-events-none">
            <div className="max-w-5xl mx-auto px-4">
              <div className={`${theme === 'dark' ? 'bg-slate-900 border border-white/10 text-slate-100' : 'bg-gray-100 text-slate-900'} rounded-lg p-3 pointer-events-auto shadow-md z-50`}>
                {filteredRules.length > 0 && (
                  <div className="mb-2">
                    <div className="text-sm font-semibold mb-1">Rules</div>
                    <div className="grid gap-2">
                      {filteredRules.map(r => (
                        <button key={r.id} onClick={() => { setCurrentPage(`rule:${r.id}`); setSearch(''); }} className={cardClass}>{r.title}</button>
                      ))}
                    </div>
                  </div>
                )}
                {filteredTypes.length > 0 && (
                  <div className="mb-2">
                    <div className="text-sm font-semibold mb-1">Types</div>
                    <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-4">
                      {filteredTypes.map(t => (
                        <button key={t} onClick={() => { setCurrentPage(`type:${t}`); setSearch(''); }} className={cardClass}>{t}</button>
                      ))}
                    </div>
                  </div>
                )}
                {filteredPokemon.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold mb-1">Pokemon</div>
                    <div className="grid gap-2">
                      {filteredPokemon.map((p, i) => (
                        <button key={i} onClick={() => { setCurrentPage(`pokemon:${p}`); setSearch(''); }} className={cardClass}>{p}</button>
                      ))}
                    </div>
                  </div>
                )}
                {filteredRules.length === 0 && filteredTypes.length === 0 && filteredPokemon.length === 0 && (
                  <div className="py-3 text-sm opacity-80 italic">No results found...</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <main className="md:ml-64">
  <div className="w-full md:max-w-5xl md:mx-auto px-0 md:px-4 py-6 md:py-8 grid gap-6">
          {currentPage === 'rules' ? (
            <section className={`${sectionClass} ${mobileFullClass}`}>
              <h2 className="text-xl font-semibold mb-3">Game Rules</h2>
              <p className="opacity-80 mb-4">Basic rules and guidelines for playing Pokémon in a D&D setting.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredRules.map((r) => (
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
                {filteredTypes.map((type) => (
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
          ) : currentPage === 'pokemon' ? (
            <section className={`${sectionClass} ${mobileFullClass}`}>
              <h2 className="text-xl font-semibold mb-3">Available Pokémon</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {pokemon.map((p) => (
                  <div
                    key={p}
                    role="button"
                    tabIndex={0}
                    onClick={() => setCurrentPage(`pokemon:${p}`)}
                    onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(`pokemon:${p}`)}
                    className={cardClass}
                  >
                    <h3 className="font-medium">{p}</h3>
                  </div>
                ))}
              </div>
            </section>
          ) : currentPage.startsWith('pokemon:') ? (
            <section className={`${sectionClass} ${mobileFullClass}`}>
              <h2 className="text-xl font-semibold mb-3">Pokémon</h2>
              <p className="opacity-90 text-lg">{`Pokémon: ${currentPage.replace('pokemon:', '')}`}</p>
              <div className="mt-4">
                <button
                  onClick={() => setCurrentPage('pokemon')}
                  className={backButtonClass}
                >
                  Back to Pokémon
                </button>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-white/10 p-6 bg-white/5">
              <h2 className="text-xl font-semibold mb-3">Session Notes</h2>
              <p className="opacity-80">
                Use Tailwind classes to style locations, encounters, and custom rules for your Pokémon-DnD sessions.
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}