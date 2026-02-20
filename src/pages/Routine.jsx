import { Link } from 'react-router-dom';

export default function Routine() {
    return (
        <div className="bg-[#FFFFFF] text-[#1C1C1E] min-h-screen">
            <aside className="fixed hidden md:flex left-0 top-0 h-full w-24 flex-col items-center py-10 border-r border-gray-100 bg-[#FFFFFF]/80 backdrop-blur-xl z-50">
                <div className="mb-12 text-[#007AFF]">
                    <span className="material-symbols-outlined text-4xl font-light">auto_awesome</span>
                </div>
                <nav className="flex flex-col gap-10 flex-1">
                    <Link to="/" className="group flex flex-col items-center text-[#8E8E93] hover:text-[#007AFF] transition-colors">
                        <span className="material-symbols-outlined text-[28px]">space_dashboard</span>
                    </Link>
                    <Link to="/routine" className="group flex flex-col items-center text-[#007AFF]">
                        <span className="material-symbols-outlined text-[28px] !font-variation-[FILL_1]">event_repeat</span>
                    </Link>
                    <Link to="/insights" className="group flex flex-col items-center text-[#8E8E93] hover:text-[#007AFF] transition-colors">
                        <span className="material-symbols-outlined text-[28px]">bar_chart_4_bars</span>
                    </Link>
                    <Link to="/journal" className="group flex flex-col items-center text-[#8E8E93] hover:text-[#007AFF] transition-colors">
                        <span className="material-symbols-outlined text-[28px]">photo_camera</span>
                    </Link>
                </nav>
            </aside>

            <main className="md:ml-24 min-h-screen p-6 md:p-12 lg:p-16 max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-1">
                        <p className="text-[#8E8E93] text-xs font-bold tracking-[0.1em] uppercase">Monday, Oct 21</p>
                        <h1 className="text-5xl font-extrabold tracking-tight text-[#1C1C1E]">Good Morning, Alex</h1>
                        <p className="text-[#8E8E93] text-lg flex items-center gap-2 font-medium">
                            <span className="material-symbols-outlined text-[#007AFF] text-xl">info</span>
                            You have 4 routines scheduled for today.
                        </p>
                    </div>
                    <div className="flex items-center">
                        <button className="flex items-center gap-2.5 px-6 py-3 bg-[#F2F2F7] hover:bg-gray-200 text-[#1C1C1E] rounded-full font-semibold text-sm transition-all border border-gray-200/50">
                            <span className="material-symbols-outlined text-[#007AFF] text-xl">magic_button</span>
                            Smart Optimize
                        </button>
                    </div>
                </header>

                <section className="space-y-4">
                    <div className="group relative bg-[#F2F2F7]/50 border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 rounded-ios-3xl p-7 transition-all duration-500 cursor-pointer rounded-3xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500">
                                    <span className="material-symbols-outlined text-3xl font-light">wb_sunny</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#1C1C1E]">Morning Ritual</h3>
                                    <p className="text-[#8E8E93] font-medium">Starts at 7:30 AM • 45 mins</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative py-2">
                        <div className="relative bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-gray-200/40 overflow-hidden">
                            <div className="p-6 md:p-10">
                                <div className="flex items-start justify-between mb-10">
                                    <div className="flex items-center gap-4 md:gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-[#007AFF]/5 flex items-center justify-center text-[#007AFF]">
                                            <span className="material-symbols-outlined text-4xl !font-variation-[FILL_1]">directions_car</span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-extrabold text-[#1C1C1E]">Wash Car</h3>
                                            <p className="text-[#8E8E93] text-lg font-medium">Monthly Maintenance • 12:00 PM</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="apple-blur rounded-3xl p-6 md:p-8 relative overflow-hidden bg-[#FFFFFF]/60 shadow-sm border border-gray-100">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#007AFF]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                    <div className="flex items-center gap-3 mb-8">
                                        <span className="material-symbols-outlined text-[#007AFF] text-2xl font-light">auto_awesome</span>
                                        <h4 className="text-xs font-black uppercase tracking-[0.15em] text-[#007AFF]">AI Task Breakdown</h4>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="flex items-center gap-5 group/item cursor-pointer">
                                            <div className="w-6 h-6 rounded-full border-[1.5px] border-[#007AFF]/30 flex items-center justify-center group-hover/item:border-[#007AFF] transition-all bg-white shadow-sm"></div>
                                            <span className="text-[#1C1C1E] font-semibold text-[17px]">Vacuum interior floor mats and seats</span>
                                        </div>
                                        <div className="flex items-center gap-5 group/item cursor-pointer">
                                            <div className="w-6 h-6 rounded-full border-[1.5px] border-[#007AFF]/30 flex items-center justify-center group-hover/item:border-[#007AFF] transition-all bg-white shadow-sm"></div>
                                            <span className="text-[#1C1C1E] font-semibold text-[17px]">Clean exterior windows with streak-free solution</span>
                                        </div>
                                        <div className="flex items-center gap-5 group/item cursor-pointer">
                                            <div className="w-6 h-6 rounded-full border-[1.5px] border-[#007AFF]/30 flex items-center justify-center group-hover/item:border-[#007AFF] transition-all bg-white shadow-sm"></div>
                                            <span className="text-[#1C1C1E] font-semibold text-[17px]">Apply premium wax coat for UV protection</span>
                                        </div>
                                    </div>

                                    <div className="mt-10 flex gap-4">
                                        <button className="flex-1 bg-[#007AFF] text-white py-4 rounded-2xl font-bold text-[17px] hover:brightness-110 active:scale-[0.98] transition-all">
                                            Start Routine
                                        </button>
                                        <button className="px-8 py-4 rounded-2xl border border-gray-200 font-bold text-[17px] text-[#1C1C1E] hover:bg-gray-50 transition-all">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <nav className="fixed md:hidden bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[400px] z-50">
                    <div className="apple-blur rounded-[2.5rem] p-2 flex items-center justify-around deep-shadow border border-white/40">
                        <Link to="/" className="flex flex-col items-center justify-center w-14 h-14 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="material-symbols-outlined">space_dashboard</span>
                        </Link>
                        <Link to="/routine" className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined">calendar_today</span>
                        </Link>
                        <Link to="/insights" className="flex flex-col items-center justify-center w-14 h-14 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
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
