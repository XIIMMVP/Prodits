import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Layout({ children }) {
    const location = useLocation();

    const navItems = [
        { name: 'Home', icon: 'home', path: '/' },
        { name: 'Schedule', icon: 'calendar_today', path: '/routine' },
        { name: 'Focus', icon: 'psychology', path: '/insights' },
        { name: 'Profile', icon: 'person', path: '/journal' }
    ];

    return (
        <div className="bg-[#FBFBFD] min-h-screen relative font-sans text-slate-900 overflow-x-hidden">
            {/* Page Content */}
            <div className="w-full flex justify-center pb-32">
                <div className="w-full max-w-7xl">
                    {children}
                </div>
            </div>

            {/* Floating Bottom Nav */}
            <div className="fixed bottom-6 w-full flex justify-center z-50 px-4">
                <nav className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full px-6 py-3 flex items-center justify-center gap-6 sm:gap-10">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 transition-all duration-300 relative rounded-xl hover:bg-black/5 p-1",
                                    isActive ? "text-[var(--primary)]" : "text-gray-400 hover:text-gray-600",
                                    "w-14 sm:w-16"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="navBlob"
                                        className="absolute inset-0 bg-blue-50/80 rounded-2xl -z-10"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}

                                <span className={cn(
                                    "material-symbols-outlined text-2xl transition-all",
                                    isActive && "fill-1 font-bold scale-110"
                                )}>
                                    {item.icon}
                                </span>

                                <span className={cn(
                                    "text-[10px] tracking-wide transition-all uppercase",
                                    isActive ? "font-bold" : "font-semibold text-gray-400"
                                )}>
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
