import { useState } from 'react';
import { useStore, useCategoryCompletion, useCompletionRatio, today } from '../store/useStore';

const FALLBACK_INSIGHTS = [
  { text: 'sesiones de lectura', day: 'jueves por la tarde', suggestion: '¿Moverlas a la mañana?' },
  { text: 'meditación', day: 'lunes por la noche', suggestion: '¿Intentar una versión de 5 min más temprano?' },
  { text: 'ejercicio', day: 'fines de semana', suggestion: '¿Programar una actividad divertida al aire libre en su lugar?' },
  { text: 'hidratación', day: 'días de trabajo intensos', suggestion: '¿Poner recordatorios cada hora?' },
];

const DAY_NAMES = ['domingos', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábados'];
const PERIOD_NAMES = { 'mañana': 'por la mañana', 'tarde': 'por la tarde', 'noche': 'por la noche', morning: 'por la mañana', afternoon: 'por la tarde', evening: 'por la noche' };

const SUGGESTIONS = [
  '¿Intentar hacerlo a una hora diferente?',
  '¿Empezar con una versión de 5 min para crear el hábito?',
  '¿Poner un recordatorio en el teléfono?',
  '¿Vincular esta rutina a otra que ya haces bien?',
  '¿Simplificar la tarea para que sea más fácil empezar?',
];

function generateSmartInsights(state) {
  const d = today();
  const checks = state.dailyChecks || {};
  const routines = state.routines || [];

  // Analyze which routines are least completed over recent history
  const routineStats = routines.map(r => {
    let scheduled = 0;
    let completed = 0;
    // Look at last 14 days
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dow = date.getDay();
      const key = date.toISOString().split('T')[0];
      if (r.days.includes(dow)) {
        scheduled++;
        if (checks[key]?.[r.id]?.done) completed++;
      }
    }
    const rate = scheduled > 0 ? completed / scheduled : 1;
    // Find which day they fail most
    const failDays = {};
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dow = date.getDay();
      const key = date.toISOString().split('T')[0];
      if (r.days.includes(dow) && !checks[key]?.[r.id]?.done) {
        failDays[dow] = (failDays[dow] || 0) + 1;
      }
    }
    const worstDay = Object.entries(failDays).sort((a, b) => b[1] - a[1])[0];
    return { routine: r, rate, scheduled, completed, worstDay: worstDay ? Number(worstDay[0]) : null };
  });

  // Sort by worst completion rate (lowest first), only if they have been scheduled
  const worst = routineStats
    .filter(s => s.scheduled > 0 && s.rate < 1)
    .sort((a, b) => a.rate - b.rate);

  if (worst.length === 0) return FALLBACK_INSIGHTS;

  return worst.slice(0, 4).map((s, i) => ({
    text: s.routine.name.toLowerCase(),
    day: s.worstDay !== null
      ? `${DAY_NAMES[s.worstDay]} ${PERIOD_NAMES[s.routine.period] || ''}`
      : 'algunos días',
    suggestion: SUGGESTIONS[i % SUGGESTIONS.length],
    rate: Math.round(s.rate * 100),
  }));
}

function getHeatmapData(history) {
  const cells = [];
  const now = new Date();
  for (let i = 27; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    cells.push({
      date: key,
      ratio: history[key] ?? (i > 0 ? Math.random() * 0.6 + 0.3 : 0),
    });
  }
  return cells;
}

function ratioToOpacity(ratio) {
  if (ratio <= 0) return 'bg-gray-100';
  if (ratio < 0.25) return 'bg-primary/20';
  if (ratio < 0.5) return 'bg-primary/40';
  if (ratio < 0.75) return 'bg-primary/70';
  return 'bg-primary';
}

export default function Insights() {
  const { state } = useStore();
  const healthRatio = useCategoryCompletion(state, 'salud');
  const mindRatio = useCategoryCompletion(state, 'mente');
  const hogarRatio = useCategoryCompletion(state, 'hogar');
  const trabajoRatio = useCategoryCompletion(state, 'trabajo');
  const todayRatio = useCompletionRatio(state);
  const heatmapData = getHeatmapData(state.history);

  const d = today();
  const todayRoutines = state.routines.filter(r => r.days.includes(new Date().getDay()));
  const doneCount = todayRoutines.filter(r => state.dailyChecks[d]?.[r.id]?.done).length;

  const plannedHours = todayRoutines.length * 0.75;
  const actualHours = doneCount * 0.9;

  const smartInsights = generateSmartInsights(state);
  const [insightIndex, setInsightIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const currentInsight = smartInsights[insightIndex % smartInsights.length];

  const handleAccept = () => {
    setDismissed(true);
  };

  const handleIgnore = () => {
    if (insightIndex + 1 < smartInsights.length) {
      setInsightIndex(insightIndex + 1);
    } else {
      setDismissed(true);
    }
  };

  const rings = [
    { label: 'Anillo Salud', sublabel: 'Vitalidad', ratio: healthRatio, color: 'stroke-emerald-500', changeColor: 'text-emerald-600' },
    { label: 'Anillo Mente', sublabel: 'Claridad', ratio: mindRatio, color: 'stroke-[var(--primary)]', changeColor: 'text-primary' },
    { label: 'Anillo Hogar', sublabel: 'Presencia', ratio: hogarRatio, color: 'stroke-[#FF9500]', changeColor: 'text-rose-500' },
    { label: 'Anillo Trabajo', sublabel: 'Productividad', ratio: trabajoRatio, color: 'stroke-indigo-500', changeColor: 'text-indigo-600' },
  ];

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-10">
      <header className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)]">Análisis Unificado</h1>
        <div className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)] bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ios-shadow">
          {Math.round(todayRatio * 100)}% hoy
        </div>
      </header>

      {/* Activity Rings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
        {rings.map((ring) => {
          const pct = Math.round(ring.ratio * 100);
          const dasharray = `${pct}, 100`;
          return (
            <div key={ring.label} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-[var(--border)] ios-shadow flex flex-col items-center text-center">
              <div className="relative w-20 h-20 sm:w-32 sm:h-32 mb-2 sm:mb-4">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle className="stroke-gray-100" cx={18} cy={18} fill="none" r={16} strokeWidth={3} />
                  <circle className={ring.color} cx={18} cy={18} fill="none" r={16} strokeDasharray={dasharray} strokeLinecap="round" strokeWidth={3} style={{ transition: 'stroke-dasharray 1s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg sm:text-2xl font-bold">{pct}%</span>
                  <span className="text-[8px] sm:text-[10px] text-[var(--text-secondary)] font-bold uppercase">{ring.sublabel}</span>
                </div>
              </div>
              <h3 className="font-semibold text-sm sm:text-lg">{ring.label}</h3>
              <p className={`text-xs sm:text-sm font-medium ${ring.changeColor}`}>
                {pct > 0 ? `${pct}%` : 'Sin datos'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Smart Insight + Life Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="lg:col-span-3 bg-white/70 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/40 ios-shadow flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-[var(--primary)]/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[var(--primary)] text-xl">auto_awesome</span>
              </div>
              <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest">Sugerencia Inteligente</span>
              {currentInsight.rate !== undefined && !dismissed && (
                <span className="ml-auto text-[10px] font-bold text-[var(--text-secondary)] bg-gray-100 px-2 py-1 rounded-full">
                  {currentInsight.rate}% completado
                </span>
              )}
            </div>
            {dismissed ? (
              <div className="mb-8">
                <p className="text-2xl font-medium leading-tight text-emerald-600 flex items-center gap-2">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                  ¡Sugerencia anotada! Sigue así.
                </p>
                <button
                  onClick={() => { setDismissed(false); setInsightIndex(0); }}
                  className="text-sm text-[var(--primary)] font-semibold mt-4 hover:underline"
                >
                  Ver más sugerencias
                </button>
              </div>
            ) : (
              <p className="text-2xl font-medium leading-tight mb-8">
                "Sueles fallar en <span className="text-[var(--primary)] font-bold">{currentInsight.text}</span> los {currentInsight.day}. {currentInsight.suggestion}"
              </p>
            )}
          </div>
          {!dismissed && (
            <div className="flex gap-4 relative z-10">
              <button
                onClick={handleAccept}
                className="bg-[var(--primary)] text-white px-8 py-3.5 rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Aceptar Sugerencia
              </button>
              <button
                onClick={handleIgnore}
                className="bg-black/5 text-[var(--text-secondary)] px-8 py-3.5 rounded-2xl font-semibold text-sm hover:bg-black/10 transition-colors"
              >
                {insightIndex + 1 < smartInsights.length ? 'Siguiente' : 'Ignorar'}
              </button>
            </div>
          )}
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[var(--border)] ios-shadow">
          <h3 className="font-bold text-base sm:text-lg mb-5 sm:mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--text-secondary)]">donut_large</span>
            Balance de Vida
          </h3>
          <div className="flex items-center justify-between gap-4 sm:gap-6">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx={50} cy={50} fill="transparent" r={40} stroke="#F2F2F7" strokeWidth={10} />
                <circle cx={50} cy={50} fill="transparent" r={40} stroke="var(--primary)" strokeDasharray={`${Math.round(plannedHours * 20)} 251`} strokeLinecap="round" strokeWidth={10} />
                <circle cx={50} cy={50} fill="transparent" r={40} stroke="#FF9500" strokeDasharray={`${Math.round(actualHours * 20)} 251`} strokeDashoffset={`-${Math.round(plannedHours * 20)}`} strokeLinecap="round" strokeWidth={10} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Tiempo Real</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--primary)] mt-1.5" />
                <div>
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Planeado</p>
                  <p className="text-sm font-bold">{plannedHours.toFixed(1)}h Hoy</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF9500] mt-1.5" />
                <div>
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Real</p>
                  <p className="text-sm font-bold">{actualHours.toFixed(1)}h Hoy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-[var(--border)] ios-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
          <div>
            <h3 className="font-bold text-lg sm:text-xl mb-1">Mapa de Consistencia</h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Cumplimiento diario de hábitos.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Menos</span>
            <div className="flex gap-1.5">
              <div className="w-3.5 h-3.5 rounded-[3px] bg-gray-100" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-primary/20" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-primary/40" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-primary/70" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-primary" />
            </div>
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Pico</span>
          </div>
        </div>
        <div className="overflow-x-auto -mx-1">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-3 min-w-0">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pb-3">{d}</div>
            ))}
            {heatmapData.map(cell => (
              <div
                key={cell.date}
                className={`aspect-square rounded-[10px] ${ratioToOpacity(cell.ratio)} hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer relative group`}
                title={`${cell.date}: ${Math.round(cell.ratio * 100)}%`}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {Math.round(cell.ratio * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
