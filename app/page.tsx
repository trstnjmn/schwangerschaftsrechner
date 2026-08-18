'use client';

import React, { useState } from 'react';

interface Stage {
  weekMin: number;
  weekMax: number;
  label: string;
  desc: string;
  badgeBg: string;
  badgeText: string;
}

interface CalculationResult {
  weeks: number;
  days: number;
  dueDate: string;
  lmpDate: string;
}

const STAGES: Stage[] = [
  { weekMin: 1, weekMax: 4, label: 'Einnistung', desc: 'Befruchtung & Einnistung in der Gebärmutter. Die Zellteilung läuft auf Hochtouren.', badgeBg: 'bg-[#FDE2E4]', badgeText: 'text-[#9E2A2B]' },
  { weekMin: 5, weekMax: 8, label: 'Embryonalphase', desc: 'Das Herz beginnt zu schlagen. Erste Organe und Extremitäten-Ansätze bilden sich.', badgeBg: 'bg-[#FFCAD4]', badgeText: 'text-[#85182A]' },
  { weekMin: 9, weekMax: 12, label: 'Fötalphase Beginn', desc: 'Gesichtszüge formen sich, Finger und Zehen sind getrennt. Der Embryo wird zum Fötus.', badgeBg: 'bg-mint', badgeText: 'text-[#2D6A4F]' },
  { weekMin: 13, weekMax: 27, label: '2. Trimester (Wachstum)', desc: 'Starkes Längenwachstum, spürbare Kindsbewegungen und das Gehör entwickelt sich.', badgeBg: 'bg-[#D8E2DC]', badgeText: 'text-[#1B4332]' },
  { weekMin: 28, weekMax: 40, label: '3. Trimester (Reifung)', desc: 'Gewichtszunahme, Lungenreifung. Das Baby bereitet sich auf die Geburt vor.', badgeBg: 'bg-[#F4ACB7]', badgeText: 'text-[#590D22]' },
];

export default function Home() {
  const [mode, setMode] = useState<'period' | 'dueDate'>('period');
  const [dateInput, setDateInput] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dateInput) return;

    const inputDate = new Date(dateInput);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let lmpDate: Date;
    let dueDate: Date;

    if (mode === 'period') {
      lmpDate = new Date(inputDate);
      dueDate = new Date(lmpDate);
      dueDate.setDate(dueDate.getDate() + 280);
    } else {
      dueDate = new Date(inputDate);
      lmpDate = new Date(dueDate);
      lmpDate.setDate(lmpDate.getDate() - 280);
    }

    const diffTime = today.getTime() - lmpDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

    if (diffDays < 0) {
      alert('Das berechnete Startdatum liegt in der Zukunft.');
      return;
    }

    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;

    setResult({
      weeks,
      days,
      dueDate: dueDate.toLocaleDateString('de-DE'),
      lmpDate: lmpDate.toLocaleDateString('de-DE'),
    });
  };

  return (
      <main className="min-h-screen bg-cream py-6 px-3 sm:px-6 flex flex-col items-center overflow-x-hidden w-full">
        <div className="w-full max-w-sm sm:max-w-md flex flex-col min-h-[calc(100vh-3rem)]">

          {/* Content Wrapper */}
          <div className="space-y-5 flex-1">
            {/* Header */}
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-3xl font-bold text-text-main">Schwangerschaftsrechner</h1>
              <p className="text-base text-text-sub">Berechne deine SSW & begleite deine Reise</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-[#E9ECEF] p-1 rounded-2xl w-full">
              <button
                  type="button"
                  className={`flex-1 py-2 text-base font-semibold rounded-xl transition-all duration-200 active:scale-95 ${
                      mode === 'period'
                          ? 'bg-white text-purple-dark shadow-sm'
                          : 'text-text-sub hover:text-text-main'
                  }`}
                  onClick={() => { setMode('period'); setResult(null); }}
              >
                Letzte Periode
              </button>
              <button
                  type="button"
                  className={`flex-1 py-2 text-base font-semibold rounded-xl transition-all duration-200 active:scale-95 ${
                      mode === 'dueDate'
                          ? 'bg-white text-purple-dark shadow-sm'
                          : 'text-text-sub hover:text-text-main'
                  }`}
                  onClick={() => { setMode('dueDate'); setResult(null); }}
              >
                Entbindungstermin
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={calculate} className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-border-light space-y-4 w-full">
              <label className="block text-base font-medium text-text-main">
                {mode === 'period'
                    ? 'Erster Tag der letzten Periode'
                    : 'Errechneter Entbindungstermin'}
              </label>
              <input
                  type="date"
                  required
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full max-w-full p-3 text-base border border-mint rounded-2xl focus:ring-2 focus:ring-rose-soft focus:border-transparent outline-none text-text-main bg-cream/50 box-border"
              />
              <button
                  type="submit"
                  className="w-full bg-purple-strong hover:bg-[#6A23A6] text-white font-bold py-3 rounded-2xl transition-all duration-200 active:scale-98 shadow-md text-base"
              >
                Berechnen
              </button>
            </form>

            {/* Results */}
            {result && (
                <div className="space-y-5 w-full pb-6">
                  <div className="bg-rose-bg border border-[#FFCAD4] p-5 rounded-3xl text-center shadow-sm w-full">
                    <span className="text-base font-bold uppercase tracking-wider text-purple-dark">Aktueller Stand</span>
                    <h2 className="text-2xl sm:text-4xl font-black text-rose-soft my-1">
                      SSW {result.weeks} + {result.days}
                    </h2>
                    <p className="text-base text-[#6C757D] font-medium">
                      {result.weeks >= 40
                          ? 'Der Geburtstermin ist erreicht oder überschritten.'
                          : `Du bist in der ${result.weeks + 1}. Schwangerschaftswoche.`}
                    </p>
                    <div className="border-t border-[#FFCAD4]/60 my-3" />
                    <p className="text-base font-medium text-text-main">
                      Entbindungstermin: <span className="font-bold text-[#2B2D42]">{result.dueDate}</span>
                    </p>
                  </div>

                  {/* Timeline */}
                  <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-border-light w-full">
                    <h3 className="text-base sm:text-lg font-bold text-text-main mb-4">Entwicklungs-Zeitleiste</h3>
                    <div className="relative pl-5 space-y-5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E9ECEF]">
                      {STAGES.map((stage, idx) => {
                        const currentWeek = result.weeks + 1;
                        const isActive = currentWeek >= stage.weekMin && currentWeek <= stage.weekMax;
                        const isPassed = currentWeek > stage.weekMax;

                        return (
                            <div key={idx} className="relative">
                              {/* Dot */}
                              <div
                                  className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 transition-all ${
                                      isActive
                                          ? 'bg-rose-soft border-white ring-4 ring-[#FFCAD4]'
                                          : isPassed
                                              ? 'bg-purple-soft border-purple-soft'
                                              : 'bg-white border-[#CED4DA]'
                                  }`}
                              />
                              {/* Card Content */}
                              <div
                                  className={`p-3 sm:p-4 rounded-2xl border transition-all ${
                                      isActive
                                          ? 'bg-rose-bg/60 border-rose-soft shadow-sm'
                                          : 'bg-white border-[#F8F9FA]'
                                  }`}
                              >
                          <span className={`inline-block text-base font-bold px-2.5 py-0.5 rounded-full mb-1 ${stage.badgeBg} ${stage.badgeText}`}>
                            SSW {stage.weekMin} - {stage.weekMax}
                          </span>
                                <h4 className="text-base font-bold text-text-main">{stage.label}</h4>
                                <p className="text-base text-[#6C757D] mt-1 leading-relaxed">{stage.desc}</p>
                              </div>
                            </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
            )}
          </div>

          {/* Footer */}
          <footer className="w-full py-2 border-t border-border-light text-center text-base text-text-sub">
            <p>
              Ein Projekt von{' '}
              <a
                  href="https://github.com/trstnjmn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-purple-strong hover:text-purple-dark transition-colors"
              >
                @trstnjmn
              </a>
            </p>
          </footer>

        </div>
      </main>
  );
}