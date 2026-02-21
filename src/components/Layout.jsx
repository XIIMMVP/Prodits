import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { name: 'Inicio', icon: 'home', path: '/' },
    { name: 'Rutinas', icon: 'calendar_today', path: '/routine' },
    { name: 'Análisis', icon: 'psychology', path: '/insights' },
    { name: 'Diario', icon: 'auto_stories', path: '/journal' },
    { name: 'Ajustes', icon: 'settings', path: '/settings' }
];

export default function Layout({ children }) {
    const location = useLocation();

    return (
        <div className="bg-[var(--bg-main)] min-h-screen min-h-[100dvh] relative font-sans text-[var(--text-main)] overflow-x-hidden">
            {/* Page Content */}
            <div className="w-full flex justify-center pb-28">
                <div className="w-full">
                    {children}
                </div>
            </div>

            {/* iOS App Store-style floating tab bar */}
            <div
                className="fixed bottom-5 left-4 right-4 z-50 flex justify-center"
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
                <nav
                    className="flex items-center justify-center gap-0 w-full max-w-md"
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
                                {/* Active pill background */}
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

                                {/* Content */}
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
        </div>
    );
}
