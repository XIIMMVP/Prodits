import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore, today } from '../store/useStore';

export default function FocusSession() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useStore();
    const routine = state.routines.find(r => r.id === id);
    const check = state.dailyChecks[today()]?.[id];

    const [running, setRunning] = useState(false);
    const [total, setTotal] = useState(routine ? (routine.focusDuration || 25) * 60 : 0);
    const [remaining, setRemaining] = useState(total);
    const [endTime, setEndTime] = useState(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!routine) {
            navigate('/', { replace: true });
        }
    }, [routine, navigate]);

    // Load from localStorage on mount
    useEffect(() => {
        if (!routine) return;
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
    }, [routine?.id, check?.done]);

    // Timestamp based timer logic
    useEffect(() => {
        if (!routine) return;
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

                    if (!check?.done) {
                        dispatch({ type: 'TOGGLE_TASK', routineId: routine.id });
                    }
                }
            }, 500); // 500ms intervals for better resync
        }
        return () => clearInterval(intervalRef.current);
    }, [running, endTime, dispatch, routine?.id, check?.done]);

    if (!routine) return null;

    const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
    const secs = (remaining % 60).toString().padStart(2, '0');
    const progress = 1 - remaining / total;
    const circumference = 2 * Math.PI * 140;
    const offset = circumference * (1 - progress);

    const toggleTimer = () => {
        if (check?.done) return;
        if (!running) {
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
        <div className="fixed inset-0 bg-[var(--bg-main)] z-[100] flex flex-col pt-10 pb-8 px-6 text-center shadow-2xl animate-slide-up" style={{ paddingTop: 'calc(env(safe-area-inset-top, 20px) + 20px)' }}>
            {/* Header / Back button */}
            <div className="flex items-center justify-between mb-auto">
                <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 ios-shadow flex items-center justify-center active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-xl text-[var(--text-main)]">close</span>
                </button>
                <button onClick={resetTimer} className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 ios-shadow flex items-center justify-center active:scale-95 transition-transform text-[var(--text-secondary)]">
                    <span className="material-symbols-outlined text-xl">restart_alt</span>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center mb-8">
                <div className="flex items-center gap-2 mb-12 bg-white dark:bg-white/5 py-2.5 px-5 rounded-full ios-shadow border border-gray-50/50 dark:border-white/10">
                    <span className="material-symbols-outlined text-xl fill-1" style={{ color: `var(--${routine.color}-500, var(--primary))` }}>{routine.icon}</span>
                    <h2 className="text-xs font-bold tracking-wider uppercase text-[var(--text-main)]">{routine.name}</h2>
                </div>

                <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-8">
                    <svg viewBox="0 0 320 320" className="w-full h-full -rotate-90 drop-shadow-sm">
                        <circle cx="160" cy="160" fill="none" r={140} stroke="var(--border)" strokeWidth={8} />
                        <circle cx="160" cy="160" fill="none" r={140} stroke={check?.done ? '#10b981' : 'var(--primary)'} strokeDasharray={circumference} strokeDashoffset={check?.done ? 0 : offset} strokeLinecap="round" strokeWidth={12} className="transition-all duration-500 opacity-90" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-6xl sm:text-7xl font-bold tracking-tighter ${check?.done ? 'text-emerald-500' : 'text-[var(--text-main)]'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {check?.done ? '✓' : `${mins}:${secs}`}
                        </span>
                    </div>
                </div>

                {check?.done && (
                    <p className="font-bold text-emerald-500 text-lg animate-bounce mt-4">¡Sesión Completada!</p>
                )}
            </div>

            {/* Play/Pause Button */}
            <div className="mt-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}>
                <button
                    onClick={toggleTimer}
                    disabled={check?.done}
                    className={`w-full max-w-sm mx-auto h-16 sm:h-20 rounded-3xl font-bold text-lg sm:text-xl flex items-center justify-center gap-2 sm:gap-3 transition-all active:scale-95 ${check?.done ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
                        running ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' :
                            'bg-[var(--primary)] text-white shadow-lg shadow-blue-500/30'
                        }`}
                >
                    <span className="material-symbols-outlined fill-1 text-2xl sm:text-3xl">
                        {check?.done ? 'check_circle' : running ? 'pause' : 'play_arrow'}
                    </span>
                    {check?.done ? 'Completado' : running ? 'Pausar Enfoque' : 'Iniciar Enfoque'}
                </button>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slideUp 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards;
                }
            `}</style>
        </div>
    );
}
