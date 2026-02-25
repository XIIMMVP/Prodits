import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore, useTodayRoutines, today } from '../store/useStore';
import { ProfileAvatar } from '../components/Layout';

const ENERGY_EMOJIS = [
  { emoji: '😫', label: 'Agotado', level: 1 },
  { emoji: '😐', label: 'Bajo', level: 2 },
  { emoji: '😊', label: 'Bien', level: 3 },
  { emoji: '⚡', label: 'Con Energía', level: 4 },
  { emoji: '🔥', label: 'Motivado', level: 5 },
];

const COLORS = new Proxy({}, {
  get: () => ({ bg: 'bg-blue-50 dark:bg-[var(--primary)]/10 text-[var(--primary)]', text: 'text-[var(--primary)]', border: 'border-blue-200 dark:border-[var(--primary)]/30' })
});

function formatDate() {
  const d = new Date();
  return d.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' });
}

// ─── Focus Timer Component ──────────────────────────────────
function FocusTimer({ routine, check, dispatch, onDelete }) {
  const [running, setRunning] = useState(false);
  const [total] = useState((routine.focusDuration || 25) * 60);
  const [remaining, setRemaining] = useState(total);
  const [endTime, setEndTime] = useState(null);
  const intervalRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`prodits_timer_${routine.id}`);
      if (saved && !check?.done) {
        const { savedEnd, savedRem } = JSON.parse(saved);
        if (savedEnd && savedEnd > Date.now()) {
          setEndTime(savedEnd);
          setRemaining(Math.ceil((savedEnd - Date.now()) / 1000));
          setRunning(true);
        } else if (savedRem) {
          setRemaining(Math.max(0, savedRem));
        } else if (savedEnd && savedEnd <= Date.now()) {
          setRemaining(0);
        }
      }
    } catch { /* ignore */ }
  }, [routine.id, check?.done]);

  // Timestamp based timer logic
  useEffect(() => {
    if (running && endTime) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const timeLeft = Math.max(0, Math.ceil((endTime - now) / 1000));
        setRemaining(timeLeft);

        if (timeLeft <= 0) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setEndTime(null);
          localStorage.removeItem(`prodits_timer_${routine.id}`);

          // Trigger notifications via Service Worker (required for PWA/iOS)
          if ('Notification' in window && Notification.permission === 'granted') {
            if (navigator.serviceWorker) {
              navigator.serviceWorker.ready.then(reg => {
                reg.showNotification('¡Tiempo Completo!', {
                  body: `Has terminado la rutina de: ${routine.name}`,
                  icon: '/icon-light-192.png',
                  vibrate: [200, 100, 200]
                });
              }).catch(() => {
                try {
                  new Notification('¡Tiempo Completo!', { body: `Has terminado la rutina de: ${routine.name}`, icon: '/icon-light-192.png' });
                } catch (e) { console.error('Notification API not supported in this context', e); }
              });
            } else {
              try {
                new Notification('¡Tiempo Completo!', { body: `Has terminado la rutina de: ${routine.name}`, icon: '/icon-light-192.png' });
              } catch (e) { console.error(e); }
            }
          }
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

          try {
            // Play a gentle notification chime
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(e => console.log('Audio autoplay blocked', e));
          } catch (e) { }

          if (!check?.done) {
            dispatch({ type: 'TOGGLE_TASK', routineId: routine.id });
          }
        }
      }, 500); // 500ms intervals for better resync
    }
    return () => clearInterval(intervalRef.current);
  }, [running, endTime, dispatch, routine.id, routine.name, check?.done]);

  const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
  const secs = (remaining % 60).toString().padStart(2, '0');
  const progress = 1 - remaining / total;
  const circumference = 2 * Math.PI * 68;
  const offset = circumference * (1 - progress);

  const toggleTimer = () => {
    if (check?.done) return;
    if (!running) {
      // Pedir permisos de notificación la primera vez
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
      const newEndTime = Date.now() + remaining * 1000;
      setEndTime(newEndTime);
      setRunning(true);
      localStorage.setItem(`prodits_timer_${routine.id}`, JSON.stringify({ savedEnd: newEndTime, savedRem: remaining }));
    } else {
      setRunning(false);
      setEndTime(null);
      localStorage.setItem(`prodits_timer_${routine.id}`, JSON.stringify({ savedEnd: null, savedRem: remaining }));
    }
  };

  const resetTimer = () => {
    setRunning(false);
    setEndTime(null);
    clearInterval(intervalRef.current);
    setRemaining(total);
    localStorage.removeItem(`prodits_timer_${routine.id}`);
    if (check?.done) {
      dispatch({ type: 'TOGGLE_TASK', routineId: routine.id });
    }
  };

  return (
    <div className={`bg-white rounded-[2rem] p-4 sm:p-6 ios-shadow flex flex-col items-center justify-center text-center ${routine.essential ? 'border-l-4 border-l-[var(--primary)]' : ''} ${routine.energetic ? 'border-l-4 border-l-amber-400' : ''}`}>
      <div className="w-full flex justify-between items-start mb-4">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1">
          <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider truncate">{routine.name}</span>
          {routine.essential && (
            <span className="text-[9px] sm:text-[10px] font-bold text-[var(--primary)] bg-blue-50 px-1.5 py-0.5 rounded-md uppercase tracking-wide whitespace-nowrap">Esencial</span>
          )}
          {routine.energetic && (
            <span className="text-[9px] sm:text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md uppercase tracking-wide whitespace-nowrap">Extra 🔥</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={resetTimer} className="text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors">
            <span className="material-symbols-outlined text-lg">restart_alt</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(routine); }}
            className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 hidden sm:flex"
            title="Eliminar rutina"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
      </div>
      <div className="relative w-36 h-36 flex items-center justify-center mb-4">
        <svg className="w-full h-full -rotate-90">
          <circle cx={72} cy={72} fill="none" r={68} stroke="var(--border)" strokeWidth={8} />
          <circle cx={72} cy={72} fill="none" r={68} stroke={check?.done ? '#10b981' : 'var(--text-secondary)'} strokeDasharray={circumference} strokeDashoffset={check?.done ? 0 : offset} strokeLinecap="round" strokeWidth={8} className="transition-all duration-500 opacity-50 block" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold tracking-tight ${check?.done ? 'text-emerald-500' : ''}`}>
            {check?.done ? '✓' : `${mins}:${secs}`}
          </span>
        </div>
      </div>
      <button
        onClick={toggleTimer}
        disabled={check?.done}
        className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${check?.done ? 'bg-emerald-500 text-white' :
          running ? 'bg-red-500 text-white hover:bg-red-600' :
            routine.energetic ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white hover:opacity-90 shadow-lg shadow-amber-200' :
              'bg-[var(--primary)] text-white hover:opacity-90'
          }`}
      >
        <span className="material-symbols-outlined fill-1">
          {check?.done ? 'check_circle' : running ? 'pause' : 'play_arrow'}
        </span>
        {check?.done ? '¡Completado!' : running ? 'Pausar' : 'Iniciar Sesión'}
      </button>
    </div>
  );
}

// ─── Counter Card ───────────────────────────────────────────
function CounterCard({ routine, check, dispatch, onDelete }) {
  const count = check?.count || 0;
  const target = routine.target || 8;
  const col = COLORS[routine.color] || COLORS.blue;

  return (
    <div className={`bg-white rounded-[1.5rem] p-4 sm:p-5 ios-shadow flex items-center justify-between gap-3 relative group ${check?.done ? 'ring-2 ring-emerald-200' : ''} ${routine.essential ? 'border-l-4 border-l-[var(--primary)]' : ''} ${routine.energetic ? 'border-l-4 border-l-amber-400' : ''}`}>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(routine); }}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ios-shadow z-10 hidden sm:flex hover:bg-red-100"
        title="Eliminar rutina"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
      </button>
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${col.bg} flex items-center justify-center ${col.text} flex-shrink-0`}>
          <span className="material-symbols-outlined fill-1 text-xl sm:text-2xl">{routine.icon}</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="font-bold text-sm sm:text-base truncate">{routine.name}</h4>
            {routine.essential && (
              <span className="text-[9px] sm:text-[10px] font-bold text-[var(--primary)] bg-blue-50 px-1.5 py-0.5 rounded-md uppercase tracking-wide whitespace-nowrap">Esencial</span>
            )}
            {routine.energetic && (
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md uppercase tracking-wide whitespace-nowrap">Extra 🔥</span>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)]">{count} de {target} {check?.done ? '✓' : ''}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl">
        <button
          onClick={() => dispatch({ type: 'INCREMENT_COUNTER', routineId: routine.id, delta: -1 })}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-all"
        >
          <span className="material-symbols-outlined text-sm">remove</span>
        </button>
        <span className="font-bold text-sm w-4 text-center">{count}</span>
        <button
          onClick={() => dispatch({ type: 'INCREMENT_COUNTER', routineId: routine.id, delta: 1 })}
          className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[var(--primary)]"
        >
          <span className="material-symbols-outlined text-sm font-bold">add</span>
        </button>
      </div>
    </div>
  );
}

// ─── Task Card ──────────────────────────────────────────────
function TaskCard({ routine, check, dispatch, onNote, onDelete }) {
  const isDone = check?.done || false;
  const col = COLORS[routine.color] || COLORS.blue;

  return (
    <div className={`bg-white rounded-[1.5rem] p-4 sm:p-5 ios-shadow flex items-start gap-3 sm:gap-4 transition-all relative group ${isDone ? 'opacity-60' : ''
      } ${routine.essential ? 'border-l-4 border-l-[var(--primary)]' : ''} ${routine.energetic ? 'border-l-4 border-l-amber-400' : ''}`}>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(routine); }}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ios-shadow z-10 hidden sm:flex hover:bg-red-100"
        title="Eliminar rutina"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
      </button>
      <button
        onClick={() => dispatch({ type: 'TOGGLE_TASK', routineId: routine.id })}
        className={`w-6 h-6 rounded-full border-2 mt-1 flex-shrink-0 flex items-center justify-center transition-all ${isDone ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-gray-400'
          }`}
      >
        {isDone && <span className="material-symbols-outlined text-white text-sm">check</span>}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1 flex-wrap">
          <h4 className={`font-bold text-base sm:text-lg ${isDone ? 'line-through text-gray-400' : ''}`}>{routine.name}</h4>
          {routine.essential && (
            <span className="text-[9px] sm:text-[10px] font-bold text-[var(--primary)] bg-black/[0.015] dark:bg-white/[0.03] px-2 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">Esencial</span>
          )}
          {routine.energetic && (
            <span className="text-[9px] sm:text-[10px] font-bold text-amber-600 dark:text-amber-500 bg-black/[0.015] dark:bg-white/[0.03] px-2 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">Extra 🔥</span>
          )}
        </div>
        <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">schedule</span>
          {routine.time}
        </p>
        {/* Subtasks */}
        {routine.subtasks?.length > 0 && (
          <div className="mt-3 space-y-2">
            {routine.subtasks.map(sub => {
              const subDone = check?.subtasks?.[sub.id] || false;
              return (
                <button
                  key={sub.id}
                  onClick={() => dispatch({ type: 'TOGGLE_SUBTASK', routineId: routine.id, subtaskId: sub.id })}
                  className={`flex items-center gap-2 text-sm w-full text-left ${subDone ? 'text-gray-400 line-through' : 'text-gray-600'}`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${subDone ? 'bg-emerald-400 border-emerald-400' : 'border-gray-300'
                    }`}>
                    {subDone && <span className="material-symbols-outlined text-white text-[10px]">check</span>}
                  </div>
                  {sub.text}
                </button>
              );
            })}
          </div>
        )}
        {/* Quick note */}
        {isDone && (
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={onNote}
              className="text-xs text-[var(--primary)] flex items-center gap-1 hover:underline"
            >
              <span className="material-symbols-outlined text-sm">edit_note</span>
              {check?.note ? 'Editar nota' : 'Añadir nota'}
            </button>
            {check?.note && <span className="text-xs text-[var(--text-secondary)] truncate max-w-[200px]">"{check.note}"</span>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Progress Circle ────────────────────────────────────────
function ProgressCircle({ current, total, size = 42, color = 'var(--primary)' }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2 - 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center bg-white rounded-full ios-shadow p-0.5" style={{ width: size + 4, height: size + 4 }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-black leading-none" style={{ color: current === total ? '#10b981' : 'inherit' }}>{current}</span>
        <div className="w-3 h-[0.5px] bg-gray-200 my-[2px]" />
        <span className="text-[8px] text-[var(--text-secondary)] font-bold leading-none">{total}</span>
      </div>
    </div>
  );
}

// ─── Note Modal ─────────────────────────────────────────────
function NoteModal({ routine, currentNote, onSave, onClose }) {
  const [note, setNote] = useState(currentNote || '');
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md ios-shadow" onClick={e => e.stopPropagation()}>
        <h3 className="font-bold text-lg mb-1">Nota Rápida</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">{routine.name}</p>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="¿Cómo te fue? Alguna reflexión..."
          className="w-full border border-[var(--border)] rounded-2xl p-4 text-sm resize-none h-32 focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all"
        />
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-gray-100 text-[var(--text-secondary)] font-semibold text-sm">Cancelar</button>
          <button onClick={() => { onSave(note); onClose(); }} className="flex-1 py-3 rounded-2xl bg-[var(--primary)] text-white font-semibold text-sm">Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-5xl text-[var(--primary)]">auto_awesome</span>
      </div>
      <h3 className="text-xl font-bold mb-2">No hay tareas para hoy</h3>
      <p className="text-[var(--text-secondary)] max-w-sm mb-6">Ve a la pestaña de Rutinas para crear tu primer hábito y empezar a construir tu mejor versión.</p>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────
export default function Dashboard() {
  const { state, dispatch } = useStore();
  const todayRoutines = useTodayRoutines(state);
  const d = today();
  const energyLevel = state.energy[d] || 0;
  const emergency = state.emergencyMode;
  const energetic = state.energeticMode;
  const [noteModal, setNoteModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [collapsedDone, setCollapsedDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem('collapsedDone') || '{}'); } catch { return {}; }
  });
  useEffect(() => { localStorage.setItem('collapsedDone', JSON.stringify(collapsedDone)); }, [collapsedDone]);

  // Filter based on active mode
  const visibleRoutines = emergency
    ? todayRoutines.filter(r => r.essential)
    : energetic
      ? todayRoutines  // Energetic mode: show ALL including extras
      : todayRoutines.filter(r => !r.energetic);  // Normal: hide energetic-only extras

  // Group by period (with backward compat for old English keys in localStorage)
  const periodNormalize = { morning: 'mañana', afternoon: 'tarde', evening: 'noche', 'mañana': 'mañana', 'tarde': 'tarde', 'noche': 'noche' };
  const grouped = { 'mañana': [], 'tarde': [], 'noche': [] };
  visibleRoutines.forEach(r => {
    const period = periodNormalize[r.period] || 'mañana';
    grouped[period].push(r);
  });

  // Completion
  const totalDone = visibleRoutines.filter(r => state.dailyChecks[d]?.[r.id]?.done).length;
  const totalCount = visibleRoutines.length;

  const periodLabels = { 'mañana': 'Mañana', 'tarde': 'Tarde', 'noche': 'Noche' };
  const periodDots = {
    'mañana': 'bg-[var(--primary)]',
    'tarde': 'bg-orange-400',
    'noche': 'bg-purple-400'
  };

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-10">
      {/* Header */}
      <header className="flex flex-col gap-4 mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-[var(--text-secondary)] mb-1">{formatDate()}</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-main)]">Hoy</h1>
          </div>
          <div className="flex items-center gap-3">
            {totalCount > 0 && (
              <ProgressCircle current={totalDone} total={totalCount} size={42} />
            )}
            <ProfileAvatar />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_EMERGENCY' })}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full ios-shadow border transition-all flex-1 sm:flex-none justify-center ${emergency ? 'bg-blue-500 text-white border-blue-400' : 'bg-white text-[var(--text-secondary)] border-gray-100'
              }`}
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Emergencia</span>
            <div className={`w-8 sm:w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${emergency ? 'bg-blue-300' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${emergency ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_ENERGETIC' })}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full ios-shadow border transition-all flex-1 sm:flex-none justify-center ${energetic ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400' : 'bg-white text-[var(--text-secondary)] border-gray-100'
              }`}
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Enérgico</span>
            <div className={`w-8 sm:w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${energetic ? 'bg-amber-300' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${energetic ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>
        </div>
      </header>

      <section className="mb-6 sm:mb-8">
        <div className="bg-white rounded-[2rem] p-5 sm:p-8 ios-shadow border border-gray-50/50">
          <h2 className="text-center text-[var(--text-secondary)] text-xs sm:text-sm font-medium mb-4 sm:mb-6">¿Cómo está tu nivel de energía?</h2>
          <div className="flex justify-between items-center max-w-xs sm:max-w-sm mx-auto">
            {ENERGY_EMOJIS.map((e) => (
              <button
                key={e.level}
                onClick={() => {
                  dispatch({ type: 'SET_ENERGY', level: e.level });
                  if (e.level === 1) {
                    dispatch({ type: 'SET_EMERGENCY_MODE', value: true });
                  } else if (e.level === 5) {
                    dispatch({ type: 'SET_ENERGETIC_MODE', value: true });
                  } else {
                    if (emergency) dispatch({ type: 'SET_EMERGENCY_MODE', value: false });
                    if (energetic) dispatch({ type: 'SET_ENERGETIC_MODE', value: false });
                  }
                }}
                className={`flex items-center justify-center rounded-2xl transition-all duration-300 ${energyLevel === e.level
                  ? e.level <= 2
                    ? 'w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 text-2xl sm:text-3xl scale-110'
                    : e.level >= 4
                      ? 'w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 to-orange-500 text-2xl sm:text-3xl scale-110'
                      : 'w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 dark:bg-white/10 text-2xl sm:text-3xl scale-110'
                  : 'w-10 h-10 sm:w-12 sm:h-12 hover:bg-gray-50 dark:hover:bg-white/5 text-xl sm:text-2xl hover:scale-105'
                  }`}
              >
                {e.emoji}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      {emergency && (
        <div className="mb-6 bg-blue-50 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-blue-500 fill-1">priority_high</span>
          <div>
            <p className="font-bold text-sm text-blue-700">Modo Emergencia Activo</p>
            <p className="text-xs text-blue-500">Solo se muestran tareas esenciales. Enfócate en lo importante.</p>
          </div>
        </div>
      )}

      {/* Energetic Mode Banner */}
      {energetic && (
        <div className="mb-6 bg-amber-50 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-500 fill-1">bolt</span>
          <div>
            <p className="font-bold text-sm text-amber-700">🔥 Modo Enérgico Activo</p>
            <p className="text-xs text-amber-600">¡Máxima productividad! Todas las tareas visibles. Aprovecha tu energía al máximo.</p>
          </div>
        </div>
      )}

      {/* Low energy banner */}
      {energyLevel === 2 && !emergency && (
        <div className="mb-6 bg-blue-50 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-blue-500">info</span>
          <div className="flex-1">
            <p className="font-bold text-sm text-blue-700">Energía baja detectada</p>
            <p className="text-xs text-blue-500">Considera activar el Modo Emergencia para enfocarte solo en lo esencial.</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_EMERGENCY_MODE', value: true })}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors whitespace-nowrap ios-shadow"
          >
            Activar
          </button>
        </div>
      )}

      {/* High energy suggestion banner */}
      {energyLevel === 4 && !energetic && (
        <div className="mb-6 bg-amber-50 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-500">bolt</span>
          <div className="flex-1">
            <p className="font-bold text-sm text-amber-700">¡Buena energía detectada!</p>
            <p className="text-xs text-amber-600">Activa el Modo Enérgico para aprovechar al máximo tu productividad.</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_ENERGETIC_MODE', value: true })}
            className="px-6 py-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Activar
          </button>
        </div>
      )}

      {/* Timeline */}
      {visibleRoutines.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([period, routines]) => {
            if (routines.length === 0) return null;
            const doneCount = routines.filter(r => state.dailyChecks[d]?.[r.id]?.done).length;
            const isCollapsed = collapsedDone[period] || false;
            const toggleCollapse = () => setCollapsedDone(prev => ({ ...prev, [period]: !prev[period] }));
            const visibleForPeriod = isCollapsed
              ? routines.filter(r => !state.dailyChecks[d]?.[r.id]?.done)
              : routines;
            return (
              <section key={period}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-2 h-2 rounded-full ${periodDots[period]}`} />
                  <h3 className="text-xl font-bold text-[var(--text-main)]">{periodLabels[period]}</h3>
                  <div className="ml-auto flex items-center gap-3">
                    <span className="text-xs text-[var(--text-secondary)] font-semibold">
                      {doneCount}/{routines.length}
                    </span>
                    {doneCount > 0 && (
                      <button
                        onClick={toggleCollapse}
                        className="flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)] bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-all active:scale-95"
                      >
                        <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}>
                          expand_less
                        </span>
                        {isCollapsed ? 'Mostrar' : 'Ocultar'}
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {visibleForPeriod.map(routine => {
                    const check = state.dailyChecks[d]?.[routine.id];
                    if (routine.type === 'focus') {
                      return <FocusTimer key={routine.id} routine={routine} check={check} dispatch={dispatch} onDelete={setDeleteConfirm} />;
                    }
                    if (routine.type === 'counter') {
                      return <CounterCard key={routine.id} routine={routine} check={check} dispatch={dispatch} onDelete={setDeleteConfirm} />;
                    }
                    return (
                      <TaskCard
                        key={routine.id}
                        routine={routine}
                        check={check}
                        dispatch={dispatch}
                        onNote={() => setNoteModal(routine)}
                        onDelete={setDeleteConfirm}
                      />
                    );
                  })}
                  {isCollapsed && doneCount > 0 && (
                    <button
                      onClick={toggleCollapse}
                      className="text-xs text-[var(--text-secondary)] font-medium py-2 flex items-center justify-center gap-1 hover:text-[var(--primary)] transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      {doneCount} tarea{doneCount > 1 ? 's' : ''} completada{doneCount > 1 ? 's' : ''} oculta{doneCount > 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Note Modal */}
      {noteModal && (
        <NoteModal
          routine={noteModal}
          currentNote={state.dailyChecks[d]?.[noteModal.id]?.note || ''}
          onSave={(note) => dispatch({ type: 'ADD_NOTE', routineId: noteModal.id, note })}
          onClose={() => setNoteModal(null)}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm ios-shadow text-center" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-red-500">delete_forever</span>
            </div>
            <h3 className="font-bold text-lg mb-1">¿Eliminar "{deleteConfirm.name}"?</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Esta acción eliminará la rutina de forma permanente.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-2xl bg-gray-100 text-[var(--text-secondary)] font-semibold text-sm">Cancelar</button>
              <button
                onClick={() => {
                  dispatch({ type: 'DELETE_ROUTINE', id: deleteConfirm.id });
                  setDeleteConfirm(null);
                }}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-semibold text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
