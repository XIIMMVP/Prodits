import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { useAuth } from '../store/AuthContext';
import Settings from '../pages/Settings';
import { useSwipeToClose } from '../hooks/useSwipeToClose';

// ─── Settings Sheet Context ─────────────────────────────────
const SettingsSheetContext = createContext();
export function useSettingsSheet() {
    return useContext(SettingsSheetContext);
}

const navItems = [
    { name: 'Inicio', icon: 'home', path: '/' },
    { name: 'Rutinas', icon: 'calendar_today', path: '/routine' },
    { name: 'Análisis', icon: 'psychology', path: '/insights' },
    { name: 'Diario', icon: 'auto_stories', path: '/journal' },
];

export default function Layout({ children }) {
    const location = useLocation();
    const { user } = useAuth();
    const [settingsOpen, setSettingsOpen] = useState(false);

    // Swipe to close logic
    const { dragY, handlers, resetDrag } = useSwipeToClose(() => setSettingsOpen(false));

    // Reset drag when sheet opens/closes
    useEffect(() => {
        if (!settingsOpen) resetDrag();
    }, [settingsOpen]);

    // Lock body scroll when settings sheet is open
    useEffect(() => {
        if (settingsOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [settingsOpen]);

    // Context value for child pages
    const settingsCtx = {
        openSettings: () => setSettingsOpen(true),
        user,
    };

    return (
        <SettingsSheetContext.Provider value={settingsCtx}>
            <div className="bg-[var(--bg-main)] min-h-screen min-h-[100dvh] relative font-sans text-[var(--text-main)] overflow-x-hidden">
                {/* Page Content */}
                <div className="w-full flex justify-center pb-28">
                    <div className="w-full">
                        {children}
                    </div>
                </div>

                {/* iOS-style floating tab bar — 4 items */}
                <div
                    className="fixed bottom-1 left-4 right-4 z-50 flex justify-center"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
                >
                    <nav
                        className="flex items-center justify-center gap-0 w-full max-w-sm"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            backdropFilter: 'blur(10px) saturate(160%)', // Un poco más de blur para el volumen de gota
                            WebkitBackdropFilter: 'blur(10px) saturate(160%)',
                            borderRadius: '40px',
                            padding: '6px 6px',
                            // Efecto de Gota de Agua / Liquid Glass:
                            // 1. Sombra exterior suave
                            // 2. Borde de brillo superior (highlight)
                            // 3. Refracción interna (inset)
                            boxShadow: `
                                0 4px 24px -1px rgba(0, 0, 0, 0.1), 
                                0 10px 30px -5px rgba(0, 0, 0, 0.05),
                                inset 0 1px 1.5px 0.5px rgba(255, 255, 255, 0.5),
                                inset 0 -1px 2px rgba(0, 0, 0, 0.05)
                            `,
                            border: '0.5px solid rgba(255, 255, 255, 0.15)',
                        }}
                    >
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="flex flex-col items-center justify-center relative"
                                    style={{
                                        WebkitTapHighlightColor: 'transparent',
                                        flex: '1 1 0%',
                                        minWidth: 0,
                                    }}
                                >
                                    {isActive && (
                                        <div
                                            className="absolute inset-[2px]"
                                            style={{
                                                borderRadius: '34px',
                                                background: 'rgba(255,255,255,0.75)',
                                                boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.02)',
                                            }}
                                        />
                                    )}
                                    <div className="relative z-10 flex flex-col items-center py-[7px]">
                                        <span
                                            className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}
                                            style={{
                                                fontSize: '26px',
                                                lineHeight: 1,
                                                color: isActive ? '#007AFF' : '#1C1C1E',
                                                transition: 'color 0.2s ease',
                                            }}
                                        >
                                            {item.icon}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: '10px',
                                                fontWeight: isActive ? 600 : 500,
                                                letterSpacing: '0.01em',
                                                marginTop: '2px',
                                                color: isActive ? '#007AFF' : '#1C1C1E',
                                                transition: 'color 0.2s ease',
                                            }}
                                        >
                                            {item.name}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Settings Bottom Sheet */}
                {settingsOpen && (
                    <div
                        className="fixed z-[90]"
                        style={{
                            top: '-env(safe-area-inset-top, 0px)',
                            left: 0, right: 0, bottom: 0,
                            paddingTop: 'env(safe-area-inset-top, 0px)',
                            backgroundColor: 'transparent',
                        }}
                        onClick={() => setSettingsOpen(false)}
                    >
                        <div
                            className={`absolute bottom-0 left-0 right-0 bg-[var(--bg-main)] rounded-t-[2.5rem] overflow-hidden ${dragY > 0 ? '' : 'animate-slide-up'}`}
                            style={{
                                maxHeight: '90vh',
                                maxHeight: '90dvh',
                                transform: `translateY(${dragY}px)`,
                                transition: dragY > 0 ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div
                                className="sticky top-0 z-10 bg-[var(--bg-main)] pt-3 pb-3 px-5 cursor-grab active:cursor-grabbing touch-none"
                                {...handlers}
                            >
                                <div className="w-12 h-1.5 rounded-full bg-gray-200/80 mx-auto mb-4" />
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold">Cuenta</h2>
                                    <button
                                        onClick={() => setSettingsOpen(false)}
                                        className="w-8 h-8 rounded-full bg-gray-200/70 flex items-center justify-center active:scale-95 transition-transform"
                                    >
                                        <span className="material-symbols-outlined text-lg text-gray-600">close</span>
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(90vh - 100px)', maxHeight: 'calc(90dvh - 100px)' }}>
                                <Settings />
                            </div>
                        </div>
                    </div>
                )}

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
        </SettingsSheetContext.Provider>
    );
}

// ─── Reusable Profile Avatar Button ─────────────────────────
export function ProfileAvatar({ className = '' }) {
    const { openSettings, user } = useSettingsSheet();
    const userInitial = (user?.user_metadata?.full_name || user?.email || 'P')[0].toUpperCase();
    const userPhoto = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

    return (
        <button
            onClick={openSettings}
            className={`w-9 h-9 rounded-full overflow-hidden shadow-sm border-2 border-white/80 active:scale-90 transition-transform flex-shrink-0 ${className}`}
        >
            {userPhoto ? (
                <img
                    src={userPhoto}
                    alt="Perfil"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white text-sm font-bold">
                    {userInitial}
                </div>
            )}
        </button>
    );
}
