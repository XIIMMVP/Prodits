import { Link } from 'react-router-dom';

export default function Insights() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#FBFBFD] text-[#1D1D1F]">
            <header className="flex items-center justify-between border-b border-[#E5E5EA] px-8 py-3 sticky top-0 apple-blur z-50">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-black rounded-[9px] flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-lg font-light">insights</span>
                        </div>
                        <h1 className="text-lg font-semibold tracking-tight">Performance</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-7">
                        <Link to="/" className="text-[#86868B] hover:text-black transition-colors text-sm font-medium">Dashboard</Link>
                        <Link to="/insights" className="text-black border-b-2 border-black py-4 -mb-4 text-sm font-semibold">Insights</Link>
                        <Link to="/routine" className="text-[#86868B] hover:text-black transition-colors text-sm font-medium">Schedule</Link>
                        <Link to="/journal" className="text-[#86868B] hover:text-black transition-colors text-sm font-medium">Journal</Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1 px-4 md:px-8 py-12 max-w-7xl mx-auto w-full pb-32 md:pb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#86868B] mb-2 block">Metrics Overview</span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F]">Predictive Insights</h2>
                        <p className="text-[#86868B] mt-3 text-lg font-medium">Mental clarity and performance patterns for this cycle.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E5E5EA] bg-white hover:bg-gray-50 transition-all font-semibold text-sm shadow-sm">
                            <span className="material-symbols-outlined text-lg">calendar_month</span>
                            Last 30 Days
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-10 rounded-3xl flex flex-col items-center text-center shadow-sm border border-[#E5E5EA]/50">
                        <div className="relative w-44 h-44 mb-6">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle className="stroke-[#F5F5F7]" cx="18" cy="18" fill="none" r="15.5" strokeWidth="3" />
                                <circle className="stroke-[#34C759]" cx="18" cy="18" fill="none" r="15.5" strokeDasharray="82, 100" strokeLinecap="round" strokeWidth="3" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-[#1D1D1F]">82</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#86868B]">Vitality</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-[#1D1D1F] mb-1">Health</h3>
                        <p className="text-[#34C759] font-semibold text-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm font-bold">trending_up</span> +2% vs yesterday
                        </p>
                    </div>

                    <div className="bg-white p-10 rounded-3xl flex flex-col items-center text-center shadow-sm border border-[#E5E5EA]/50">
                        <div className="relative w-44 h-44 mb-6">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle className="stroke-[#F5F5F7]" cx="18" cy="18" fill="none" r="15.5" strokeWidth="3" />
                                <circle className="stroke-[#007AFF]" cx="18" cy="18" fill="none" r="15.5" strokeDasharray="95, 100" strokeLinecap="round" strokeWidth="3" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-[#1D1D1F]">95</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#86868B]">Clarity</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-[#1D1D1F] mb-1">Mind</h3>
                        <p className="text-[#34C759] font-semibold text-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm font-bold">trending_up</span> +5% vs yesterday
                        </p>
                    </div>

                    <div className="bg-white p-10 rounded-3xl flex flex-col items-center text-center shadow-sm border border-[#E5E5EA]/50">
                        <div className="relative w-44 h-44 mb-6">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle className="stroke-[#F5F5F7]" cx="18" cy="18" fill="none" r="15.5" strokeWidth="3" />
                                <circle className="stroke-[#FF9500]" cx="18" cy="18" fill="none" r="15.5" strokeDasharray="78, 100" strokeLinecap="round" strokeWidth="3" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-[#1D1D1F]">78</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#86868B]">Presence</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-[#1D1D1F] mb-1">Home</h3>
                        <p className="text-[#FF3B30] font-semibold text-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm font-bold">trending_down</span> -1% vs yesterday
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
                    <div className="lg:col-span-3 apple-blur rounded-3xl p-10 relative overflow-hidden flex flex-col shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-11 w-11 rounded-xl bg-[#007AFF]/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#007AFF] font-light">psychology_alt</span>
                            </div>
                            <span className="font-bold text-sm tracking-tight text-[#007AFF] uppercase">Proactive Insight</span>
                        </div>
                        <p className="text-2xl font-medium leading-snug text-[#1D1D1F] mb-10 max-w-lg">
                            "You usually miss <span className="bg-[#007AFF]/5 px-1 rounded text-[#007AFF] font-semibold underline decoration-[#007AFF] decoration-2 underline-offset-4">reading sessions</span> on Thursday afternoons. Move it to the morning?"
                        </p>
                        <div className="flex flex-wrap gap-4 mt-auto">
                            <button className="bg-[#007AFF] text-white px-8 py-3.5 rounded-2xl font-semibold transition-all shadow-lg hover:scale-[1.02]">
                                Accept Suggestion
                            </button>
                        </div>
                    </div>
                </div>

                <nav className="fixed md:hidden bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[400px] z-50">
                    <div className="apple-blur rounded-[2.5rem] p-2 flex items-center justify-around deep-shadow border border-white/40">
                        <Link to="/" className="flex flex-col items-center justify-center w-14 h-14 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="material-symbols-outlined">space_dashboard</span>
                        </Link>
                        <Link to="/routine" className="flex flex-col items-center justify-center w-14 h-14 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="material-symbols-outlined">calendar_today</span>
                        </Link>
                        <Link to="/insights" className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined">bar_chart</span>
                        </Link>
                        <Link to="/journal" className="flex flex-col items-center justify-center w-14 h-14 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="material-symbols-outlined">photo_camera</span>
                        </Link>
                    </div>
                </nav>
            </main>
        </div>
    );
}
