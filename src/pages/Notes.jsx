import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, uid } from '../store/useStore';
import { ProfileAvatar } from '../components/Layout';
import { useSwipeToClose } from '../hooks/useSwipeToClose';

function NoteModal({ initial, onSave, onClose }) {
    const [form, setForm] = useState(initial || { title: '', text: '' });
    const update = (k, v) => setForm(p => ({ ...p, [k]: v }));
    const { dragY, handlers } = useSwipeToClose(onClose);

    return (
        <div
            className="fixed z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{
                top: '-env(safe-area-inset-top, 0px)',
                left: 0, right: 0, bottom: 0,
                paddingTop: 'env(safe-area-inset-top, 0px)',
                backgroundColor: 'transparent'
            }}
            onClick={onClose}
        >
            <div
                className={`bg-[var(--bg-main)] rounded-t-[2.5rem] sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] max-h-[90dvh] sm:h-auto sm:max-h-[90vh] flex flex-col ios-shadow overflow-hidden ${dragY > 0 ? '' : 'animate-slide-up'}`}
                style={{
                    transform: `translateY(${dragY}px)`,
                    transition: dragY > 0 ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 bg-[var(--bg-main)] pt-3 pb-3 px-5 sm:px-6 cursor-grab active:cursor-grabbing touch-none" {...handlers}>
                    <div className="w-12 h-1.5 rounded-full bg-gray-200/80 mx-auto mb-4" />
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">{initial ? 'Editar Nota' : 'Nueva Nota'}</h2>
                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform">
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto px-4 sm:px-6 py-2 flex-1">
                    <div className="mb-4">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Título</label>
                        <input value={form.title} onChange={e => update('title', e.target.value)} placeholder="Ej. Idea genial..." className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                    </div>

                    <div className="mb-4">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Contenido</label>
                        <textarea value={form.text} onChange={e => update('text', e.target.value)} placeholder="Escribe tu nota aquí..." className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none h-48 resize-none focus:ring-2 focus:ring-[var(--primary)]/20" />
                    </div>

                    <div className="flex gap-3 pt-4 pb-8">
                        <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-gray-100 text-[var(--text-secondary)] font-bold">Cancelar</button>
                        <button onClick={() => {
                            if (form.title.trim() || form.text.trim()) {
                                onSave(form);
                                onClose();
                            }
                        }} className="flex-1 py-4 rounded-2xl bg-[var(--primary)] text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20">
                            Guardar Nota
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Notes() {
    const { state, dispatch } = useStore();
    const [search, setSearch] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc'); // desc = newest first, asc = oldest first

    const notes = state.notes || [];

    let filtered = notes;
    if (showFavoritesOnly) {
        filtered = filtered.filter(n => n.isFavorite);
    }
    if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(n => (n.title || '').toLowerCase().includes(q) || (n.text || '').toLowerCase().includes(q));
    }

    filtered = [...filtered].sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;

        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    const toggleStatus = (e, note, field) => {
        e.stopPropagation();
        dispatch({ type: 'UPDATE_SAVED_NOTE', id: note.id, data: { [field]: !note[field] } });
    };

    const handleSave = (form) => {
        if (editing) {
            dispatch({ type: 'UPDATE_SAVED_NOTE', id: editing.id, data: form });
        } else {
            dispatch({ type: 'ADD_SAVED_NOTE', note: form });
        }
    };

    const handleDelete = (id) => {
        dispatch({ type: 'DELETE_SAVED_NOTE', id });
    };

    return (
        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-10">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-xl">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-xl">search</span>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-gray-100 border-none rounded-2xl py-2.5 sm:py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[var(--primary)]/20 transition-all outline-none placeholder:text-[var(--text-secondary)] text-[var(--text-main)]"
                            placeholder="Buscar notas..."
                        />
                    </div>
                    <button
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl sm:rounded-full shrink-0 flex items-center justify-center transition-all bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200"
                        title={sortOrder === 'desc' ? "Ordenadas de más recientes a antiguas (Tocar para invertir)" : "Ordenadas de más antiguas a recientes (Tocar para invertir)"}
                    >
                        <span className="material-symbols-outlined text-[1.2rem]">
                            {sortOrder === 'desc' ? 'arrow_downward' : 'arrow_upward'}
                        </span>
                    </button>
                    <button
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl sm:rounded-full shrink-0 flex items-center justify-center transition-all ${showFavoritesOnly ? 'bg-amber-400 text-white ios-shadow' : 'bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200'}`}
                        title="Ver solo favoritos"
                    >
                        <span className="material-symbols-outlined text-[1.2rem]" style={showFavoritesOnly ? { fontVariationSettings: "'FILL' 1" } : {}}>star</span>
                    </button>
                    <ProfileAvatar />
                </div>
                <button
                    onClick={() => { setEditing(null); setShowNew(true); }}
                    className="bg-[var(--primary)] text-white px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 ios-shadow hover:brightness-110 transition-all"
                >
                    <span className="material-symbols-outlined text-xl">add</span>
                    Nueva Nota
                </button>
            </header>

            <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div>
                    <span className="text-[var(--primary)] text-xs font-bold tracking-widest uppercase mb-1 block">Gestión</span>
                    <div className="flex items-end gap-3 mb-1">
                        <Link to="/journal" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-secondary)] opacity-50 hover:opacity-100 transition-opacity mb-0.5 sm:mb-1">Tu Feed de Éxitos</Link>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">Notas</h2>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] font-medium">Captura tus ideas y pensamientos.</p>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-5xl text-[var(--text-secondary)]">description</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">No hay notas todavía</h3>
                    <p className="text-[var(--text-secondary)] max-w-sm mb-6">Tu espacio para escribir libremente. Todo aquello que no quieras olvidar.</p>
                    <button onClick={() => { setEditing(null); setShowNew(true); }} className="bg-[var(--primary)] text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:opacity-90 transition-all">
                        Empezar a escribir
                    </button>
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6">
                    {filtered.map(note => (
                        <div
                            key={note.id}
                            className={`mb-4 sm:mb-6 break-inside-avoid rounded-2xl sm:rounded-3xl p-5 ios-shadow border transition-all hover:shadow-lg relative overflow-hidden group bg-gray-50 text-[var(--text-main)] border-[var(--border)] flex flex-col`}
                        >
                            <div className="absolute right-3 top-3 z-20">
                                <button
                                    onClick={(e) => toggleStatus(e, note, 'isPinned')}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${note.isPinned ? 'bg-[var(--primary)] text-white opacity-100' : 'bg-white/50 text-black/70 opacity-0 group-hover:opacity-100 hover:bg-white/80'}`}
                                >
                                    <span className={`material-symbols-outlined text-sm ${note.isPinned ? '!text-white' : ''}`} style={note.isPinned ? { fontVariationSettings: "'FILL' 1" } : {}}>keep</span>
                                </button>
                            </div>
                            <div
                                className="cursor-pointer flex-1"
                                onClick={() => { setEditing(note); setShowNew(true); }}
                            >
                                {note.title && <h3 className="font-bold text-lg mb-2 leading-tight pr-10">{note.title}</h3>}
                                <p className="text-sm leading-relaxed whitespace-pre-wrap opacity-90">{note.text}</p>
                            </div>
                            <div className="flex items-end justify-between mt-5 pt-3 border-t border-[var(--border)]/40 relative z-20">
                                <p className="text-[10px] opacity-60 font-semibold uppercase tracking-wider">
                                    {new Date(note.createdAt).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <div className="flex items-center gap-0.5 sm:gap-1 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => toggleStatus(e, note, 'isFavorite')}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${note.isFavorite ? 'bg-amber-400 text-white opacity-100' : 'bg-white/50 text-black/70 hover:bg-white/80'}`}
                                    >
                                        <span className={`material-symbols-outlined text-sm ${note.isFavorite ? '!text-white' : ''}`} style={note.isFavorite ? { fontVariationSettings: "'FILL' 1" } : {}}>star</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); setEditing(note); setShowNew(true); }} className="w-8 h-8 rounded-full bg-white/50 text-black/70 flex items-center justify-center hover:bg-white/80 transition-colors shadow-sm">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }} className="w-8 h-8 rounded-full bg-white/50 text-red-600 flex items-center justify-center hover:bg-white/80 transition-colors shadow-sm">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add new card placeholder */}
                    <div
                        onClick={() => { setEditing(null); setShowNew(true); }}
                        className="mb-4 sm:mb-6 break-inside-avoid bg-[var(--background)] rounded-2xl sm:rounded-3xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center p-6 sm:p-8 hover:bg-white hover:border-[var(--primary)]/30 transition-all cursor-pointer group min-h-[150px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-white border border-[var(--border)] flex items-center justify-center mb-3 group-hover:border-[var(--primary)] transition-colors ios-shadow">
                            <span className="material-symbols-outlined text-xl text-[var(--primary)]">add</span>
                        </div>
                        <span className="font-bold text-[var(--text-main)] text-sm">Crear Nota</span>
                    </div>
                </div>
            )}

            {showNew && (
                <NoteModal
                    initial={editing}
                    onSave={handleSave}
                    onClose={() => { setShowNew(false); setEditing(null); }}
                />
            )}
        </main>
    );
}
