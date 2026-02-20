import { Link } from 'react-router-dom';

export default function Dashboard() {
    return (
        <div className="text-slate-900 min-h-screen flex justify-center overflow-x-hidden">
            <main className="w-full max-w-[480px] min-h-screen relative flex flex-col pb-32 bg-white">
                <header className="sticky top-0 z-30 px-6 pt-12 pb-6 apple-blur border-b border-black/[0.03]">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Monday, May 22</p>
                            <h1 className="text-3xl font-bold tracking-tight text-black">Today</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emergency/20 bg-emergency/10 text-emergency text-xs font-semibold transition-all active:scale-95">
                                <span className="w-2 h-2 rounded-full bg-emergency"></span>
                                Emergency
                            </button>
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-black/5 shadow-sm">
                                <img alt="Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL3aOu6IA_E5k2bPGBTMwRGrgOw9yztlmwwUkZEXSxPfEMU9amVIUoAGEldQyLt22-C6aNUHN2t_xi8AFdw08BtDrlWOEMuw-JtfzaEojLyDookEOPnBiiUAkXJ0FRO83b9wrjCZ6n5rVG-STNvMwfwRiwUUIW8g46FxCbGSGPf4P6v0nQ8IDgpy5hpBFZkZqio3S8K2F3bSAD1c2AQZ4g22-XYrIVUGWX8abl3lglPVAn7NBsWvddjqSakASD9XsZTWChNV_AkzC5" />
                            </div>
                        </div>
                    </div>
                </header>

                <section className="px-6 mt-8 mb-10">
                    <div className="container-bg rounded-[2.5rem] p-6 deep-shadow">
                        <h2 className="text-xs font-semibold text-slate-400 mb-5 text-center uppercase tracking-wider">How do you feel today?</h2>
                        <div className="flex justify-between items-center px-2">
                            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-50 shadow-sm text-2xl transition-all">😔</button>
                            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-50 shadow-sm text-2xl transition-all">😐</button>
                            <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25 text-3xl transition-all transform scale-110">😊</button>
                            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-50 shadow-sm text-2xl transition-all">🤩</button>
                            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white hover:bg-slate-50 shadow-sm text-2xl transition-all">🔥</button>
                        </div>
                    </div>
                </section>

                <div className="px-6 space-y-12">
                    <section className="relative">
                        <div className="absolute left-3 top-8 bottom-0 w-[1px] bg-slate-100"></div>
                        <div className="flex items-center gap-4 mb-6 relative">
                            <div className="w-6 h-6 rounded-full bg-white border-2 border-primary z-10 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                            </div>
                            <h3 className="text-lg font-bold text-black">Morning</h3>
                        </div>
                        <div className="ml-10">
                            <div className="task-card rounded-3xl p-5 border-l-4 border-l-primary relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">Non-Negotiable</span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        <span className="material-icons-round text-slate-300">radio_button_unchecked</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1">Deep Work: Architecture Design</h4>
                                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                            <span className="material-icons-round text-xs">schedule</span>
                                            09:00 - 11:30 AM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="relative">
                        <div className="absolute left-3 top-8 bottom-0 w-[1px] bg-slate-100"></div>
                        <div className="flex items-center gap-4 mb-6 relative">
                            <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-200 z-10"></div>
                            <h3 className="text-lg font-bold text-black">Afternoon</h3>
                        </div>
                        <div className="ml-10 space-y-4">
                            <div className="container-bg rounded-[2rem] p-6 deep-shadow relative overflow-hidden">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h4 className="font-bold text-slate-800">Focus Timer</h4>
                                        <p className="text-xs font-medium text-slate-400">Project Sync Prep</p>
                                    </div>
                                    <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                                        <span className="material-icons-round text-white">play_arrow</span>
                                    </button>
                                </div>
                                <div className="flex items-center justify-center py-2">
                                    <div className="relative w-32 h-32 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle className="text-white" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="6" />
                                            <circle className="text-primary transition-all duration-1000" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364" strokeDashoffset="120" strokeLinecap="round" strokeWidth="6" />
                                        </svg>
                                        <span className="absolute text-2xl font-bold tracking-tight text-slate-800">25:00</span>
                                    </div>
                                </div>
                            </div>
                            <div className="task-card rounded-2xl p-4 flex items-center gap-4">
                                <span className="material-icons-round text-slate-300">radio_button_unchecked</span>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-700">Team Sync & Feedback</h4>
                                    <p className="text-[11px] font-medium text-slate-400">02:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[400px] z-50">
                    <div className="apple-blur rounded-[2.5rem] p-2 flex items-center justify-around deep-shadow border border-white/40">
                        <Link to="/" className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/20">
                            <span className="material-icons-round">space_dashboard</span>
                        </Link>
                        <Link to="/routine" className="flex flex-col items-center justify-center w-14 h-14 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="material-icons-round">calendar_today</span>
                        </Link>
                        <Link to="/insights" className="flex flex-col items-center justify-center w-14 h-14 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="material-icons-round">bar_chart</span>
                        </Link>
                        <Link to="/journal" className="flex flex-col items-center justify-center w-14 h-14 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="material-icons-round">photo_camera</span>
                        </Link>
                    </div>
                </nav>
            </main>
        </div>
    );
}
