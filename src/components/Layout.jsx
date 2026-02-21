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
            <div className="w-full flex justify-center pb-[88px]">
                <div className="w-full">
                    {children}
                </div>
            </div>

            {/* iOS-style Tab Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                {/* Top hairline border */}
                <div className="h-px bg-black/[0.12]" />

                {/* Bar body with blur */}
                <nav
                    className="flex items-start justify-around"
                    style={{
                        backgroundColor: 'rgba(249, 249, 249, 0.88)',
                        backdropFilter: 'saturate(180%) blur(20px)',
                        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
                        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
                        paddingTop: '6px',
                    }}
                >
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="flex flex-col items-center justify-center pt-[2px] pb-[2px] min-w-[64px] group"
                                style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                                <span
                                    className={`material-symbols-outlined transition-colors duration-200 ${isActive ? 'fill-1' : ''
                                        }`}
                                    style={{
                                        fontSize: '28px',
                                        lineHeight: '30px',
                                        color: isActive ? '#007AFF' : '#8E8E93',
                                    }}
                                >
                                    {item.icon}
                                </span>
                                <span
                                    className="transition-colors duration-200"
                                    style={{
                                        fontSize: '10px',
                                        fontWeight: isActive ? 600 : 500,
                                        letterSpacing: '0.01em',
                                        marginTop: '1px',
                                        color: isActive ? '#007AFF' : '#8E8E93',
                                    }}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
