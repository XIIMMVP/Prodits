import { useStore, useCategoryCompletion, useCompletionRatio, today } from '../store/useStore';

const AI_INSIGHTS = [
  { text: 'reading sessions', day: 'Thursday afternoons', suggestion: 'Move it to the morning?' },
  { text: 'meditation', day: 'Monday evenings', suggestion: 'Try a 5-min version earlier in the day?' },
  { text: 'exercise', day: 'weekends', suggestion: 'Schedule a fun outdoor activity instead?' },
  { text: 'water intake', day: 'busy workdays', suggestion: 'Set hourly reminders?' },
];

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
  const healthRatio = useCategoryCompletion(state, 'health');
  const mindRatio = useCategoryCompletion(state, 'mind');
  const homeRatio = useCategoryCompletion(state, 'home');
  const todayRatio = useCompletionRatio(state);
  const heatmapData = getHeatmapData(state.history);

  const d = today();
  const todayRoutines = state.routines.filter(r => r.days.includes(new Date().getDay()));
  const doneCount = todayRoutines.filter(r => state.dailyChecks[d]?.[r.id]?.done).length;

  // Planned vs actual (simulated with real check data)
  const plannedHours = todayRoutines.length * 0.75;
  const actualHours = doneCount * 0.9;

  const randomInsight = AI_INSIGHTS[Math.floor(new Date().getDate() % AI_INSIGHTS.length)];

  const rings = [
    { label: 'Health Ring', sublabel: 'Vitality', ratio: healthRatio, color: 'stroke-emerald-500', changeColor: 'text-emerald-600' },
    { label: 'Mind Ring', sublabel: 'Clarity', ratio: mindRatio, color: 'stroke-[var(--primary)]', changeColor: 'text-primary' },
    { label: 'Home Ring', sublabel: 'Presence', ratio: useCategoryCompletion(state, 'home'), color: 'stroke-[#FF9500]', changeColor: 'text-rose-500' },
  ];

  return (
    <main className="w-full max-w-6xl mx-auto px-6 pt-8 pb-10">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">Unified Insights</h1>
        <div className="text-sm font-semibold text-[var(--text-secondary)] bg-white px-4 py-2 rounded-full ios-shadow">
          {Math.round(todayRatio * 100)}% today
        </div>
      </header>

      {/* Activity Rings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {rings.map((ring) => {
          const pct = Math.round(ring.ratio * 100);
          const dasharray = `${pct}, 100`;
          return (
            <div key={ring.label} className="bg-white rounded-3xl p-8 border border-[var(--border)] ios-shadow flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle className="stroke-gray-100" cx={18} cy={18} fill="none" r={16} strokeWidth={3} />
                  <circle className={ring.color} cx={18} cy={18} fill="none" r={16} strokeDasharray={dasharray} strokeLinecap="round" strokeWidth={3} style={{ transition: 'stroke-dasharray 1s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{pct}%</span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">{ring.sublabel}</span>
                </div>
              </div>
              <h3 className="font-semibold text-lg">{ring.label}</h3>
              <p className={`text-sm font-medium ${ring.changeColor}`}>
                {pct > 0 ? `${pct}% completed` : 'No data yet'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Smart Insight + Life Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3 bg-white/70 backdrop-blur-lg rounded-3xl p-8 border border-white/40 ios-shadow flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-[var(--primary)]/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[var(--primary)] text-xl">auto_awesome</span>
              </div>
              <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest">Smart Insight</span>
            </div>
            <p className="text-2xl font-medium leading-tight mb-8">
              "You usually miss <span className="text-[var(--primary)] font-bold">{randomInsight.text}</span> on {randomInsight.day}. {randomInsight.suggestion}"
            </p>
          </div>
          <div className="flex gap-4 relative z-10">
            <button className="bg-[var(--primary)] text-white px-8 py-3.5 rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity">
              Accept Suggestion
            </button>
            <button className="bg-black/5 text-[var(--text-secondary)] px-8 py-3.5 rounded-2xl font-semibold text-sm hover:bg-black/10 transition-colors">
              Dismiss
            </button>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-[var(--border)] ios-shadow">
          <h3 className="font-bold text-lg mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--text-secondary)]">donut_large</span>
            Life Balance
          </h3>
          <div className="flex items-center justify-between gap-6">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx={50} cy={50} fill="transparent" r={40} stroke="#F2F2F7" strokeWidth={10} />
                <circle cx={50} cy={50} fill="transparent" r={40} stroke="var(--primary)" strokeDasharray={`${Math.round(plannedHours * 20)} 251`} strokeLinecap="round" strokeWidth={10} />
                <circle cx={50} cy={50} fill="transparent" r={40} stroke="#FF9500" strokeDasharray={`${Math.round(actualHours * 20)} 251`} strokeDashoffset={`-${Math.round(plannedHours * 20)}`} strokeLinecap="round" strokeWidth={10} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Real Time</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--primary)] mt-1.5" />
                <div>
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Planned</p>
                  <p className="text-sm font-bold">{plannedHours.toFixed(1)}h Today</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF9500] mt-1.5" />
                <div>
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Actual</p>
                  <p className="text-sm font-bold">{actualHours.toFixed(1)}h Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-3xl p-8 border border-[var(--border)] ios-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="font-bold text-xl mb-1">Consistency Heatmap</h3>
            <p className="text-sm text-[var(--text-secondary)]">Daily habit completion across all categories.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Less</span>
            <div className="flex gap-1.5">
              <div className="w-3.5 h-3.5 rounded-[3px] bg-gray-100" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-primary/20" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-primary/40" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-primary/70" />
              <div className="w-3.5 h-3.5 rounded-[3px] bg-primary" />
            </div>
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Peak</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[500px]">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
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
