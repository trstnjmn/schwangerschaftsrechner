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

interface WeekDetail {
  weekNumber: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

interface MilestoneDates {
  start: string;
  end: string;
}

interface CheckupDate {
  week: number;
  date: string;
  isCurrent: boolean;
}

interface CalculationResult {
  weeks: number;
  days: number;
  dueDate: string;
  lmpDate: string;
  weeklyOverview: WeekDetail[];
  us1: MilestoneDates;
  us2: MilestoneDates;
  ogtt: MilestoneDates;
  us3: MilestoneDates;
  checkups: CheckupDate[];
}

const STAGES: Stage[] = [
  { weekMin: 1, weekMax: 4, label: 'Einnistung & HCG-Anstieg', desc: 'Befruchtung und Einnistung der Eizelle in der Gebärmutter. Die Produktion des Schwangerschaftshormons HCG startet.', badgeBg: 'bg-[#FDE2E4]', badgeText: 'text-[#9E2A2B]' },
  { weekMin: 5, weekMax: 8, label: 'Herzschlag & Organentwicklung', desc: 'Das Herz beginnt zu schlagen (~SSW 6). Grundsteine für Gehirn, Rückenmark und erste Extremitäten werden gelegt.', badgeBg: 'bg-[#FFCAD4]', badgeText: 'text-[#85182A]' },
  { weekMin: 9, weekMax: 12, label: 'Fötalphase & Gesichtsmerkmale', desc: 'Finger und Zehen trennen sich, Gesichtszüge formen sich. Der Embryo wird offiziell zum Fötus; die kritische Frühphase endet.', badgeBg: 'bg-[#E2ECE9]', badgeText: 'text-[#2D6A4F]' },
  { weekMin: 13, weekMax: 16, label: '2. Trimester & Geschlechtsreife', desc: 'Das Schilddrüsen- und Hormonsystem arbeitet. Äußere Geschlechtsorgane prägen sich aus, das Baby schluckt Fruchtwasser.', badgeBg: 'bg-[#D8E2DC]', badgeText: 'text-[#1B4332]' },
  { weekMin: 17, weekMax: 20, label: 'Kindsbewegungen & Gehör', desc: 'Zarte Tritte („Fluttern“) werden spürbar. Das Gehör bildet sich vollständig aus – das Baby nimmt Stimmen wahr.', badgeBg: 'bg-[#E8E8E4]', badgeText: 'text-[#3D405B]' },
  { weekMin: 21, weekMax: 24, label: 'Grenze der Überlebensfähigkeit', desc: 'Schlaf- und Wachphasen wechseln sich ab. Ab SSW 24 gilt das Baby bei einer Frühgeburt als medizinisch überlebensfähig.', badgeBg: 'bg-[#F4ACB7]', badgeText: 'text-[#590D22]' },
  { weekMin: 25, weekMax: 28, label: '3. Trimester & Augen öffnen', desc: 'Das Baby öffnet erstmals die Augen und unterscheidet Hell/Dunkel. Wichtige Fettpolster zur Wärmeregulierung entstehen.', badgeBg: 'bg-[#FFE5EC]', badgeText: 'text-[#9E2A2B]' },
  { weekMin: 29, weekMax: 32, label: 'Lungenreifung & Schmerzempfinden', desc: 'Das Gehirn wächst rasant und Schmerzrezeptoren sind aktiv. Das Baby dreht sich langsam in die Kopflage nach unten.', badgeBg: 'bg-[#F0E6DF]', badgeText: 'text-[#6B705C]' },
  { weekMin: 33, weekMax: 36, label: 'Endspurt & Immunsystem', desc: 'Das Baby lagert Antikörper der Mutter ein. Die Lungenreife schließt ab und der Platz in der Gebärmutter wird eng.', badgeBg: 'bg-[#D8E2DC]', badgeText: 'text-[#2D6A4F]' },
  { weekMin: 37, weekMax: 40, label: 'Geburtsreife (Termingeburt)', desc: 'Ab SSW 37 gilt das Baby nicht mehr als Frühgeburt. Alle Organe sind bereit für das Leben außerhalb des Bauchraums.', badgeBg: 'bg-[#FFCAD4]', badgeText: 'text-[#85182A]' },
];

export default function Home() {
  const [mode, setMode] = useState<'period' | 'dueDate'>('period');
  const [dateInput, setDateInput] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showAllWeeks, setShowAllWeeks] = useState<boolean>(false);
  const [showTimelineMobile, setShowTimelineMobile] = useState<boolean>(false);

  const formatDate = (baseDate: Date, addDaysCount: number): string => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + addDaysCount);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const calculate = (inputVal: string, currentMode: 'period' | 'dueDate') => {
    if (!inputVal) return;

    const inputDate = new Date(inputVal);
    if (isNaN(inputDate.getTime())) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let lmpDate: Date;
    let dueDate: Date;

    if (currentMode === 'period') {
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
      setResult(null);
      return;
    }

    const currentWeeks = Math.floor(diffDays / 7);
    const currentDays = diffDays % 7;

    // 40 Wochen Übersicht
    const weeklyOverview: WeekDetail[] = Array.from({ length: 40 }, (_, i) => {
      const weekNum = i + 1;
      const start = new Date(lmpDate);
      start.setDate(start.getDate() + (weekNum - 1) * 7);

      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      return {
        weekNumber: weekNum,
        startDate: start.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        endDate: end.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        isCurrent: weekNum === currentWeeks + 1,
      };
    });

    // Med. Screenings
    const us1 = { start: formatDate(lmpDate, 56), end: formatDate(lmpDate, 83) }; // 8+0 bis 11+6
    const us2 = { start: formatDate(lmpDate, 126), end: formatDate(lmpDate, 153) }; // 18+0 bis 21+6
    const ogtt = { start: formatDate(lmpDate, 168), end: formatDate(lmpDate, 196) }; // 24+0 bis 28+0
    const us3 = { start: formatDate(lmpDate, 196), end: formatDate(lmpDate, 223) }; // 28+0 bis 31+6

    // Vorsorge alle 2 Wochen ab SSW 28 bis SSW 40 (ET)
    const checkupWeeks = [28, 30, 32, 34, 36, 38, 40];
    const checkups: CheckupDate[] = checkupWeeks.map((w) => ({
      week: w,
      date: formatDate(lmpDate, (w - 1) * 7),
      isCurrent: (currentWeeks + 1) >= w && (currentWeeks + 1) < w + 2,
    }));

    setResult({
      weeks: currentWeeks,
      days: currentDays,
      dueDate: dueDate.toLocaleDateString('de-DE'),
      lmpDate: lmpDate.toLocaleDateString('de-DE'),
      weeklyOverview,
      us1,
      us2,
      ogtt,
      us3,
      checkups,
    });
  };

  const handleModeChange = (newMode: 'period' | 'dueDate') => {
    setMode(newMode);
    if (dateInput) {
      calculate(dateInput, newMode);
    }
  };

  return (
      <main className="min-h-screen bg-cream py-6 px-3 sm:px-6 flex flex-col items-center overflow-x-hidden w-full">
        <div className="w-full max-w-md lg:max-w-6xl flex flex-col min-h-[calc(100vh-3rem)]">

          {/* Content Wrapper */}
          <div className="space-y-6 flex-1">
            {/* Header */}
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-3xl font-bold text-text-main">Schwangerschaftsrechner</h1>
              <p className="text-base text-text-sub">Berechne deine SSW, Untersuchungstermine & Fristen</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-[#E9ECEF] p-1 rounded-2xl w-full max-w-md mx-auto">
              <button
                  type="button"
                  className={`flex-1 py-2 text-base font-semibold rounded-xl transition-all duration-200 active:scale-95 ${
                      mode === 'period'
                          ? 'bg-white text-purple-dark shadow-sm'
                          : 'text-text-sub hover:text-text-main'
                  }`}
                  onClick={() => handleModeChange('period')}
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
                  onClick={() => handleModeChange('dueDate')}
              >
                Entbindungstermin
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => { e.preventDefault(); calculate(dateInput, mode); }} className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-border-light space-y-4 w-full max-w-md mx-auto">
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
                  onBlur={(e) => calculate(e.target.value, mode)}
                  className="w-full max-w-full p-3 text-base border border-mint rounded-2xl focus:ring-2 focus:ring-rose-soft focus:border-transparent outline-none text-text-main bg-cream/50 box-border"
              />
              <button
                  type="submit"
                  className="w-full bg-purple-strong hover:bg-[#6A23A6] text-white font-bold py-3 rounded-2xl transition-all duration-200 active:scale-98 shadow-md text-base"
              >
                Berechnen
              </button>
            </form>

            {/* Results Grid */}
            {result && (
                <div className="space-y-6 w-full pb-6">

                  {/* Top Banner Status */}
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
                      Errechneter Entbindungstermin (ET): <span className="font-bold text-[#2B2D42]">{result.dueDate}</span>
                    </p>
                  </div>

                  {/* Main Content Layout: Screenings + Calendar Left, Embryo Right */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left Column (Ultraschall, Termine & SSW Kalender) */}
                    <div className="lg:col-span-6 space-y-6">

                      {/* Wichtige Ultraschall- & Testtermine */}
                      <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-border-light w-full">
                        <h3 className="text-base sm:text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                          <span>🩺</span> Wichtige Medizinische Termine
                        </h3>
                        <div className="space-y-3">
                          <div className="p-3.5 rounded-2xl bg-cream/60 border border-mint flex justify-between items-center text-base">
                            <div>
                              <div className="font-bold text-text-main">1. US (Ultraschall)</div>
                              <div className="text-xs text-text-sub">SSW 8+0 – 11+6</div>
                            </div>
                            <div className="font-bold text-purple-strong">{result.us1.start} – {result.us1.end}</div>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-cream/60 border border-mint flex justify-between items-center text-base">
                            <div>
                              <div className="font-bold text-text-main">2. US (Fein-US / Organe)</div>
                              <div className="text-xs text-text-sub">SSW 18+0 – 21+6</div>
                            </div>
                            <div className="font-bold text-purple-strong">{result.us2.start} – {result.us2.end}</div>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-cream/60 border border-mint flex justify-between items-center text-base">
                            <div>
                              <div className="font-bold text-text-main">OGTT (Zuckertest)</div>
                              <div className="text-xs text-text-sub">SSW 24+0 – 28+0</div>
                            </div>
                            <div className="font-bold text-purple-strong">{result.ogtt.start} – {result.ogtt.end}</div>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-cream/60 border border-mint flex justify-between items-center text-base">
                            <div>
                              <div className="font-bold text-text-main">3. US (Ultraschall)</div>
                              <div className="text-xs text-text-sub">SSW 28+0 – 31+6</div>
                            </div>
                            <div className="font-bold text-purple-strong">{result.us3.start} – {result.us3.end}</div>
                          </div>
                        </div>

                        {/* 2-Wochen-Rhythmus ab SSW 28 */}
                        <div className="mt-5 pt-4 border-t border-border-light">
                          <h4 className="font-bold text-text-main text-base mb-2">
                            📅 Vorsorge-Kontrollen (Alle 2 Wochen ab SSW 28)
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {result.checkups.map((item) => (
                                <div
                                    key={item.week}
                                    className={`p-2.5 rounded-xl border text-sm flex justify-between items-center ${
                                        item.isCurrent
                                            ? 'bg-rose-bg border-rose-soft font-bold'
                                            : 'bg-white border-[#F8F9FA] text-[#6C757D]'
                                    }`}
                                >
                                  <span>{item.week === 40 ? 'SSW 40+0 (ET)' : `SSW ${item.week}+0`}</span>
                                  <span className="font-semibold text-text-main">{item.date}</span>
                                </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* SSW Kalenderübersicht (Kein Scroll-Container auf Mobile) */}
                      <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-border-light w-full">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-base sm:text-lg font-bold text-text-main">SSW Kalenderübersicht</h3>
                          <button
                              type="button"
                              onClick={() => setShowAllWeeks(!showAllWeeks)}
                              className="text-base font-bold text-purple-strong hover:text-purple-dark underline"
                          >
                            {showAllWeeks ? 'Aktueller Zeitraum' : 'Alle 40 SSW'}
                          </button>
                        </div>

                        {/* Auf Mobile normales Fließen ohne Container-Scrollbar */}
                        <div className="space-y-2 lg:max-h-[32rem] lg:overflow-y-auto lg:pr-1">
                          {(showAllWeeks
                                  ? result.weeklyOverview
                                  : result.weeklyOverview.filter(w => w.isCurrent || Math.abs(w.weekNumber - (result.weeks + 1)) <= 2)
                          ).map((w) => (
                              <div
                                  key={w.weekNumber}
                                  className={`flex justify-between items-center p-3 rounded-2xl border text-base transition-all ${
                                      w.isCurrent
                                          ? 'bg-rose-bg border-rose-soft font-bold text-text-main shadow-sm'
                                          : 'bg-white border-[#F8F9FA] text-[#6C757D]'
                                  }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span>SSW {w.weekNumber}</span>
                                  {w.isCurrent && (
                                      <span className="bg-rose-soft text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                Aktuell
                              </span>
                                  )}
                                </div>
                                <span className="text-text-main font-medium">{w.startDate} – {w.endDate}</span>
                              </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Right Column (Embryo Entwicklung - Auf Desktop immer ausgeklappt & Nebeneinander) */}
                    <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-border-light w-full">

                      {/* Mobile Header Toggle */}
                      <div className="lg:hidden">
                        <button
                            type="button"
                            onClick={() => setShowTimelineMobile(!showTimelineMobile)}
                            className="w-full flex justify-between items-center text-left focus:outline-none"
                        >
                          <div>
                            <h3 className="text-base font-bold text-text-main">Status des Embryos & Entwicklung</h3>
                            <p className="text-xs text-text-sub mt-0.5">
                              {showTimelineMobile ? 'Tippen zum Einklappen' : 'Tippen zum Ausklappen'}
                            </p>
                          </div>
                          <span className="text-2xl font-bold text-purple-strong ml-2">
                        {showTimelineMobile ? '−' : '+'}
                      </span>
                        </button>
                      </div>

                      {/* Desktop Header */}
                      <div className="hidden lg:block mb-4 border-b border-border-light pb-3">
                        <h3 className="text-lg font-bold text-text-main">Entwicklungsverlauf</h3>
                        <p className="text-sm text-text-sub">Übersicht der wichtigsten Entwicklungen</p>
                      </div>

                      {/* Content Container (Mobile conditional / Desktop permanent) */}
                      <div className={`mt-4 lg:mt-0 ${showTimelineMobile ? 'block' : 'hidden lg:block'}`}>
                        <div className="space-y-4">
                          {STAGES.map((stage, idx) => {
                            const currentWeek = result.weeks + 1;
                            const isActive = currentWeek >= stage.weekMin && currentWeek <= stage.weekMax;

                            return (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-2xl border transition-all ${
                                        isActive
                                            ? 'bg-rose-bg/70 border-rose-soft shadow-sm ring-2 ring-rose-soft/30'
                                            : 'bg-white border-[#F8F9FA]'
                                    }`}
                                >
                                  {/* Nebeneinander-Layout für Zeitstrahl/Phase & Entwicklung */}
                                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-start">

                                    {/* Zeitstrahl/Badge Spalte */}
                                    <div className="sm:col-span-5 flex flex-col items-start gap-1">
                                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${stage.badgeBg} ${stage.badgeText}`}>
                                  SSW {stage.weekMin} – {stage.weekMax}
                                </span>
                                      <h4 className="text-base font-bold text-text-main leading-snug mt-1">{stage.label}</h4>
                                    </div>

                                    {/* Beschreibung Spalte */}
                                    <div className="sm:col-span-7">
                                      <p className="text-sm text-[#6C757D] leading-relaxed">{stage.desc}</p>
                                    </div>

                                  </div>
                                </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
            )}
          </div>

          {/* Footer */}
          <footer className="w-full py-6 mt-4 border-t border-border-light text-center text-base text-text-sub">
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