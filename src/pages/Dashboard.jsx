import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore, useTodayRoutines, today } from '../store/useStore';

const ENERGY_EMOJIS = [
  { emoji: '😫', label: 'Agotado', level: 1 },
  { emoji: '😐', label: 'Bajo', level: 2 },
  { emoji: '😊', label: 'Bien', level: 3 },
  { emoji: '⚡', label: 'Con Energía', level: 4 },
  { emoji: '🔥', label: 'Motivado', level: 5 },
];

const COLORS = {
  orange: { bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-200' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-200' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-500', border: 'border-indigo-200' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-500', border: 'border-teal-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-500', border: 'border-purple-200' },
  red: { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-200' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-500', border: 'border-emerald-200' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-500', border: 'border-pink-200' },
};

function formatDate() {
  const d = new Date();
  return d.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' });
}

// ─── Focus Timer Component ──────────────────────────────────
function FocusTimer({ routine, check, dispatch, onDelete }) {
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState((routine.focusDuration || 25) * 60);
  const [total] = useState((routine.focusDuration || 25) * 60);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            dispatch({ type: 'TOGGLE_TASK', routineId: routine.id });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, remaining, dispatch, routine.id]);

  const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
  const secs = (remaining % 60).toString().padStart(2, '0');
  const progress = 1 - remaining / total;
  const circumference = 2 * Math.PI * 68;
  const offset = circumference * (1 - progress);

  const toggleTimer = () => {
    if (check?.done) return;
    setRunning(!running);
  };

  const resetTimer = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
    setRemaining(total);
    if (check?.done) {
      dispatch({ type: 'TOGGLE_TASK', routineId: routine.id });
    }
  };

  return (
    <div className={`bg-white rounded-[2rem] p-6 ios-shadow flex flex-col items-center justify-center text-center ${routine.essential ? 'border-l-4 border-l-[var(--primary)]' : ''} ${routine.energetic ? 'border-l-4 border-l-amber-400' : ''}`}>
      <div className="w-full flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{routine.name}</span>
          {routine.essential && (
            <span className="text-[10px] font-bold text-[var(--primary)] bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wide">Esencial</span>
          )}
          {routine.energetic && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase tracking-wide">Extra 🔥</span>
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
          <circle cx={72} cy={72} fill="none" r={68} stroke="#F2F2F7" strokeWidth={8} />
          <circle cx={72} cy={72} fill="none" r={68} stroke={check?.done ? '#10b981' : '#D1D1D6'} strokeDasharray={circumference} strokeDashoffset={check?.done ? 0 : offset} strokeLinecap="round" strokeWidth={8} className="transition-all duration-500" />
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
    <div className={`bg-white rounded-[1.5rem] p-5 ios-shadow flex items-center justify-between relative group ${check?.done ? 'ring-2 ring-emerald-200' : ''} ${routine.essential ? 'border-l-4 border-l-[var(--primary)]' : ''} ${routine.energetic ? 'border-l-4 border-l-amber-400' : ''}`}>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(routine); }}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ios-shadow z-10 hidden sm:flex hover:bg-red-100"
        title="Eliminar rutina"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
      </button>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl ${col.bg} flex items-center justify-center ${col.text}`}>
          <span className="material-symbols-outlined fill-1">{routine.icon}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold">{routine.name}</h4>
            {routine.essential && (
              <span className="text-[10px] font-bold text-[var(--primary)] bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wide">Esencial</span>
            )}
            {routine.energetic && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase tracking-wide">Extra 🔥</span>
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
    <div className={`bg-white rounded-[1.5rem] p-5 ios-shadow flex items-start gap-4 transition-all relative group ${isDone ? 'opacity-60' : ''
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
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className={`font-bold text-lg ${isDone ? 'line-through text-gray-400' : ''}`}>{routine.name}</h4>
          {routine.essential && (
            <span className="text-[10px] font-bold text-[var(--primary)] bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wide">Esencial</span>
          )}
          {routine.energetic && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md uppercase tracking-wide">Extra 🔥</span>
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
  const totalDone = todayRoutines.filter(r => state.dailyChecks[d]?.[r.id]?.done).length;
  const totalCount = todayRoutines.length;

  const periodLabels = { 'mañana': 'Mañana', 'tarde': 'Tarde', 'noche': 'Noche' };
  const periodDots = {
    'mañana': 'bg-[var(--primary)]',
    'tarde': 'bg-orange-400',
    'noche': 'bg-purple-400'
  };

  return (
    <main className="w-full max-w-4xl mx-auto px-6 pt-8 pb-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">{formatDate()}</p>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--text-main)]">Hoy</h1>
        </div>
        <div className="flex items-center gap-4">
          {totalCount > 0 && (
            <div className="text-xs font-bold text-[var(--text-secondary)] bg-white px-3 py-1.5 rounded-full ios-shadow">
              {totalDone}/{totalCount} completado
            </div>
          )}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_EMERGENCY' })}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ios-shadow border transition-all ${emergency ? 'bg-blue-500 text-white border-blue-400' : 'bg-white text-[var(--text-secondary)] border-gray-100'
              }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider">Emergencia</span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${emergency ? 'bg-blue-300' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${emergency ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_ENERGETIC' })}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ios-shadow border transition-all ${energetic ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400' : 'bg-white text-[var(--text-secondary)] border-gray-100'
              }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider">Enérgico</span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${energetic ? 'bg-amber-300' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${energetic ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>
        </div>
      </header>

      <section className="mb-8">
        <div className="bg-white rounded-[2rem] p-8 ios-shadow border border-gray-50/50">
          <h2 className="text-center text-[var(--text-secondary)] text-sm font-medium mb-6">¿Cómo está tu nivel de energía?</h2>
          <div className="flex justify-between items-center max-w-sm mx-auto">
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
                    // Mid levels: deactivate both modes
                    if (emergency) dispatch({ type: 'SET_EMERGENCY_MODE', value: false });
                    if (energetic) dispatch({ type: 'SET_ENERGETIC_MODE', value: false });
                  }
                }}
                className={`flex items-center justify-center rounded-2xl transition-all duration-300 ${energyLevel === e.level
                  ? e.level <= 2
                    ? 'w-14 h-14 bg-blue-500 text-3xl shadow-lg shadow-blue-200 scale-110'
                    : e.level >= 4
                      ? 'w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 text-3xl shadow-lg shadow-amber-200 scale-110'
                      : 'w-14 h-14 bg-gray-100 text-3xl shadow-lg shadow-gray-200 scale-110'
                  : 'w-12 h-12 hover:bg-gray-50 text-2xl hover:scale-105'
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
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-blue-500 fill-1">priority_high</span>
          <div>
            <p className="font-bold text-sm text-blue-700">Modo Emergencia Activo</p>
            <p className="text-xs text-blue-500">Solo se muestran tareas esenciales. Enfócate en lo importante.</p>
          </div>
        </div>
      )}

      {/* Energetic Mode Banner */}
      {energetic && (
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-500 fill-1">bolt</span>
          <div>
            <p className="font-bold text-sm text-amber-700">🔥 Modo Enérgico Activo</p>
            <p className="text-xs text-amber-600">¡Máxima productividad! Todas las tareas visibles. Aprovecha tu energía al máximo.</p>
          </div>
        </div>
      )}

      {/* Low energy banner */}
      {energyLevel === 2 && !emergency && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
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
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-500">bolt</span>
          <div className="flex-1">
            <p className="font-bold text-sm text-amber-700">¡Buena energía detectada!</p>
            <p className="text-xs text-amber-600">Activa el Modo Enérgico para aprovechar al máximo tu productividad.</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_ENERGETIC_MODE', value: true })}
            className="px-6 py-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity whitespace-nowrap shadow-lg shadow-amber-200"
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
            return (
              <section key={period}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-2 h-2 rounded-full ${periodDots[period]}`} />
                  <h3 className="text-xl font-bold text-[var(--text-main)]">{periodLabels[period]}</h3>
                  <span className="text-xs text-[var(--text-secondary)] ml-auto">
                    {routines.filter(r => state.dailyChecks[d]?.[r.id]?.done).length}/{routines.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {routines.map(routine => {
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
