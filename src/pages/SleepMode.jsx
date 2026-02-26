import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, today } from '../store/useStore';

export default function SleepMode() {
    const navigate = useNavigate();
    const { state, dispatch } = useStore();
    const [startTime, setStartTime] = useState(null);
    const [wakeTime, setWakeTime] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        // Forzar dark mode inmersivo y ocultar barras de scroll
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#0a0a0f';
        document.documentElement.style.backgroundColor = '#0a0a0f';

        // Modificar el meta tag theme-color para la barra de estado superior de iOS/Android
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        let oldThemeColor = '';
        if (metaThemeColor) {
            oldThemeColor = metaThemeColor.getAttribute('content');
            metaThemeColor.setAttribute('content', '#0a0a0f');
        }

        return () => {
            const stored = JSON.parse(localStorage.getItem('prodits_settings') || '{}');
            if (stored.theme !== 'oscuro') {
                if (stored.theme === 'sistema') {
                    if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        document.documentElement.classList.remove('dark');
                    }
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
            document.body.style.backgroundColor = '';
            document.documentElement.style.backgroundColor = '';
            if (metaThemeColor && oldThemeColor) {
                metaThemeColor.setAttribute('content', oldThemeColor);
            }
        };
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('prodits_sleep_start');
        const now = Date.now();
        if (!saved) {
            localStorage.setItem('prodits_sleep_start', now.toString());
            setStartTime(now);
            setWakeTime(now);
        } else {
            setStartTime(parseInt(saved, 10));
            setWakeTime(now);
        }
    }, []);

    const svgRef = useRef(null);
    const prevAngleRef = useRef(0);

    const getAngle = (clientX, clientY) => {
        if (!svgRef.current) return 0;
        const rect = svgRef.current.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const x = clientX - rect.left - cx;
        const y = clientY - rect.top - cy;
        let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
        if (angle < 0) angle += 360;
        return angle;
    };

    const handlePointerDown = (e) => {
        if (e.target.closest('button')) return;
        setIsDragging(true);
        prevAngleRef.current = getAngle(e.clientX, e.clientY);
        e.target.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;
        const currentAngle = getAngle(e.clientX, e.clientY);
        let delta = currentAngle - prevAngleRef.current;

        // Wrap around handling 
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        if (Math.abs(delta) > 0.5) {
            // Un giro entero = 12 horas -> 360 deg = 720 mins -> 1 deg = 2 mins
            const msChange = delta * 2 * 60 * 1000;
            setWakeTime(prev => {
                let next = prev + msChange;
                // Minimo tiempo durmiendo = 0
                if (next < startTime) next = startTime;
                // Maximo let's cap at 24 hours just in case
                if (next > startTime + 24 * 3600000) next = startTime + 24 * 3600000;
                return next;
            });
            prevAngleRef.current = currentAngle;
        }
    };

    const handlePointerUp = (e) => {
        setIsDragging(false);
        e.target.releasePointerCapture(e.pointerId);
    };

    const cancelSleep = () => {
        localStorage.removeItem('prodits_sleep_start');
        navigate('/', { replace: true });
    };

    const finishSleep = () => {
        const durationHours = (wakeTime - startTime) / 3600000;

        dispatch({
            type: 'LOAD_STATE',
            state: {
                ...state,
                dailyChecks: {
                    ...state.dailyChecks,
                    [today()]: {
                        ...state.dailyChecks[today()],
                        sleepDuration: durationHours,
                        sleepEnd: wakeTime,
                        sleepStart: startTime
                    }
                }
            }
        });

        localStorage.removeItem('prodits_sleep_start');
        navigate('/', { replace: true });
    };

    // Helper functions para afinar el tiempo con botones + / - rápidos sin el anillo
    const adjustTime = (mins) => {
        setWakeTime(prev => {
            let next = prev + mins * 60000;
            if (next < startTime) next = startTime;
            return next;
        });
    };

    if (!startTime || !wakeTime) return null;

    const diffMs = wakeTime - startTime;
    const hours = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);

    // Representamos maximo 12 horas de llenado. Si excede 12h, el circulo se llena 100%.
    const maxScaleMs = 12 * 3600000;
    const ringProgress = Math.min(diffMs / maxScaleMs, 1);
    const circumference = 2 * Math.PI * 130;
    const offset = circumference * (1 - ringProgress);

    const fStart = new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fWake = new Date(wakeTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="fixed inset-0 bg-[#0a0a0f] text-white z-[100] flex flex-col pt-10 pb-8 px-6 animate-fade-in text-center overflow-hidden"
            style={{ paddingTop: 'calc(env(safe-area-inset-top, 20px) + 20px)', touchAction: 'none', overscrollBehavior: 'none' }}>

            {/* Nav Header */}
            <div className="flex items-center justify-between mb-auto">
                <button onClick={cancelSleep} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 active:scale-95 transition-transform text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white">
                    Cancelar
                </button>
                <div className="flex items-center gap-2 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
                    <span className="material-symbols-outlined text-indigo-400 text-sm">bedtime</span>
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">En Reposo</span>
                </div>
            </div>

            {/* Timestamps */}
            <div className="mt-8 mb-4">
                <div className="flex justify-center items-center gap-8 px-8">
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Dormir</p>
                        <p className="text-3xl font-light text-gray-100">{fStart}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Despertar</p>
                        <p className="text-3xl font-bold">{fWake}</p>
                    </div>
                </div>
            </div>

            {/* Circular Slider Ring */}
            <div
                className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto my-6 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                {/* SVG Ring rotated -90deg */}
                <svg ref={svgRef} viewBox="0 0 320 320" className="w-full h-full -rotate-90 drop-shadow-2xl">
                    <circle cx="160" cy="160" r="130" fill="none" stroke="#1c1c24" strokeWidth="24" />
                    <circle cx="160" cy="160" r="130" fill="none" stroke="#6366f1" strokeWidth="24" strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className={isDragging ? '' : 'transition-all duration-300'}
                    />
                    {/* Thumb / Handle inside SVG coordinating system */}
                    {/* cos(0) y sin(0) es la derecha, pero como esta rotado es ARRIBA */}
                    <circle
                        cx={160 + 130 * Math.cos(ringProgress * 2 * Math.PI)}
                        cy={160 + 130 * Math.sin(ringProgress * 2 * Math.PI)}
                        r="18" fill="#ffffff" className={`drop-shadow-lg ${isDragging ? '' : 'transition-all duration-300'}`}
                    />
                    <circle
                        cx={160 + 130 * Math.cos(ringProgress * 2 * Math.PI)}
                        cy={160 + 130 * Math.sin(ringProgress * 2 * Math.PI)}
                        r="6" fill="#6366f1" className={isDragging ? '' : 'transition-all duration-300'}
                    />
                </svg>

                {/* Center Core */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1">Total</p>
                    <div className="flex items-baseline gap-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        <span className="text-5xl font-bold">{hours}</span><span className="text-xl font-bold text-gray-500">h</span>
                        <span className="text-5xl font-bold ml-1">{mins.toString().padStart(2, '0')}</span><span className="text-xl font-bold text-gray-500">m</span>
                    </div>
                </div>
            </div>

            {/* Fine controls */}
            <div className="flex justify-center gap-4 mb-auto">
                <button onClick={() => adjustTime(-15)} className="px-5 py-2.5 rounded-2xl bg-white/5 active:bg-white/10 transition-colors font-bold text-gray-400 hover:text-white">- 15m</button>
                <button onClick={() => adjustTime(15)} className="px-5 py-2.5 rounded-2xl bg-white/5 active:bg-white/10 transition-colors font-bold text-gray-400 hover:text-white">+ 15m</button>
            </div>

            {/* Bottom Finalize Button */}
            <div className="mt-8 w-full" style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}>
                <p className="text-xs text-gray-500 mb-6">Desliza el anillo para ajustar a qué hora despertaste de forma guiada.</p>
                <button
                    onClick={finishSleep}
                    className="w-full max-w-sm mx-auto h-16 sm:h-20 rounded-3xl font-bold text-lg sm:text-xl flex items-center justify-center gap-3 transition-all active:scale-95 bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400"
                >
                    <span className="material-symbols-outlined text-2xl sm:text-3xl">wb_sunny</span>
                    Registrar Despertar
                </button>
            </div>
        </div>
    );
}
