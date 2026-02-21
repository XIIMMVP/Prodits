import { useState, useRef } from 'react';
import { useStore, uid, today } from '../store/useStore';
import { ProfileAvatar } from '../components/Layout';

const CATEGORY_LABELS = { salud: 'Salud y Vitalidad', mente: 'Crecimiento Personal', trabajo: 'Productividad', hogar: 'Estilo de Vida' };
const FILTER_TABS = ['Todos', 'Salud', 'Trabajo', 'Mente', 'Hogar'];
const CATEGORY_MAP = { Todos: null, Salud: 'salud', Trabajo: 'trabajo', Mente: 'mente', Hogar: 'hogar' };

const PLACEHOLDER_PHOTOS = [
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
];

function NewEntryModal({ onSave, onClose }) {
  const [form, setForm] = useState({ title: '', text: '', category: 'salud', photo: '' });
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const now = new Date();
  const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl px-4 sm:px-6 py-5 sm:py-6 w-full sm:max-w-lg max-h-[90vh] max-h-[90dvh] overflow-y-auto overflow-x-hidden ios-shadow" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Nuevo Éxito</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Título</label>
          <input value={form.title} onChange={e => update('title', e.target.value)} placeholder="ej. Sesión Productiva" className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Descripción</label>
          <textarea value={form.text} onChange={e => update('text', e.target.value)} placeholder="¿Qué has logrado?" className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none h-24 resize-none focus:ring-2 focus:ring-[var(--primary)]/20" />
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Categoría</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORY_MAP).filter(([k]) => k !== 'Todos').map(([label, val]) => (
              <button key={val} onClick={() => update('category', val)} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${form.category === val ? 'bg-[var(--primary)] text-white' : 'bg-gray-50 text-[var(--text-secondary)]'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">URL de la Foto (opcional)</label>
          <input value={form.photo} onChange={e => update('photo', e.target.value)} placeholder="https://..." className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20" />
          <p className="text-[10px] text-[var(--text-secondary)] mt-1">Pega una URL de imagen o deja en blanco para una por defecto</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-[var(--text-secondary)] font-semibold">Cancelar</button>
          <button onClick={() => {
            if (form.title.trim()) {
              onSave({
                ...form,
                photo: form.photo || PLACEHOLDER_PHOTOS[Math.floor(Math.random() * PLACEHOLDER_PHOTOS.length)],
                time,
              });
              onClose();
            }
          }} className="flex-1 py-3.5 rounded-2xl bg-[var(--primary)] text-white font-semibold hover:opacity-90 transition-all">
            Guardar Éxito
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Journal() {
  const { state, dispatch } = useStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);

  const catKey = CATEGORY_MAP[activeFilter];
  let entries = state.journal;
  if (catKey) entries = entries.filter(e => e.category === catKey);
  if (search.trim()) {
    const q = search.toLowerCase();
    entries = entries.filter(e => e.title.toLowerCase().includes(q) || e.text.toLowerCase().includes(q));
  }

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-10">
      {/* Search Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xl">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-xl">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#F2F2F7] border-none rounded-2xl py-2.5 sm:py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[var(--primary)]/20 transition-all outline-none placeholder:text-[var(--text-secondary)]"
              placeholder="Buscar entradas..."
            />
          </div>
          <ProfileAvatar />
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="bg-[var(--primary)] text-white px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 ios-shadow hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Nueva Entrada
        </button>
      </header>

      {/* Title + Filters */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-[var(--text-main)]">Tu Feed de Éxitos</h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Siguiendo tu camino hacia la excelencia.</p>
        </div>
        <div className="flex gap-1.5 bg-[#F2F2F7] p-1 rounded-xl border border-[var(--border)] overflow-x-auto">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${activeFilter === tab ? 'bg-white text-[var(--text-main)] ios-shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-[var(--primary)]">photo_camera</span>
          </div>
          <h3 className="text-xl font-bold mb-2">No hay entradas aún</h3>
          <p className="text-[var(--text-secondary)] max-w-sm mb-6">Empieza a documentar tus victorias. Cada pequeño triunfo cuenta para el éxito final.</p>
          <button onClick={() => setShowNew(true)} className="bg-[var(--primary)] text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:opacity-90 transition-all">
            Añadir Tu Primera Entrada
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden ios-shadow border border-[var(--border)]/50 group transition-all hover:shadow-lg">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  alt={entry.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={entry.photo}
                />
                <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                  {entry.time}
                </div>
                <button
                  onClick={() => dispatch({ type: 'DELETE_JOURNAL', id: entry.id })}
                  className="absolute top-4 left-4 bg-black/30 backdrop-blur-md text-white w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">
                    {CATEGORY_LABELS[entry.category] || entry.category}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-[var(--text-main)]">{entry.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">{entry.text}</p>
                <p className="text-[10px] text-[var(--text-secondary)] mt-3">{entry.date}</p>
              </div>
            </div>
          ))}

          {/* Add new card */}
          <div
            onClick={() => setShowNew(true)}
            className="rounded-2xl sm:rounded-3xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center p-6 sm:p-8 bg-[var(--background)] hover:bg-white hover:border-[var(--primary)]/30 transition-all cursor-pointer group min-h-[200px] sm:min-h-[300px]"
          >
            <div className="w-16 h-16 rounded-full bg-white border border-[var(--border)] flex items-center justify-center mb-4 group-hover:border-[var(--primary)] transition-colors ios-shadow">
              <span className="material-symbols-outlined text-3xl text-[var(--primary)]">add_a_photo</span>
            </div>
            <span className="font-bold text-[var(--text-main)]">Añadir Éxito</span>
            <p className="text-[var(--text-secondary)] text-sm text-center mt-1">Captura tu próxima victoria</p>
          </div>
        </div>
      )}

      {/* New Entry Modal */}
      {showNew && (
        <NewEntryModal
          onSave={(entry) => dispatch({ type: 'ADD_JOURNAL', entry })}
          onClose={() => setShowNew(false)}
        />
      )}
    </main>
  );
}
