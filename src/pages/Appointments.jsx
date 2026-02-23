import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProfileAvatar } from '../components/Layout';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Appointments() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

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
                <button className="w-8 h-8 rounded-full bg-blue-50 text-[var(--primary)] flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <span className="material-symbols-outlined text-sm font-bold">add</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-[var(--border)] ios-shadow flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-gray-300">event_busy</span>
                </div>
                <p className="font-bold text-gray-600 mb-1">Día libre</p>
                <p className="text-xs text-gray-400">No tienes citas programadas para esta fecha.</p>
            </div>
        </main>
    );
}
