import { useStore, useCategoryCompletion, useCompletionRatio, today } from '../store/useStore';
import { ProfileAvatar } from '../components/Layout';

const DAY_NAMES = ['domingos', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábados'];

const toKey = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function getDayRatio(state, dateStr) {
  // 1. Usar historial guardado si existe
  const hist = state.history?.[dateStr];
  if (hist) {
    // Si es el formato nuevo { ratio, mode }
    if (typeof hist === 'object') return hist;
    // Retrocompatibilidad si era un número directo
    return { ratio: hist, mode: 'normal' };
  }

  // 2. Si es HOY, calcular al vuelo respetando el modo actual
  if (dateStr === today()) {
    const dow = new Date().getDay();
    const routines = state.routines.filter(r => r.days.includes(dow));
    const visible = state.emergencyMode
      ? routines.filter(r => r.essential)
      : state.energeticMode
        ? routines
        : routines.filter(r => !r.energetic);

    if (visible.length === 0) return { ratio: 0, mode: 'normal' };
    const done = visible.filter(r => state.dailyChecks[dateStr]?.[r.id]?.done).length;
    return {
      ratio: done / visible.length,
      mode: state.emergencyMode ? 'emergencia' : state.energeticMode ? 'enérgico' : 'normal'
    };
  }

  // 3. Otros días pasados sin historial
  return { ratio: 0, mode: 'normal' };
}

function getHeatmapData(state) {
  const cells = [];
  const now = new Date();
  const currentDay = now.getDay();

  const daysToSunday = (7 - currentDay) % 7;
  const lastSunday = new Date(now);
  lastSunday.setDate(now.getDate() + daysToSunday);

  const startDate = new Date(lastSunday);
  startDate.setDate(lastSunday.getDate() - 27);

  for (let i = 0; i < 28; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const key = toKey(d);
    const data = getDayRatio(state, key);
    cells.push({
      date: key,
      label: d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', weekday: 'short' }),
      ratio: data.ratio,
      mode: data.mode
    });
  }
  return cells;
}

function ratioToOpacity(ratio) {
  if (ratio <= 0) return 'bg-gray-100';
  if (ratio < 0.25) return 'bg-blue-100';
  if (ratio < 0.5) return 'bg-blue-300';
  if (ratio < 0.75) return 'bg-blue-500';
  return 'bg-blue-600';
}

export default function Insights() {
  const { state } = useStore();
  const healthRatio = useCategoryCompletion(state, 'salud');
  const mindRatio = useCategoryCompletion(state, 'mente');
  const hogarRatio = useCategoryCompletion(state, 'hogar');
  const trabajoRatio = useCategoryCompletion(state, 'trabajo');
  const todayRatio = useCompletionRatio(state);
  const heatmapData = getHeatmapData(state);

  const d = today();
  const dow = new Date().getDay();
  const allRoutines = state.routines.filter(r => r.days.includes(dow));
  const visibleRoutines = state.emergencyMode
    ? allRoutines.filter(r => r.essential)
    : state.energeticMode
      ? allRoutines
      : allRoutines.filter(r => !r.energetic);

  const doneCount = visibleRoutines.filter(r => state.dailyChecks[d]?.[r.id]?.done).length;

  const rings = [
    { label: 'Salud', sublabel: 'Vitalidad', ratio: healthRatio, color: 'stroke-emerald-500', changeColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Mente', sublabel: 'Claridad', ratio: mindRatio, color: 'stroke-[var(--primary)]', changeColor: 'text-[var(--primary)]', bgColor: 'bg-blue-50' },
    { label: 'Hogar', sublabel: 'Presencia', ratio: hogarRatio, color: 'stroke-[#FF9500]', changeColor: 'text-[#FF9500]', bgColor: 'bg-orange-50' },
    { label: 'Trabajo', sublabel: 'Productividad', ratio: trabajoRatio, color: 'stroke-indigo-500', changeColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  ];

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-10">
      <header className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)]">Análisis Unificado</h1>
        <div className="flex items-center gap-3">
          <div className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)] bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ios-shadow">
            {Math.round(todayRatio * 100)}% hoy
          </div>
          <ProfileAvatar />
        </div>
      </header>

      {/* Activity Rings — Vertical Stack */}
      <div className="flex flex-col gap-3 mb-6 sm:mb-8">
        {rings.map((ring) => {
          const pct = Math.round(ring.ratio * 100);
          const dasharray = `${pct}, 100`;
          return (
            <div key={ring.label} className="bg-white rounded-2xl p-4 border border-[var(--border)] ios-shadow flex items-center gap-4">
              {/* Ring */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle className="stroke-[var(--border)]" cx={18} cy={18} fill="none" r={16} strokeWidth={3.5} />
                  <circle className={ring.color} cx={18} cy={18} fill="none" r={16} strokeDasharray={dasharray} strokeLinecap="round" strokeWidth={3.5} style={{ transition: 'stroke-dasharray 1s ease' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">{pct}%</span>
                </div>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-[var(--text-main)]">{ring.label}</h3>
                <p className="text-xs text-[var(--text-secondary)] uppercase font-bold tracking-wider">{ring.sublabel}</p>
              </div>
              {/* Status */}
              <div className="flex-shrink-0 text-right">
                <p className={`text-sm font-bold ${ring.changeColor}`}>
                  {pct > 0 ? `${pct}%` : 'Sin datos'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Balance de Vida */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[var(--border)] ios-shadow mb-6 sm:mb-8">
        <h3 className="font-bold text-base sm:text-lg mb-5 sm:mb-8 flex items-center gap-2">
          <span className="material-symbols-outlined text-[var(--text-secondary)]">donut_large</span>
          Balance de Vida
        </h3>
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx={50} cy={50} fill="transparent" r={40} stroke="var(--border)" strokeWidth={10} />
              {/* Círculo de progreso real: porcentaje de tareas hechas hoy */}
              <circle
                cx={50}
                cy={50}
                fill="transparent"
                r={40}
                stroke="var(--primary)"
                strokeWidth={10}
                strokeDasharray={`${Math.min(todayRatio * 251.3, 251.3)} 251.3`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Progreso</span>
              <span className="text-sm font-bold">{Math.round(todayRatio * 100)}%</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-200 mt-1.5" />
              <div>
                <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Tareas de hoy</p>
                <p className="text-sm font-bold">{visibleRoutines.length} Programadas</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--primary)] mt-1.5" />
              <div>
                <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Completadas</p>
                <p className="text-sm font-bold">{doneCount} de {visibleRoutines.length}</p>
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
        <div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pb-3">{d}</div>
            ))}
            {heatmapData.map(cell => (
              <div
                key={cell.date}
                className={`aspect-square rounded-[8px] sm:rounded-[10px] ${ratioToOpacity(cell.ratio)} hover:ring-2 ring-blue-300 ring-offset-1 transition-all cursor-pointer relative group flex items-center justify-center`}
              >
                <span className="text-[10px] font-bold text-black/30 mix-blend-color-burn pointer-events-none">
                  {parseInt(cell.date.split('-')[2], 10)}
                </span>
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2.5 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30 shadow-xl border border-white/10 text-center">
                  <div className="font-bold border-b border-white/10 pb-1 mb-1">{cell.label}</div>
                  <div><span className="text-gray-400">Progreso:</span> {Math.round(cell.ratio * 100)}%</div>
                  <div className="capitalize text-blue-300 font-medium">{cell.mode}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
