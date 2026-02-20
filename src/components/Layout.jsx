import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { name: 'Inicio', icon: 'home', path: '/' },
    { name: 'Rutinas', icon: 'calendar_today', path: '/routine' },
    { name: 'Análisis', icon: 'psychology', path: '/insights' },
    { name: 'Perfil', icon: 'person', path: '/journal' }
];

export default function Layout({ children }) {
    const location = useLocation();

    return (
        <div className="bg-[var(--bg-main)] min-h-screen relative font-sans text-[var(--text-main)] overflow-x-hidden">
            {/* Page Content */}
            <div className="w-full flex justify-center pb-28">
                <div className="w-full">
                    {children}
                </div>
            </div>

            {/* Floating Bottom Nav */}
            <div className="fixed bottom-5 w-full flex justify-center z-50 px-4">
                <nav className="ios-glass border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full px-5 py-2.5 flex items-center justify-center gap-4 sm:gap-8">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-300 relative rounded-2xl px-3 py-1.5 ${isActive
                                    ? 'text-[var(--primary)] bg-blue-50/80'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-black/5'
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[22px] transition-all ${isActive ? 'fill-1 scale-105' : ''}`}>
                                    {item.icon}
                                </span>
                                <span className={`text-[9px] tracking-wider uppercase ${isActive ? 'font-bold' : 'font-semibold'}`}>
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
