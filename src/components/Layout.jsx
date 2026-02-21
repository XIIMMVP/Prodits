import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '../store/AuthContext';
import Settings from '../pages/Settings';

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
                    className="fixed bottom-5 left-4 right-4 z-50 flex justify-center"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
                >
                    <nav
                        className="flex items-center justify-center gap-0 w-full max-w-sm"
                        style={{
                            backgroundColor: 'rgba(245, 245, 247, 0.82)',
                            backdropFilter: 'saturate(180%) blur(20px)',
                            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
                            borderRadius: '40px',
                            padding: '6px 6px',
                            boxShadow: '0 2px 20px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)',
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
                            backgroundColor: 'rgba(0,0,0,0.55)',
                            backdropFilter: 'blur(6px)',
                            WebkitBackdropFilter: 'blur(6px)',
                        }}
                        onClick={() => setSettingsOpen(false)}
                    >
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-[var(--bg-main)] rounded-t-[2rem] overflow-hidden animate-slide-up"
                            style={{ height: '93vh', height: '93dvh' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="sticky top-0 z-10 bg-[var(--bg-main)] pt-3 pb-2 px-5">
                                <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mb-3" />
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold">Cuenta</h2>
                                    <button
                                        onClick={() => setSettingsOpen(false)}
                                        className="w-8 h-8 rounded-full bg-gray-200/70 flex items-center justify-center"
                                    >
                                        <span className="material-symbols-outlined text-lg text-gray-600">close</span>
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-y-auto overflow-x-hidden" style={{ height: 'calc(93vh - 80px)', height: 'calc(93dvh - 80px)' }}>
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
