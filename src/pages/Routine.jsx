import { useState, useRef } from 'react';
import { useStore, CATEGORIES, PERIODS, uid } from '../store/useStore';

const ICONS = ['wb_sunny', 'fitness_center', 'water_drop', 'menu_book', 'laptop_mac', 'self_improvement', 'restaurant', 'directions_car', 'cleaning_services', 'brush', 'school', 'music_note', 'pets', 'local_florist', 'shopping_cart', 'medication', 'bed', 'hiking'];
const COLOR_OPTIONS = ['orange', 'blue', 'indigo', 'teal', 'purple', 'red', 'green', 'pink'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PERIOD_LABELS = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' };
const CATEGORY_LABELS = { health: 'Health', mind: 'Mind', home: 'Home', career: 'Career' };
const TYPE_OPTIONS = [
  { value: 'check', label: 'Checkbox', icon: 'check_circle' },
  { value: 'counter', label: 'Counter', icon: 'pin' },
  { value: 'focus', label: 'Focus Timer', icon: 'timer' },
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
    'clean': ['Vacuum floors and carpets', 'Wipe down all surfaces', 'Take out trash and recycling', 'Organize clutter into designated areas'],
    'wash': ['Vacuum interior floor mats', 'Clean exterior windows', 'Apply premium wax coat for UV protection', 'Clean dashboard and console'],
    'cook': ['Plan recipe and gather ingredients', 'Prep vegetables and proteins', 'Cook main dish', 'Clean up kitchen after cooking'],
    'exercise': ['5 min warmup stretching', 'Main workout (30 min)', 'Cool down and stretch', 'Log progress and hydrate'],
    'study': ['Review previous notes', 'Read new material (25 min)', 'Summarize key takeaways', 'Practice with exercises'],
    'meditat': ['Find quiet space', 'Set timer for session', 'Focus on breathing', 'Journal reflections after'],
    'read': ['Find a quiet spot', 'Set a 30s min timer', 'Read without distractions', 'Write key takeaways'],
    'morning': ['Make bed immediately', 'Cold water face wash', 'Light stretching (5 min)', 'Plan top 3 priorities'],
    'work': ['Review today\'s goals', 'Close all distractions', 'Deep focus sprint (25 min)', 'Take 5 min break'],
    'shop': ['Make a shopping list', 'Check pantry for items already available', 'Go to the store', 'Put away items and organize'],
  };

  const lower = name.toLowerCase();
  for (const [key, tasks] of Object.entries(breakdowns)) {
    if (lower.includes(key)) {
      return tasks.map(t => ({ id: uid(), text: t, done: false }));
    }
  }
  // Generic fallback
  return [
    { id: uid(), text: `Prepare for ${name}`, done: false },
    { id: uid(), text: `Execute ${name}`, done: false },
    { id: uid(), text: `Review and improve`, done: false },
  ];
}

// ─── Create/Edit Form ───────────────────────────────────────
function RoutineForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    name: '', icon: 'wb_sunny', color: 'blue', category: 'health',
    period: 'morning', days: [1, 2, 3, 4, 5], time: '08:00',
    essential: false, type: 'check', target: 8, focusDuration: 25,
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

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onCancel}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto ios-shadow" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{initial ? 'Edit Routine' : 'New Routine'}</h2>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Name</label>
          <input
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="e.g. Morning Meditation"
            className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
          />
        </div>

        {/* Type */}
        <div className="mb-5">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Type</label>
          <div className="flex gap-2">
            {TYPE_OPTIONS.map(t => (
              <button
                key={t.value}
                onClick={() => update('type', t.value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${form.type === t.value ? 'bg-[var(--primary)] text-white' : 'bg-gray-50 text-[var(--text-secondary)] hover:bg-gray-100'
                  }`}
              >
                <span className="material-symbols-outlined text-lg">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Counter target */}
        {form.type === 'counter' && (
          <div className="mb-5">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Target</label>
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
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Focus Duration (min)</label>
            <input
              type="number"
              value={form.focusDuration}
              onChange={e => update('focusDuration', parseInt(e.target.value) || 5)}
              className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
        )}

        {/* Category & Period */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Category</label>
            <select
              value={form.category}
              onChange={e => update('category', e.target.value)}
              className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none bg-white"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Time of Day</label>
            <select
              value={form.period}
              onChange={e => update('period', e.target.value)}
              className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none bg-white"
            >
              {PERIODS.map(p => <option key={p} value={p}>{PERIOD_LABELS[p]}</option>)}
            </select>
          </div>
        </div>

        {/* Time */}
        <div className="mb-5">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Time</label>
          <input
            type="time"
            value={form.time}
            onChange={e => update('time', e.target.value)}
            className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none bg-white"
          />
        </div>

        {/* Days */}
        <div className="mb-5">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Days</label>
          <div className="flex gap-2">
            {DAY_LABELS.map((label, idx) => (
              <button
                key={idx}
                onClick={() => toggleDay(idx)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${form.days.includes(idx) ? 'bg-[var(--primary)] text-white' : 'bg-gray-50 text-[var(--text-secondary)]'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Icon */}
        <div className="mb-5">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Icon</label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map(icon => (
              <button
                key={icon}
                onClick={() => update('icon', icon)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${form.icon === icon ? 'bg-[var(--primary)] text-white' : 'bg-gray-50 text-[var(--text-secondary)] hover:bg-gray-100'
                  }`}
              >
                <span className="material-symbols-outlined text-lg">{icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="mb-5">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Color</label>
          <div className="flex gap-3">
            {COLOR_OPTIONS.map(c => (
              <button
                key={c}
                onClick={() => update('color', c)}
                className={`w-8 h-8 rounded-full transition-all ${COLORS[c]?.bg} ${form.color === c ? 'ring-2 ring-[var(--primary)] ring-offset-2 scale-110' : ''
                  }`}
              >
                <div className={`w-full h-full rounded-full ${COLORS[c]?.bg}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Essential */}
        <div className="mb-5 flex items-center justify-between bg-gray-50 rounded-2xl p-4">
          <div>
            <p className="font-semibold text-sm">Essential (Emergency Mode)</p>
            <p className="text-xs text-[var(--text-secondary)]">This task will show in Emergency Mode</p>
          </div>
          <button
            onClick={() => update('essential', !form.essential)}
            className={`w-12 h-6 rounded-full relative transition-colors ${form.essential ? 'bg-[var(--primary)]' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${form.essential ? 'right-0.5' : 'left-0.5'}`} />
          </button>
        </div>

        {/* AI Breakdown */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Sub-tasks</label>
            <button
              onClick={handleAIBreakdown}
              className="flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline"
            >
              <span className="material-symbols-outlined text-sm fill-1">auto_awesome</span>
              AI Breakdown
            </button>
          </div>
          <div className="space-y-2">
            {form.subtasks.map(sub => (
              <div key={sub.id} className="flex items-center gap-2">
                <input
                  value={sub.text}
                  onChange={e => updateSubtaskText(sub.id, e.target.value)}
                  placeholder="Sub-task description"
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
            <span className="material-symbols-outlined text-sm">add</span> Add sub-task
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button onClick={onCancel} className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-[var(--text-secondary)] font-semibold">Cancel</button>
          <button
            onClick={() => { if (form.name.trim()) onSave(form); }}
            className="flex-1 py-3.5 rounded-2xl bg-[var(--primary)] text-white font-semibold hover:opacity-90 transition-all"
          >
            {initial ? 'Update' : 'Create'}
          </button>
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
    <div className="relative overflow-hidden rounded-2xl">
      {/* Actions behind */}
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
        className="bg-white rounded-2xl p-5 ios-shadow flex items-center justify-between cursor-pointer relative z-10 transition-transform"
        style={{ transform: `translateX(${swipeX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => { if (swipeX === 0) onEdit(); else setSwipeX(0); }}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl ${col.bg} flex items-center justify-center ${col.text}`}>
            <span className="material-symbols-outlined text-2xl fill">{routine.icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[var(--text-main)]">{routine.name}</h3>
              {routine.essential && (
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-blue-50 text-[var(--primary)]">Essential</span>
              )}
            </div>
            <p className="text-[var(--text-secondary)] text-sm font-medium">
              {routine.days.length === 7 ? 'Daily' : routine.days.map(d => DAY_LABELS[d]).join(', ')} • {routine.time}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-[var(--text-secondary)] bg-gray-50 px-2 py-1 rounded-lg">{routine.type}</span>
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

  return (
    <main className="w-full max-w-4xl mx-auto px-6 pt-8 pb-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-[var(--primary)] text-xs font-bold tracking-widest uppercase mb-1 block">Management</span>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--text-main)]">Routines</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
            {[{ key: 'all', label: 'All' }, ...CATEGORIES.map(c => ({ key: c, label: CATEGORY_LABELS[c] }))].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f.key ? 'bg-white text-[var(--text-main)] ios-shadow' : 'text-[var(--text-secondary)]'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-[var(--primary)]">add_task</span>
          </div>
          <h3 className="text-xl font-bold mb-2">No routines yet</h3>
          <p className="text-[var(--text-secondary)] max-w-sm mb-6">Tap the + button to create your first routine. Our AI can help break down complex tasks.</p>
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
      <button
        onClick={() => { setEditing(null); setFormOpen(true); }}
        className="fixed bottom-24 right-6 sm:right-8 w-14 h-14 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all z-40"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

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
            <h3 className="font-bold text-lg mb-1">Delete "{deleteConfirm.name}"?</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-2xl bg-gray-100 text-[var(--text-secondary)] font-semibold">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
