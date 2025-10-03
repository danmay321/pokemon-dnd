import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function App() {
  const titleCase = (s: string) => s ? s.split(/[-_\s]+/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') : s;

  const [pokemon, setPokemon] = useState<any[]>([]);
  const [typesData, setTypesData] = useState<any[]>([]);

  useEffect(() => {
    // fetch types and pokemon from API on mount
    (async () => {
      try {
        const typesRes = await fetch('/api/types');
        const typesJson = await typesRes.json();
        setTypesData(typesJson);

        const pokeRes = await fetch('/api/pokemon');
        const pokeJson = await pokeRes.json();
        const mapped = pokeJson.map((p: any) => ({
          ...p,
          slug: (p.slug || p.name).toString().toLowerCase(),
          displayName: titleCase((p.name || p.slug || '').toString())
        }));
        setPokemon(mapped);
      } catch (err) {
        console.error('Failed to fetch API data', err);
      }
    })();
  }, []);
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

  // same section styling but with transparent background so images with alpha show the app background
  const sectionClassTransparent = (theme === 'dark')
    ? 'rounded-2xl border border-white/10 p-4 md:p-6 bg-transparent transition-colors duration-300 w-full'
    : 'rounded-2xl border border-black/10 p-4 md:p-6 bg-transparent transition-colors duration-300 w-full';

  const cardClass = (theme === 'dark')
    ? 'rounded-xl border border-white/10 p-4 bg-black/20 hover:bg-black/30 transition-colors duration-300 cursor-pointer w-full'
    : 'rounded-xl border border-black/10 p-4 bg-white hover:bg-gray-50 transition-colors duration-300 cursor-pointer w-full';

  const searchInputClass = theme === 'dark'
    ? 'rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none text-slate-100 placeholder-slate-400 focus:ring-2 ring-[hsl(var(--brand))]'
    : 'rounded-xl bg-white border border-black/10 px-3 py-2 outline-none text-slate-900 placeholder-slate-500 focus:ring-2 ring-[hsl(var(--brand))]';

  const typesList = ['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy'];
  const rulesList = [{ id: 'capturing', title: 'Capturing Pokémon' }, { id: 'combat', title: 'Combat' }, { id: 'character', title: 'Creating a Character' }];

  // build id -> name and id -> color maps from typesData
  const typeIdToName: Record<number, string> = {};
  const typeIdToColor: Record<number, string> = {};
  for (const t of typesData) {
    typeIdToName[t.id] = t.name;
    typeIdToColor[t.id] = t.color || '#94a3b8';
  }

  // build a mapping of slug -> type names from the fetched data
  const pokemonTypes: Record<string, string[]> = {};
  for (const p of pokemon) {
    const slug = (p.slug || p.name || '').toString().toLowerCase();
    const typesArr: string[] = [];
    if (p.primary_type_id) typesArr.push(typeIdToName[p.primary_type_id]);
    if (p.secondary_type_id) typesArr.push(typeIdToName[p.secondary_type_id]);
    pokemonTypes[slug] = typesArr.filter(Boolean) as string[];
  }

  // map type -> explicit hex color (used for inline gradients)
  const typeColorMap: Record<string, string> = {
    Fire: '#fb923c',        // orange-400
    Water: '#38bdf8',       // sky-400
    Grass: '#22c55e',       // green-400
    Electric: '#facc15',    // yellow-400
    Ice: '#99f6e4',         // cyan-200
    Fighting: '#fb923c',    // orange-500-ish
    Poison: '#a78bfa',      // violet-400
    Ground: '#f59e0b',      // amber-500
    Flying: '#6366f1',      // indigo-500
    Psychic: '#f472b6',     // fuchsia-400
    Bug: '#34d399',         // emerald-400
    Rock: '#a8a29e',        // stone-400
    Ghost: '#4338ca',       // indigo-700
    Dragon: '#7c3aed',      // purple-600
    Dark: '#334155',        // slate-600
    Steel: '#9ca3af',       // gray-400
    Fairy: '#f9a8d4',       // pink-300
    Normal: '#e6e0d4'
  };

  // return a tuple of CSS colors [c1, c2] to build an inline linear-gradient
  const getBorderColors = (slug: string) => {
    const types = pokemonTypes[slug] || [];
    if (types.length === 0) return ['#94a3b8', '#94a3b8'];
    const colors = types.slice(0, 2).map(t => typeColorMap[t] || '#94a3b8');
    if (colors.length === 1) return [colors[0], colors[0]];
    return [colors[0], colors[1]];
  };

  // use a slightly thicker border for dual-type pokemon
  const borderPadding = (slug: string) => {
    const types = pokemonTypes[slug] || [];
    // larger padding for a stronger square border: single-type = 4px, dual-type = 8px
    return types.length > 1 ? 'p-2' : 'p-1';
  };

  const lower = search.trim().toLowerCase();
  const filteredTypes = lower ? typesList.filter(t => t.toLowerCase().includes(lower)) : typesList;
  const filteredRules = lower ? rulesList.filter(r => r.title.toLowerCase().includes(lower)) : rulesList;
  const filteredPokemon = lower ? pokemon.filter((p) => p.displayName.toLowerCase().includes(lower) || p.slug.toLowerCase().includes(lower)) : pokemon;

  // class to make a section occupy the full mobile viewport (below the header)
  const mobileFullClass = 'md:relative md:inset-auto md:top-0 md:z-auto md:p-0 fixed inset-0 top-16 z-40 p-0 overflow-auto';

  const selectedPokemonSlug = currentPage.startsWith('pokemon:') ? currentPage.replace('pokemon:', '') : '';
  const selectedPokemon = pokemon.find(p => p.slug === selectedPokemonSlug) || null;
  const selectedPokemonName = selectedPokemon ? selectedPokemon.displayName : '';

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
                    {filteredPokemon.map((p: any, i: number) => (
                      <button key={i} onClick={() => { setCurrentPage(`pokemon:${p.slug}`); setSearch(''); }} className={cardClass}>{p.displayName}</button>
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
                      {filteredPokemon.map((p: any, i: number) => (
                        <button key={i} onClick={() => { setCurrentPage(`pokemon:${p.slug}`); setSearch(''); }} className={cardClass}>{p.displayName}</button>
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
                <p className="opacity-90 text-lg">{`Rule: ${(() => {
                  const ruleId = currentPage.replace('rule:', '');
                  const rule = rulesList.find(r => r.id === ruleId);
                  return rule ? rule.title : ruleId;
                })()}`}</p>
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
                {pokemon.map((p: any) => (
                  <div
                    key={p.slug}
                    role="button"
                    tabIndex={0}
                    onClick={() => setCurrentPage(`pokemon:${p.slug}`)}
                    onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(`pokemon:${p.slug}`)}
                    className={cardClass}
                  >
                    <h3 className="font-medium">{p.displayName}</h3>
                  </div>
                ))}
              </div>
            </section>
          ) : currentPage.startsWith('pokemon:') ? (
                    <section className={`${sectionClassTransparent} ${mobileFullClass}`}>
                      <h2 className="text-2xl font-bold mb-6 tracking-tight">{selectedPokemonName}</h2>
                      <div className="flex items-start gap-4">
                        {(() => {
                          const [c1, c2] = getBorderColors(selectedPokemonSlug);
                          const pad = borderPadding(selectedPokemonSlug);
                          return (
                            <div className={pad} style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                              <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'} flex items-center justify-center`} style={{ width: 176, height: 176 }}>
                                <img
                                  src={`/pokemon-${selectedPokemonSlug}.png`}
                                  alt={selectedPokemonName}
                                  onError={(e: any) => {
                                    const img = e.currentTarget as HTMLImageElement;
                                    if (!img.dataset.fallback) {
                                      img.dataset.fallback = '1';
                                      img.src = `/pokemon-${selectedPokemonSlug}.svg`;
                                    }
                                  }}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-40 h-40 object-contain mix-blend-normal bg-transparent"
                                />
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Stats Table */}
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3">Stats</h3>
                        <div className="overflow-x-auto">
                          <table className={`w-full ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'} border-collapse`}>
                            <thead>
                              <tr className={`${theme === 'dark' ? 'border-white/10' : 'border-black/10'} border-b`}>
                                <th className="text-left py-2 px-3 font-medium">Stat</th>
                                <th className="text-left py-2 px-3 font-medium">Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className={`${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'} border-b`}>
                                <td className="py-2 px-3 font-medium">Armor Class</td>
                                  <td className="py-2 px-3">{selectedPokemon?.armor_class ?? 10}</td>
                              </tr>
                                <tr className={`${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'} border-b`}>
                                  <td className="py-2 px-3 font-medium">Ground Speed</td>
                                  <td className="py-2 px-3">{selectedPokemon?.ground_speed ?? 0} ft.</td>
                                </tr>
                                <tr className={`${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'} border-b`}>
                                  <td className="py-2 px-3 font-medium">Swimming Speed</td>
                                  <td className="py-2 px-3">{selectedPokemon?.swimming_speed ?? 0} ft.</td>
                                </tr>
                                <tr className={`${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'} border-b`}>
                                  <td className="py-2 px-3 font-medium">Flying Speed</td>
                                  <td className="py-2 px-3">{selectedPokemon?.flying_speed ?? 0} ft.</td>
                                </tr>
                              <tr className={`${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'} border-b`}>
                                <td className="py-2 px-3 font-medium">Strength</td>
                                <td className="py-2 px-3">{selectedPokemon?.base_strength || 0} ({Math.floor((selectedPokemon?.base_strength || 0) / 2) - 5 >= 0 ? '+' : ''}{Math.floor((selectedPokemon?.base_strength || 0) / 2) - 5})</td>
                              </tr>
                              <tr className={`${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'} border-b`}>
                                <td className="py-2 px-3 font-medium">Dexterity</td>
                                <td className="py-2 px-3">{selectedPokemon?.base_dexterity || 0} ({Math.floor((selectedPokemon?.base_dexterity || 0) / 2) - 5 >= 0 ? '+' : ''}{Math.floor((selectedPokemon?.base_dexterity || 0) / 2) - 5})</td>
                              </tr>
                              <tr className={`${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'} border-b`}>
                                <td className="py-2 px-3 font-medium">Constitution</td>
                                <td className="py-2 px-3">{selectedPokemon?.base_constitution || 0} ({Math.floor((selectedPokemon?.base_constitution || 0) / 2) - 5 >= 0 ? '+' : ''}{Math.floor((selectedPokemon?.base_constitution || 0) / 2) - 5})</td>
                              </tr>
                              <tr className={`${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'} border-b`}>
                                <td className="py-2 px-3 font-medium">Intelligence</td>
                                <td className="py-2 px-3">{selectedPokemon?.base_intelligence || 0} ({Math.floor((selectedPokemon?.base_intelligence || 0) / 2) - 5 >= 0 ? '+' : ''}{Math.floor((selectedPokemon?.base_intelligence || 0) / 2) - 5})</td>
                              </tr>
                              <tr className={`${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'} border-b`}>
                                <td className="py-2 px-3 font-medium">Wisdom</td>
                                <td className="py-2 px-3">{selectedPokemon?.base_wisdom || 0} ({Math.floor((selectedPokemon?.base_wisdom || 0) / 2) - 5 >= 0 ? '+' : ''}{Math.floor((selectedPokemon?.base_wisdom || 0) / 2) - 5})</td>
                              </tr>
                              <tr className={`${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'}`}>
                                <td className="py-2 px-3 font-medium">Charisma</td>
                                <td className="py-2 px-3">{selectedPokemon?.base_charisma || 0} ({Math.floor((selectedPokemon?.base_charisma || 0) / 2) - 5 >= 0 ? '+' : ''}{Math.floor((selectedPokemon?.base_charisma || 0) / 2) - 5})</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

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