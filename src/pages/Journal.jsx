import { Link } from 'react-router-dom';

export default function Journal() {
    return (
        <div className="font-display bg-white text-[#1c1c1e] min-h-screen">
            <header className="sticky top-0 z-50 apple-blur px-8 py-5 border-b border-black/[0.05]">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-12">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black flex items-center justify-center rounded-lg text-white">
                            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                        </div>
                        <h1 className="text-lg font-semibold tracking-tight">Success Journal</h1>
                    </div>
                    <div className="flex-1 max-w-xl relative hidden md:block">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 text-xl">search</span>
                        </div>
                        <input className="w-full bg-[#8E8E93]/10 border-none focus:ring-1 focus:ring-black/5 rounded-2xl py-2.5 pl-11 pr-4 text-[15px] transition-all placeholder:text-gray-500" placeholder="Search milestones..." type="text" />
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="text-gray-400 hover:text-black transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 md:px-8 py-8 md:py-16 pb-32">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-2">
                        <h2 className="text-5xl font-semibold tracking-tight text-black">Gallery</h2>
                        <p className="text-gray-500 text-lg font-light tracking-tight">A visual chronicle of your daily growth and discipline.</p>
                    </div>
                    <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-fit">
                        <button className="px-6 py-2 rounded-xl text-sm font-medium bg-white text-black shadow-sm">All</button>
                        <button className="px-6 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-black transition-all">Health</button>
                        <button className="px-6 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-black transition-all">Work</button>
                        <button className="px-6 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-black transition-all">Mind</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
                    <div className="group cursor-pointer">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 shadow-sm hover:shadow-lg mb-5">
                            <img alt="Gym" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFDsiCGGsa0p-NVx6GK1CJUa7iuwp2jRoMxCe8PiYcPQVtaVqpsC0yfBq2XQisLGmamuwvmaEcIVW13-2v6CXOGiauFy0HH4ZHdYDc63mOyahkgjAdKp-W5eUsDF4n3VI-ZPuIuHCyFRyhz1P1rXTwSnNb3W86gSEU2etcc9f5j69EuOII3LzjYXJAF5TvLTuFo0SeWSq3wqiVnJVwd9ZBSgZtrgLGxvHX22HzjsJpFJOmEqO4GBH4pKOX44hpSKPzNkmqKM8CRJJq" />
                            <div className="absolute top-5 right-5 apple-blur px-3 py-1.5 rounded-full border border-black/5">
                                <span className="text-[10px] font-semibold tracking-widest text-black/80 uppercase">07:30 AM</span>
                            </div>
                        </div>
                        <div className="space-y-1 px-1">
                            <h3 className="text-[17px] font-semibold text-black">Morning Discipline</h3>
                            <p className="text-[14px] text-gray-500 leading-relaxed font-light">5km run completed at sunrise. Pushing beyond the comfort zone.</p>
                        </div>
                    </div>

                    <div className="group cursor-pointer">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 shadow-sm hover:shadow-lg mb-5">
                            <img alt="Meal" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmdYLXY0xebcmOUoukMhZLA1AakD4W-oyXZZfh_qBYUog6zr6sb9FDkR9XMQ1WMcxSfYzbD3obcSSBTRoNXYqGsq5igbJU6KWr6Sqi2XY97s-NGlDVwBBbdXB8M08pwtC1J6ukZglYr2nq8FCS5BrN00ziLVHZEagEl-OWmK0wKu1ageEFUqWWtwq41GWn9Fta10YFnoZpMu0S8wEoHZD49Hisab-o3oii2eRsXJU3IzxmH7TS5fEC7KQe3SoN52KbTTvfLQ50ZEHI" />
                            <div className="absolute top-5 right-5 apple-blur px-3 py-1.5 rounded-full border border-black/5">
                                <span className="text-[10px] font-semibold tracking-widest text-black/80 uppercase">12:45 PM</span>
                            </div>
                        </div>
                        <div className="space-y-1 px-1">
                            <h3 className="text-[17px] font-semibold text-black">Nutritional Balance</h3>
                            <p className="text-[14px] text-gray-500 leading-relaxed font-light">Organic greens and high protein fuel. Clarity starts from within.</p>
                        </div>
                    </div>

                    <div className="group cursor-pointer">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 shadow-sm hover:shadow-lg mb-5">
                            <img alt="Work" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaUfRmeoD7ojYcw7sDuN_pOss5Z85_CS0rvAtbgyWCJRFxO8wu80Jq-FRKe6HtviK87aACLjZQsqZxgpTp6z25yXqOeBqX5rXEKvomp2ip5RpvP-gMV2eZohO-kQUoKDRA0B4jJBMGwWngjCfcCsF7RUNnOB86UUgNgkuMzL3EGvVFxpgX0Q_yBkq_aQX_sfpUnIuR8tRotY1OGF-0QdmeE_uWTtm6QVQu6N0_-ymmcft4tQTR2lYDNb97Z3heajUPVIbtV02I4Ylt" />
                            <div className="absolute top-5 right-5 apple-blur px-3 py-1.5 rounded-full border border-black/5">
                                <span className="text-[10px] font-semibold tracking-widest text-black/80 uppercase">04:00 PM</span>
                            </div>
                        </div>
                        <div className="space-y-1 px-1">
                            <h3 className="text-[17px] font-semibold text-black">Deep Work Session</h3>
                            <p className="text-[14px] text-gray-500 leading-relaxed font-light">3 hours of focused coding with zero distractions. Milestone achieved.</p>
                        </div>
                    </div>

                    <div className="group cursor-pointer">
                        <div className="relative aspect-[4/5] rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 bg-gray-50/50 hover:bg-gray-50 transition-all mb-5">
                            <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-black">add</span>
                            </div>
                            <span className="text-[15px] font-medium text-gray-500">Capture Win</span>
                        </div>
                        <div className="px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <h3 className="text-[17px] font-semibold text-black">New Entry</h3>
                            <p className="text-[14px] text-gray-500">Record a new milestone.</p>
                        </div>
                    </div>
                </div>
            </main>

            <nav className="fixed md:hidden bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[400px] z-50">
                <div className="apple-blur rounded-[2.5rem] p-2 flex items-center justify-around deep-shadow border border-white/40">
                    <Link to="/" className="flex flex-col items-center justify-center w-14 h-14 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined">space_dashboard</span>
                    </Link>
                    <Link to="/routine" className="flex flex-col items-center justify-center w-14 h-14 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined">calendar_today</span>
                    </Link>
                    <Link to="/insights" className="flex flex-col items-center justify-center w-14 h-14 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined">bar_chart</span>
                    </Link>
                    <Link to="/journal" className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined">photo_camera</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
