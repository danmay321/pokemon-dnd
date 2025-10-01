import { useState } from "react";
import Sidebar from "./Sidebar";

export default function App() {
  const [party, setParty] = useState<string[]>(["Bulbasaur", "Charmander"]);
  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState("rules");

  const add = () => {
    if (!name.trim()) return;
    setParty((p) => [...p, name.trim()]);
    setName("");
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <Sidebar onNavigate={setCurrentPage} />
      <header className="border-b border-white/10 sticky top-0 backdrop-blur bg-slate-950/70 ml-64">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-[hsl(var(--brand))]">Pokémon</span> DnD
          </h1>
          <span className="text-sm opacity-75">v0.1</span>
        </div>
      </header>
      
      <main className="ml-64">
        <div className="max-w-5xl mx-auto px-4 py-8 grid gap-6">
          {currentPage === 'rules' ? (
            <section className="rounded-2xl border border-white/10 p-6 bg-white/5">
              <h2 className="text-xl font-semibold mb-3">Game Rules</h2>
              <p className="opacity-80 mb-4">Basic rules and guidelines for playing Pokémon in a D&D setting.</p>

              <div className="grid sm:grid-cols-2 gap-3">
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
                    className="rounded-xl border border-white/10 p-4 bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
                  >
                    <h3 className="font-medium">{r.title}</h3>
                  </div>
                ))}
              </div>
              </section>
            ) : currentPage.startsWith('rule:') ? (
              <section className="rounded-2xl border border-white/10 p-6 bg-white/5">
                <h2 className="text-xl font-semibold mb-3">Rule</h2>
                <p className="opacity-90 text-lg">{`Rule: ${currentPage.replace('rule:', '') === 'capturing' ? 'Capturing Pokémon' : currentPage.replace('rule:', '') === 'combat' ? 'Combat' : currentPage.replace('rule:', '')}`}</p>
                <div className="mt-4">
                  <button
                    onClick={() => setCurrentPage('rules')}
                    className="rounded-xl px-3 py-1 font-semibold bg-white/10 text-slate-100 hover:bg-white/20"
                  >
                    Back to Rules
                  </button>
                </div>
              </section>
            ) : currentPage === 'classes' ? (
            <section className="rounded-2xl border border-white/10 p-6 bg-white/5">
              <h2 className="text-xl font-semibold mb-3">Trainer Types</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
                    className="rounded-xl border border-white/10 p-4 bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
                  >
                    <h3 className="font-medium">{type}</h3>
                  </div>
                ))}
              </div>
            </section>
          ) : currentPage.startsWith('type:') ? (
            // Trainer type detail page
            <section className="rounded-2xl border border-white/10 p-6 bg-white/5">
              <h2 className="text-xl font-semibold mb-3">Trainer Type</h2>
              <p className="opacity-90 text-lg">{`Trainer Type: ${currentPage.replace('type:', '')}`}</p>
              <div className="mt-4">
                <button
                  onClick={() => setCurrentPage('classes')}
                  className="rounded-xl px-3 py-1 font-semibold bg-white/10 text-slate-100 hover:bg-white/20"
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