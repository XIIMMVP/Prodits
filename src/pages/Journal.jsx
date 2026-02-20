import { Link } from 'react-router-dom';

export default function Journal() {
  return (
    <>
      <div>

        <main className="w-full h-full max-w-7xl mx-auto">
          <header className="sticky top-0 z-20 glass-header px-8 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
              <div className="relative flex-1 max-w-xl">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-xl">search</span>
                <input className="w-full bg-[#F2F2F7] border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-secondary)]" placeholder="Search entries, tags, or milestones..." type="text" />
              </div>
              <div className="flex items-center gap-3">
                <button className="size-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-[var(--text-secondary)]">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
                <button className="bg-[var(--primary)] text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 ios-shadow hover:brightness-110 transition-all">
                  <span className="material-symbols-outlined text-xl">add</span>
                  New Entry
                </button>
              </div>
            </div>
          </header>
          <div className="max-w-6xl mx-auto px-8 py-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-1 text-[var(--text-main)]">Your Success Feed</h2>
                <p className="text-[var(--text-secondary)] font-medium">Tracking your path to excellence.</p>
              </div>
              <div className="flex gap-1.5 bg-[#F2F2F7] p-1 rounded-xl border border-[var(--border)]">
                <button className="px-5 py-1.5 rounded-lg text-sm font-semibold bg-white text-[var(--text-main)] ios-shadow">All</button>
                <button className="px-5 py-1.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors">Health</button>
                <button className="px-5 py-1.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors">Career</button>
                <button className="px-5 py-1.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors">Mind</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-[var(--card-bg)] rounded-3xl overflow-hidden ios-shadow ios-shadow-hover transition-all group border border-[var(--border)]/50">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img alt="Gym" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFDsiCGGsa0p-NVx6GK1CJUa7iuwp2jRoMxCe8PiYcPQVtaVqpsC0yfBq2XQisLGmamuwvmaEcIVW13-2v6CXOGiauFy0HH4ZHdYDc63mOyahkgjAdKp-W5eUsDF4n3VI-ZPuIuHCyFRyhz1P1rXTwSnNb3W86gSEU2etcc9f5j69EuOII3LzjYXJAF5TvLTuFo0SeWSq3wqiVnJVwd9ZBSgZtrgLGxvHX22HzjsJpFJOmEqO4GBH4pKOX44hpSKPzNkmqKM8CRJJq" />
                  <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    07:30 AM
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">Health &amp; Vitality</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Morning Discipline</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">5km run completed at sunrise. Pushing beyond the comfort zone to set the pace for the day.</p>
                </div>
              </div>
              <div className="bg-[var(--card-bg)] rounded-3xl overflow-hidden ios-shadow ios-shadow-hover transition-all group border border-[var(--border)]/50">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img alt="Meal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmdYLXY0xebcmOUoukMhZLA1AakD4W-oyXZZfh_qBYUog6zr6sb9FDkR9XMQ1WMcxSfYzbD3obcSSBTRoNXYqGsq5igbJU6KWr6Sqi2XY97s-NGlDVwBBbdXB8M08pwtC1J6ukZglYr2nq8FCS5BrN00ziLVHZEagEl-OWmK0wKu1ageEFUqWWtwq41GWn9Fta10YFnoZpMu0S8wEoHZD49Hisab-o3oii2eRsXJU3IzxmH7TS5fEC7KQe3SoN52KbTTvfLQ50ZEHI" />
                  <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    12:45 PM
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">Nutrition</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Nutritional Balance</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">Organic greens and high protein fuel. Clarity starts with what you consume.</p>
                </div>
              </div>
              <div className="bg-[var(--card-bg)] rounded-3xl overflow-hidden ios-shadow ios-shadow-hover transition-all group border border-[var(--border)]/50">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img alt="Workspace" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaUfRmeoD7ojYcw7sDuN_pOss5Z85_CS0rvAtbgyWCJRFxO8wu80Jq-FRKe6HtviK87aACLjZQsqZxgpTp6z25yXqOeBqX5rXEKvomp2ip5RpvP-gMV2eZohO-kQUoKDRA0B4jJBMGwWngjCfcCsF7RUNnOB86UUgNgkuMzL3EGvVFxpgX0Q_yBkq_aQX_sfpUnIuR8tRotY1OGF-0QdmeE_uWTtm6QVQu6N0_-ymmcft4tQTR2lYDNb97Z3heajUPVIbtV02I4Ylt" />
                  <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    04:00 PM
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">Productivity</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Deep Work Session</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">3 hours of focused coding with zero distractions. Milestone achieved on redesign.</p>
                </div>
              </div>
              <div className="bg-[var(--card-bg)] rounded-3xl overflow-hidden ios-shadow ios-shadow-hover transition-all group border border-[var(--border)]/50">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img alt="Reading" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXMYPwGHXQcSq7ifmFocdWFS66OWhDs_DXOvzzFwA6qhzofEKd0RTsrC5Xmbq3kNzXcfLz3JOo_YulK7ODEQaq6_FQ9-A2H81m4FqV-VPedtrD2rhwlBvei2wSoKsBvengLeAycqLYfKT8Q9zN03nKaLmeRhIy-r7EDFkxPBZrSiPIyC7aADY7mHbklZWajMLC8QpEaVbLSN9qzkUIM3LnEVpKo5x0NkZJztqh7oI9bezTEJm4DD9bfEZ88ttsfnlZCBEEl-j8uwor" />
                  <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    09:00 PM
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">Personal Growth</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Mindful Reading</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">Finished 'Atomic Habits' chapter 4. Internalizing the compound effect of tiny gains.</p>
                </div>
              </div>
              <div className="bg-[var(--card-bg)] rounded-3xl overflow-hidden ios-shadow ios-shadow-hover transition-all group border border-[var(--border)]/50">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img alt="Workout" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALKYm0lElqthN2u6NT-NIzWVeZhCAtfEwfvAt4ZhaHyDPZyBTuEn1zyDcYVmqR0ymwIEVVlLbDweNnpc5UdVHdNLF3wnJEgS-GINetwTEjjI_RmLFeXb5T2ZEKFvzAhgZ1Ijc7PprCnh4bEwUmEgbWWuW-dbs6skjHy7hvRAw2witqhFlq2RqIQI-Cgg8gCcy14Zs0DuzxX4sa-aRIrUiZDS9djTzCu7Ped943NC2nmoh2L8EWIHnM8GVQlsUsw4VpChZo_VECblQO" />
                  <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    06:15 AM
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">Physical Strength</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Gym Milestone</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">New personal record on deadlifts. The body achieves what the mind believes.</p>
                </div>
              </div>
              <div className="rounded-3xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center p-8 bg-[var(--background)] hover:bg-white hover:border-[var(--primary)]/30 transition-all cursor-pointer group">
                <div className="size-16 rounded-full bg-white border border-[var(--border)] flex items-center justify-center mb-4 group-hover:border-[var(--primary)] transition-colors ios-shadow">
                  <span className="material-symbols-outlined text-3xl text-[var(--primary)]">add_a_photo</span>
                </div>
                <span className="font-bold text-[var(--text-main)]">Add Success</span>
                <p className="text-[var(--text-secondary)] text-sm text-center mt-1">Capture your next victory and visualize progress</p>
              </div>
            </div>
          </div>
        </main>
      </div>

    </>
  );
}
