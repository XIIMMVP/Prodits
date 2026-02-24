import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore, CATEGORIES, PERIODS, uid } from '../store/useStore';
import { ProfileAvatar } from '../components/Layout';
import { useSwipeToClose } from '../hooks/useSwipeToClose';

const ICONS = ['wb_sunny', 'fitness_center', 'water_drop', 'menu_book', 'laptop_mac', 'self_improvement', 'restaurant', 'directions_car', 'cleaning_services', 'brush', 'school', 'music_note', 'pets', 'local_florist', 'shopping_cart', 'medication', 'bed', 'hiking'];
const COLOR_OPTIONS = ['orange', 'blue', 'indigo', 'teal', 'purple', 'red', 'green', 'pink'];
const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const PERIOD_LABELS = { mañana: 'Mañana', tarde: 'Tarde', noche: 'Noche' };
const CATEGORY_LABELS = { salud: 'Salud', mente: 'Mente', hogar: 'Hogar', trabajo: 'Trabajo' };
const TYPE_OPTIONS = [
  { value: 'check', label: 'Checkbox', icon: 'check_circle' },
  { value: 'counter', label: 'Contador', icon: 'pin' },
  { value: 'focus', label: 'Temporizador', icon: 'timer' },
];

const COLORS = {
  orange: { bg: 'bg-orange-50', text: 'text-orange-500' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-500' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-500' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-500' },
  red: { bg: 'bg-red-50', text: 'text-red-500' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-500' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-500' },
};

// ─── AI Task Breakdown (simulated) ──────────────────────────
function generateAIBreakdown(name) {
  const breakdowns = {
    'limpiar': ['Aspirar suelos y alfombras', 'Limpiar todas las superficies', 'Sacar la basura y reciclaje', 'Organizar el desorden en sus áreas'],
    'lavar': ['Aspirar alfombrillas interiores', 'Limpiar cristales exteriores', 'Aplicar capa de cera premium', 'Limpiar salpicadero y consola'],
    'cocinar': ['Planear receta y reunir ingredientes', 'Preparar verduras y proteínas', 'Cocinar plato principal', 'Limpiar la cocina después de cocinar'],
    'ejercici': ['5 min calentamiento', 'Entrenamiento principal (30 min)', 'Enfriamiento y estiramiento', 'Registrar progreso e hidratarse'],
    'estudi': ['Revisar notas anteriores', 'Leer material nuevo (25 min)', 'Resumir puntos clave', 'Practicar con ejercicios'],
    'medit': ['Encontrar un espacio tranquilo', 'Poner temporizador para la sesión', 'Enfocarse en la respiración', 'Reflexiones finales'],
    'leer': ['Encontrar un lugar tranquilo', 'Poner temporizador de 30 min', 'Leer sin distracciones', 'Escribir puntos clave'],
    'mañana': ['Hacer la cama inmediatamente', 'Lavarse la cara con agua fría', 'Estiramientos ligeros (5 min)', 'Planear las 3 prioridades del día'],
    'trabaj': ['Revisar objetivos de hoy', 'Cerrar todas las distracciones', 'Sprint de trabajo profundo (25 min)', 'Descanso de 5 min'],
    'compr': ['Hacer lista de la compra', 'Revisar despensa', 'Ir a la tienda', 'Guardar y organizar productos'],
  };

  const lower = name.toLowerCase();
  for (const [key, tasks] of Object.entries(breakdowns)) {
    if (lower.includes(key)) {
      return tasks.map(t => ({ id: uid(), text: t, done: false }));
    }
  }
  // Generic fallback
  return [
    { id: uid(), text: `Prepararse para ${name}`, done: false },
    { id: uid(), text: `Ejecutar ${name}`, done: false },
    { id: uid(), text: `Revisar y mejorar`, done: false },
  ];
}

// ─── Create/Edit Form ───────────────────────────────────────
function RoutineForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    name: '', icon: 'wb_sunny', color: 'blue', category: 'salud',
    period: 'mañana', days: [1, 2, 3, 4, 5], time: '08:00',
    essential: false, energetic: false, type: 'check', target: 8, focusDuration: 25,
    subtasks: [],
  });

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
    }));
  };

  const handleAIBreakdown = () => {
    if (!form.name.trim()) return;
    const subtasks = generateAIBreakdown(form.name);
    update('subtasks', subtasks);
  };

  const removeSubtask = (id) => {
    update('subtasks', form.subtasks.filter(s => s.id !== id));
  };

  const addSubtask = () => {
    update('subtasks', [...form.subtasks, { id: uid(), text: '', done: false }]);
  };

  const updateSubtaskText = (id, text) => {
    update('subtasks', form.subtasks.map(s => s.id === id ? { ...s, text } : s));
  };

  const { dragY, handlers } = useSwipeToClose(onCancel);

  return (
    <div
      className="fixed z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{
        top: '-env(safe-area-inset-top, 0px)',
        left: 0, right: 0, bottom: 0,
        paddingTop: 'env(safe-area-inset-top, 0px)',
        backgroundColor: 'transparent'
      }}
      onClick={onCancel}
    >
      <div
        className={`bg-[var(--bg-main)] rounded-t-[2.5rem] sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] max-h-[90dvh] sm:h-auto sm:max-h-[90vh] overflow-hidden ios-shadow ${dragY > 0 ? '' : 'animate-slide-up'}`}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: dragY > 0 ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header with Drag Handle */}
        <div
          className="sticky top-0 z-10 bg-[var(--bg-main)] pt-3 pb-3 px-5 sm:px-6 cursor-grab active:cursor-grabbing touch-none"
          {...handlers}
        >
          <div className="w-12 h-1.5 rounded-full bg-gray-200/80 mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{initial ? 'Editar Rutina' : 'Nueva Rutina'}</h2>
            <button
              onClick={onCancel}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overflow-x-hidden max-h-[calc(90vh-100px)] max-h-[calc(90dvh-100px)] sm:max-h-none sm:h-auto px-4 sm:px-6 py-2">

          {/* Name */}
          <div className="mb-5">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Nombre</label>
            <input
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="ej. Meditación Mañanera"
              className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
            />
          </div>

          {/* Type */}
          <div className="mb-4">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Tipo</label>
            <div className="grid grid-cols-3 gap-2">
              {TYPE_OPTIONS.map(t => (
                <button
                  key={t.value}
                  onClick={() => update('type', t.value)}
                  className={`flex items-center justify-center gap-1 py-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all border ${form.type === t.value ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-gray-50 text-[var(--text-secondary)] border-transparent hover:bg-gray-100'
                    }`}
                >
                  <span className="material-symbols-outlined text-base">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Counter target */}
          {form.type === 'counter' && (
            <div className="mb-5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Objetivo</label>
              <input
                type="number"
                value={form.target}
                onChange={e => update('target', parseInt(e.target.value) || 1)}
                className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>
          )}

          {/* Focus duration */}
          {form.type === 'focus' && (
            <div className="mb-5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Duración (min)</label>
              <input
                type="number"
                value={form.focusDuration}
                onChange={e => update('focusDuration', parseInt(e.target.value) || 5)}
                className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>
          )}

          {/* Category */}
          <div className="mb-4">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Categoría</label>
            <select
              value={form.category}
              onChange={e => update('category', e.target.value)}
              className="w-full border border-[var(--border)] rounded-2xl px-3 py-3 text-sm outline-none bg-white appearance-none"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>

          {/* Period & Time */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="min-w-0">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Momento</label>
              <select
                value={form.period}
                onChange={e => update('period', e.target.value)}
                className="w-full h-12 border border-[var(--border)] rounded-2xl px-4 text-sm outline-none bg-white appearance-none"
              >
                {PERIODS.map(p => <option key={p} value={p}>{PERIOD_LABELS[p]}</option>)}
              </select>
            </div>
            <div className="min-w-0">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Hora</label>
              <input
                type="time"
                value={form.time}
                onChange={e => update('time', e.target.value)}
                className="w-full h-12 border border-[var(--border)] rounded-2xl px-4 text-sm outline-none bg-white flex items-center leading-none"
                style={{ WebkitAppearance: 'none', lineHeight: 'normal' }}
              />
            </div>
          </div>

          {/* Days */}
          <div className="mb-4">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Días</label>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {DAY_LABELS.map((label, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleDay(idx)}
                  className={`h-10 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${form.days.includes(idx) ? 'bg-[var(--primary)] text-white' : 'bg-gray-50 text-[var(--text-secondary)]'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Icon */}
          <div className="mb-4">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Icono</label>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {ICONS.map(icon => (
                <button
                  key={icon}
                  onClick={() => update('icon', icon)}
                  className={`aspect-square rounded-xl flex items-center justify-center transition-all ${form.icon === icon ? 'bg-[var(--primary)] text-white' : 'bg-gray-50 text-[var(--text-secondary)] hover:bg-gray-100'
                    }`}
                >
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mb-4">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Color</label>
            <div className="flex gap-2 sm:gap-3">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  onClick={() => update('color', c)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all ${COLORS[c]?.bg} ${form.color === c ? 'ring-2 ring-[var(--primary)] ring-offset-2 scale-110' : ''
                    }`}
                >
                  <div className={`w-full h-full rounded-full ${COLORS[c]?.bg}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Essential */}
          <div className="mb-4 flex items-center justify-between gap-3 bg-gray-50 rounded-2xl p-3 sm:p-4">
            <div className="min-w-0">
              <p className="font-semibold text-sm">Esencial</p>
              <p className="text-[11px] sm:text-xs text-[var(--text-secondary)]">Se muestra en Modo Emergencia</p>
            </div>
            <button
              onClick={() => update('essential', !form.essential)}
              className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${form.essential ? 'bg-[var(--primary)]' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${form.essential ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Energetic */}
          <div className="mb-4 flex items-center justify-between gap-3 bg-amber-50/50 rounded-2xl p-3 sm:p-4">
            <div className="min-w-0">
              <p className="font-semibold text-sm">Extra 🔥</p>
              <p className="text-[11px] sm:text-xs text-[var(--text-secondary)]">Solo aparece en Modo Enérgico</p>
            </div>
            <button
              onClick={() => update('energetic', !form.energetic)}
              className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${form.energetic ? 'bg-amber-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${form.energetic ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>

          {/* AI Breakdown */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Sub-tareas</label>
              <button
                onClick={handleAIBreakdown}
                className="flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline"
              >
                <span className="material-symbols-outlined text-sm fill-1">auto_awesome</span>
                Desglose IA
              </button>
            </div>
            <div className="space-y-2">
              {form.subtasks.map(sub => (
                <div key={sub.id} className="flex items-center gap-2">
                  <input
                    value={sub.text}
                    onChange={e => updateSubtaskText(sub.id, e.target.value)}
                    placeholder="Descripción de la sub-tarea"
                    className="flex-1 border border-[var(--border)] rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[var(--primary)]/20"
                  />
                  <button onClick={() => removeSubtask(sub.id)} className="text-red-400 hover:text-red-600">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addSubtask}
              className="mt-2 text-sm text-[var(--primary)] font-semibold flex items-center gap-1 hover:underline"
            >
              <span className="material-symbols-outlined text-sm">add</span> Añadir sub-tarea
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 pb-8">
            <button onClick={onCancel} className="flex-1 py-4 rounded-2xl bg-gray-100 text-[var(--text-secondary)] font-bold">Cancelar</button>
            <button
              onClick={() => { if (form.name.trim()) onSave(form); }}
              className="flex-1 py-4 rounded-2xl bg-[var(--primary)] text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
            >
              {initial ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Swipeable Routine Card ─────────────────────────────────
function RoutineCard({ routine, onEdit, onDelete }) {
  const col = COLORS[routine.color] || COLORS.blue;
  const [swipeX, setSwipeX] = useState(0);
  const startX = useRef(0);
  const swiping = useRef(false);

  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX; swiping.current = true; };
  const handleTouchMove = (e) => {
    if (!swiping.current) return;
    const diff = e.touches[0].clientX - startX.current;
    setSwipeX(Math.max(-120, Math.min(0, diff)));
  };
  const handleTouchEnd = () => {
    swiping.current = false;
    if (swipeX < -60) setSwipeX(-120);
    else setSwipeX(0);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl group">
      {/* Desktop Actions */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 hidden sm:flex">
        <button onClick={(e) => { e.stopPropagation(); onEdit(routine); }} className="w-9 h-9 rounded-full bg-blue-50 text-[var(--primary)] flex items-center justify-center hover:bg-blue-100 transition-colors shadow-sm">
          <span className="material-symbols-outlined text-lg">edit</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(routine.id); }} className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm">
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>
      {/* Actions behind (Mobile) */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center gap-1 pr-2">
        <button onClick={onEdit} className="w-14 h-14 rounded-xl bg-blue-500 text-white flex items-center justify-center">
          <span className="material-symbols-outlined">edit</span>
        </button>
        <button onClick={onDelete} className="w-14 h-14 rounded-xl bg-red-500 text-white flex items-center justify-center">
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
      {/* Card */}
      <div
        className="bg-white rounded-2xl p-4 sm:p-5 ios-shadow flex items-center justify-between cursor-pointer relative z-10 transition-transform gap-3"
        style={{ transform: `translateX(${swipeX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => { if (swipeX === 0) onEdit(); else setSwipeX(0); }}
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${col.bg} flex items-center justify-center ${col.text} flex-shrink-0`}>
            <span className="material-symbols-outlined text-xl sm:text-2xl fill">{routine.icon}</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--text-main)] truncate">{routine.name}</h3>
              {routine.essential && (
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-blue-50 text-[var(--primary)]">Esencial</span>
              )}
              {routine.energetic && (
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-amber-50 text-amber-600">Extra 🔥</span>
              )}
            </div>
            <p className="text-[var(--text-secondary)] text-sm font-medium">
              {routine.days.length === 7 ? 'Diario' : routine.days.map(d => DAY_LABELS[d]).join(', ')} • {routine.time}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase text-[var(--text-secondary)] bg-gray-50 px-1.5 sm:px-2 py-1 rounded-lg">{routine.type}</span>
          <span className="material-symbols-outlined text-gray-300">chevron_right</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Routine Page ──────────────────────────────────────
export default function Routine() {
  const { state, dispatch } = useStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [reorderMode, setReorderMode] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState(null);
  const dragStartY = useRef(0);
  const dragCurrentY = useRef(0);
  const cardRefs = useRef([]);

  const filtered = filter === 'all'
    ? state.routines
    : state.routines.filter(r => r.category === filter);

  const handleSave = (form) => {
    if (editing) {
      dispatch({ type: 'UPDATE_ROUTINE', id: editing.id, data: form });
    } else {
      dispatch({ type: 'ADD_ROUTINE', routine: form });
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleEdit = (routine) => {
    setEditing(routine);
    setFormOpen(true);
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_ROUTINE', id });
    setDeleteConfirm(null);
  };

  const moveRoutine = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= state.routines.length) return;
    dispatch({ type: 'REORDER_ROUTINES', fromIndex: fromIdx, toIndex: toIdx });
  };

  // Touch drag handlers for reorder
  const handleDragStart = (e, idx) => {
    e.stopPropagation();
    setDraggingIdx(idx);
    dragStartY.current = e.touches[0].clientY;
    dragCurrentY.current = e.touches[0].clientY;
  };

  const handleDragMove = (e) => {
    if (draggingIdx === null) return;
    e.preventDefault();
    dragCurrentY.current = e.touches[0].clientY;
    const diff = dragCurrentY.current - dragStartY.current;
    const cardHeight = 72; // approximate card height + gap

    if (Math.abs(diff) > cardHeight) {
      const direction = diff > 0 ? 1 : -1;
      const newIdx = draggingIdx + direction;
      if (newIdx >= 0 && newIdx < state.routines.length) {
        moveRoutine(draggingIdx, newIdx);
        setDraggingIdx(newIdx);
        dragStartY.current = dragCurrentY.current;
      }
    }
  };

  const handleDragEnd = () => {
    setDraggingIdx(null);
  };

  const toggleReorderMode = () => {
    if (!reorderMode) setFilter('all'); // Reorder only works on all routines
    setReorderMode(!reorderMode);
  };

  return (
    <main
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-10"
      onTouchMove={reorderMode ? handleDragMove : undefined}
      onTouchEnd={reorderMode ? handleDragEnd : undefined}
    >
      <header className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[var(--primary)] text-xs font-bold tracking-widest uppercase mb-1 block">Gestión</span>
            <div className="flex items-end gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-main)]">Rutinas</h1>
              <Link to="/appointments" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-secondary)] opacity-50 hover:opacity-100 transition-opacity mb-0.5 sm:mb-1">Citas</Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleReorderMode}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${reorderMode
                ? 'bg-[var(--primary)] text-white'
                : 'bg-gray-50 text-[var(--text-secondary)] hover:bg-gray-100'
                }`}
            >
              <span className="material-symbols-outlined text-base">{reorderMode ? 'check' : 'swap_vert'}</span>
              {reorderMode ? 'Listo' : 'Ordenar'}
            </button>
            <ProfileAvatar />
          </div>
        </div>
        {!reorderMode && (
          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl overflow-x-auto">
              {[{ key: 'all', label: 'Todas' }, ...CATEGORIES.map(c => ({ key: c, label: CATEGORY_LABELS[c] }))].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${filter === f.key ? 'bg-white text-[var(--text-main)] ios-shadow' : 'text-[var(--text-secondary)]'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-[var(--primary)]">add_task</span>
          </div>
          <h3 className="text-xl font-bold mb-2">No hay rutinas aún</h3>
          <p className="text-[var(--text-secondary)] max-w-sm mb-6">Toca el botón + para crear tu primera rutina. Nuestra IA puede ayudarte a desglosar tareas complejas.</p>
        </div>
      ) : reorderMode ? (
        /* ─── Reorder Mode ─── */
        <div className="space-y-2">
          {state.routines.map((routine, idx) => {
            const col = COLORS[routine.color] || COLORS.blue;
            const isDragging = draggingIdx === idx;
            return (
              <div
                key={routine.id}
                ref={el => cardRefs.current[idx] = el}
                className={`bg-white rounded-2xl p-3 sm:p-4 ios-shadow flex items-center gap-3 transition-all select-none ${isDragging ? 'scale-[1.02] shadow-lg ring-2 ring-[var(--primary)]/30 opacity-90' : ''
                  }`}
              >
                {/* Drag Handle */}
                <div
                  className="flex items-center justify-center w-8 h-10 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
                  onTouchStart={(e) => handleDragStart(e, idx)}
                >
                  <span className="material-symbols-outlined text-xl text-gray-300">drag_indicator</span>
                </div>

                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl ${col.bg} flex items-center justify-center ${col.text} flex-shrink-0`}>
                  <span className="material-symbols-outlined text-lg fill">{routine.icon}</span>
                </div>

                {/* Name */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-[var(--text-main)] truncate">{routine.name}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {routine.days.length === 7 ? 'Diario' : routine.days.map(d => DAY_LABELS[d]).join(', ')}
                  </p>
                </div>

                {/* Up / Down */}
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => moveRoutine(idx, idx - 1)}
                    disabled={idx === 0}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${idx === 0 ? 'text-gray-200' : 'text-[var(--text-secondary)] hover:bg-gray-50 active:bg-gray-100'
                      }`}
                  >
                    <span className="material-symbols-outlined text-lg">keyboard_arrow_up</span>
                  </button>
                  <button
                    onClick={() => moveRoutine(idx, idx + 1)}
                    disabled={idx === state.routines.length - 1}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${idx === state.routines.length - 1 ? 'text-gray-200' : 'text-[var(--text-secondary)] hover:bg-gray-50 active:bg-gray-100'
                      }`}
                  >
                    <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(routine => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onEdit={() => handleEdit(routine)}
              onDelete={() => setDeleteConfirm(routine)}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      {!reorderMode && (
        <button
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="fixed bottom-32 right-6 sm:right-8 w-14 h-14 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all z-40"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      )}

      {/* Form Modal */}
      {formOpen && (
        <RoutineForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setFormOpen(false); setEditing(null); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm ios-shadow text-center" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-red-500">delete_forever</span>
            </div>
            <h3 className="font-bold text-lg mb-1">¿Eliminar "{deleteConfirm.name}"?</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-2xl bg-gray-100 text-[var(--text-secondary)] font-semibold">Cancelar</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-semibold">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
