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
    { id: 'home', name: 'Inicio', icon: 'home', path: '/' },
    { id: 'management', name: 'Rutinas', icon: 'calendar_today', path: '/routine' },
    { id: 'insights', name: 'Análisis', icon: 'psychology', path: '/insights' },
    { id: 'journal', name: 'Diario', icon: 'auto_stories', path: '/journal' },
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

    // Track last management path
    useEffect(() => {
        if (location.pathname === '/routine' || location.pathname === '/appointments') {
            localStorage.setItem('lastManagementPath', location.pathname);
        }
    }, [location.pathname]);

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
                    <nav className="flex items-center justify-center gap-0 w-full max-w-sm glass-nav rounded-[40px] p-1.5 border border-[var(--border)] ios-shadow">
                        {navItems.map((item) => {
                            let isActive = location.pathname === item.path;
                            let name = item.name;
                            let path = item.path;
                            let icon = item.icon;

                            if (item.id === 'management') {
                                const lastPath = localStorage.getItem('lastManagementPath') || '/routine';

                                if (location.pathname === '/routine' || location.pathname === '/appointments') {
                                    isActive = true;
                                    if (location.pathname === '/appointments') {
                                        name = 'Citas';
                                        path = '/appointments';
                                        icon = 'event';
                                    }
                                } else {
                                    if (lastPath === '/appointments') {
                                        name = 'Citas';
                                        path = '/appointments';
                                        icon = 'event';
                                    }
                                }
                            }

                            return (
                                <Link
                                    key={item.id}
                                    to={path}
                                    className="flex flex-col items-center justify-center relative"
                                    style={{
                                        WebkitTapHighlightColor: 'transparent',
                                        flex: '1 1 0%',
                                        minWidth: 0,
                                    }}
                                >
                                    {isActive && (
                                        <div className="absolute inset-[2px] rounded-[34px] bg-[var(--card-bg)] shadow-sm shadow-black/5" />
                                    )}
                                    <div className="relative z-10 flex flex-col items-center py-[7px]">
                                        <span
                                            className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}
                                            style={{
                                                fontSize: '26px',
                                                lineHeight: 1,
                                                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                                transition: 'color 0.2s ease',
                                            }}
                                        >
                                            {icon}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: '10px',
                                                fontWeight: isActive ? 600 : 500,
                                                letterSpacing: '0.01em',
                                                marginTop: '2px',
                                                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                                transition: 'color 0.2s ease',
                                            }}
                                        >
                                            {name}
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
                                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
                                    >
                                        <span className="material-symbols-outlined text-lg text-gray-600 dark:text-gray-200">close</span>
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(90dvh - 100px)' }}>
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
