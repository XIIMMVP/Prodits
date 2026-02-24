import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProfileAvatar } from '../components/Layout';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStore } from '../store/useStore';
import { useSwipeToClose } from '../hooks/useSwipeToClose';

// ─── Appointment Form ─────────────────────────────────────────
function AppointmentForm({ initial, selectedDate, onSave, onCancel }) {
    const [form, setForm] = useState(initial || {
        title: '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: '09:00',
        description: ''
    });

    const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
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
                <div className="sticky top-0 z-10 bg-[var(--bg-main)] pt-3 pb-3 px-5 sm:px-6 cursor-grab active:cursor-grabbing touch-none" {...handlers}>
                    <div className="w-12 h-1.5 rounded-full bg-gray-200/80 mx-auto mb-4" />
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">{initial ? 'Editar Cita' : 'Nueva Cita'}</h2>
                        <button onClick={onCancel} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto px-4 sm:px-6 py-2">
                    {/* Title */}
                    <div className="mb-5">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Título</label>
                        <input
                            value={form.title}
                            onChange={e => update('title', e.target.value)}
                            placeholder="ej. Dentista, Reunión..."
                            className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                        />
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Fecha</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={e => update('date', e.target.value)}
                                className="w-full h-12 border border-[var(--border)] rounded-2xl px-4 text-sm outline-none bg-white"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Hora</label>
                            <input
                                type="time"
                                value={form.time}
                                onChange={e => update('time', e.target.value)}
                                className="w-full h-12 border border-[var(--border)] rounded-2xl px-4 text-sm outline-none bg-white"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-5">
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Descripción (Opcional)</label>
                        <textarea
                            value={form.description}
                            onChange={e => update('description', e.target.value)}
                            placeholder="Notas detalles..."
                            className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20 resize-none h-24"
                        />
                    </div>

                    <div className="flex gap-3 pt-4 pb-8">
                        <button onClick={onCancel} className="flex-1 py-4 rounded-2xl bg-gray-100 text-[var(--text-secondary)] font-bold">Cancelar</button>
                        <button
                            onClick={() => { if (form.title.trim() && form.date) onSave(form); }}
                            className="flex-1 py-4 rounded-2xl bg-[var(--primary)] text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
                        >
                            {initial ? 'Guardar' : 'Crear'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Appointments() {
    const { state, dispatch } = useStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const appointments = state.appointments || [];
    const dayAppointments = appointments.filter(a => a.date === format(selectedDate, 'yyyy-MM-dd')).sort((a, b) => a.time.localeCompare(b.time));

    const handleSave = (form) => {
        if (editing) {
            dispatch({ type: 'UPDATE_APPOINTMENT', id: editing.id, data: form });
        } else {
            dispatch({ type: 'ADD_APPOINTMENT', appointment: form });
        }
        setFormOpen(false);
        setEditing(null);
    };

    const handleDelete = (id) => {
        dispatch({ type: 'DELETE_APPOINTMENT', id });
        setDeleteConfirm(null);
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const onDateClick = (day) => {
        setSelectedDate(day);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold capitalize">
                    {format(currentDate, 'MMMM yyyy', { locale: es })}
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button onClick={nextMonth} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const dateFormat = 'EEEE';
        const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Comienza en Lunes

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-center font-bold text-[10px] text-[var(--text-secondary)] uppercase tracking-wider pb-4">
                    {format(addDays(startDate, i), dateFormat, { locale: es }).substring(0, 3)}
                </div>
            );
        }
        return <div className="grid grid-cols-7 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());

                days.push(
                    <div
                        key={day}
                        onClick={() => onDateClick(cloneDay)}
                        className={`aspect-square flex items-center justify-center relative cursor-pointer group`}
                    >
                        <div className={`w-10 h-10 flex items-center justify-center rounded-2xl text-sm font-semibold transition-all
              ${!isCurrentMonth ? 'text-gray-300' : 'text-[var(--text-main)]'}
              ${isSelected ? 'bg-[var(--primary)] text-white shadow-md shadow-blue-500/30 ring-2 ring-[var(--primary)] ring-offset-2' : 'hover:bg-gray-50'}
              ${isToday && !isSelected ? 'bg-blue-50 text-[var(--primary)]' : ''}
            `}>
                            {formattedDate}
                        </div>

                        {/* Indicador de evento */}
                        {appointments.some(a => a.date === format(cloneDay, 'yyyy-MM-dd')) && (
                            <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                        )}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div key={day} className="grid grid-cols-7 gap-y-2 mb-2">
                    {days}
                </div>
            );
            days = [];
        }
        return <div>{rows}</div>;
    };

    return (
        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-10">
            <header className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-[var(--primary)] text-xs font-bold tracking-widest uppercase mb-1 block">Gestión</span>
                        <div className="flex items-end gap-3">
                            <Link to="/routine" className="text-xl sm:text-2xl font-bold tracking-tight text-gray-300 hover:text-gray-400 transition-colors mb-0.5 sm:mb-1">Rutinas</Link>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-main)]">Citas</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ProfileAvatar />
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 ios-shadow border border-[var(--border)] mb-8">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>

            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">
                    {isSameDay(selectedDate, new Date())
                        ? 'Citas para Hoy'
                        : `Citas del ${format(selectedDate, 'd MMM', { locale: es })}`}
                </h3>
                <button onClick={() => { setEditing(null); setFormOpen(true); }} className="w-8 h-8 rounded-full bg-blue-50 text-[var(--primary)] flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <span className="material-symbols-outlined text-sm font-bold">add</span>
                </button>
            </div>

            {dayAppointments.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-8 border border-[var(--border)] ios-shadow flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl text-[var(--primary)]">event_busy</span>
                    </div>
                    <p className="font-bold text-gray-600 mb-1">Día libre</p>
                    <p className="text-xs text-gray-400">No tienes citas programadas para esta fecha.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {dayAppointments.map(appt => (
                        <div key={appt.id} className="relative overflow-hidden rounded-2xl group bg-white ios-shadow border border-[var(--border)]">
                            <div className="absolute right-0 top-0 bottom-0 flex items-center gap-1 pr-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 hidden md:flex">
                                <button onClick={() => { setEditing(appt); setFormOpen(true); }} className="w-10 h-10 rounded-xl bg-blue-50 text-[var(--primary)] flex items-center justify-center hover:bg-blue-100 transition-colors">
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                                <button onClick={() => setDeleteConfirm(appt)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>

                            <div className="p-4 sm:p-5 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex flex-col items-center justify-center text-[var(--primary)] flex-shrink-0">
                                        <span className="text-xs font-bold leading-none mb-0.5">{appt.time.split(':')[0]}</span>
                                        <span className="text-[10px] uppercase font-semibold leading-none opacity-80">{appt.time.split(':')[1]}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-base font-semibold truncate leading-tight mb-1">{appt.title}</h3>
                                        {appt.description && (
                                            <p className="text-xs text-[var(--text-secondary)] truncate">{appt.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex md:hidden gap-1 pl-2">
                                    <button onClick={() => { setEditing(appt); setFormOpen(true); }} className="w-8 h-8 rounded-full bg-blue-50 text-[var(--primary)] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button onClick={() => setDeleteConfirm(appt)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* FAB */}
            <button
                onClick={() => { setEditing(null); setFormOpen(true); }}
                className="fixed bottom-32 right-6 sm:right-8 w-14 h-14 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all z-40"
            >
                <span className="material-symbols-outlined text-3xl">add</span>
            </button>

            {/* Form */}
            {formOpen && (
                <AppointmentForm
                    initial={editing}
                    selectedDate={selectedDate}
                    onSave={handleSave}
                    onCancel={() => { setFormOpen(false); setEditing(null); }}
                />
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 leading-none" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm ios-shadow text-center" onClick={e => e.stopPropagation()}>
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl text-red-500">delete_forever</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1 leading-normal">¿Eliminar "{deleteConfirm.title}"?</h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-6 leading-normal">Esta acción no se puede deshacer.</p>
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
