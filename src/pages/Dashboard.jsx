import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <>
<div>
  <aside className="fixed left-0 top-0 h-full w-20 lg:w-64 bg-white border-r border-gray-100 hidden md:flex flex-col z-40 transition-all duration-300">
    <div className="p-6 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white">
        <span className="material-symbols-outlined font-bold">bolt</span>
      </div>
      <span className="text-xl font-bold tracking-tight hidden lg:block">Strive</span>
    </div>
    <nav className="flex-1 px-4 space-y-2 mt-4">
      <a className="flex items-center gap-4 px-4 py-3 rounded-2xl sidebar-item-active group transition-all" href="#">
        <span className="material-symbols-outlined fill-1">grid_view</span>
        <span className="font-semibold hidden lg:block">Today</span>
      </a>
      <a className="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all" href="#">
        <span className="material-symbols-outlined">repeat</span>
        <span className="font-medium hidden lg:block">Routines</span>
      </a>
      <a className="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all" href="#">
        <span className="material-symbols-outlined">monitoring</span>
        <span className="font-medium hidden lg:block">Insights</span>
      </a>
      <a className="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all" href="#">
        <span className="material-symbols-outlined">military_tech</span>
        <span className="font-medium hidden lg:block">Successes</span>
      </a>
    </nav>
    <div className="p-6 mt-auto">
      <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer">
        <img alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL3aOu6IA_E5k2bPGBTMwRGrgOw9yztlmwwUkZEXSxPfEMU9amVIUoAGEldQyLt22-C6aNUHN2t_xi8AFdw08BtDrlWOEMuw-JtfzaEojLyDookEOPnBiiUAkXJ0FRO83b9wrjCZ6n5rVG-STNvMwfwRiwUUIW8g46FxCbGSGPf4P6v0nQ8IDgpy5hpBFZkZqio3S8K2F3bSAD1c2AQZ4g22-XYrIVUGWX8abl3lglPVAn7NBsWvddjqSakASD9XsZTWChNV_AkzC5" />
        <div className="hidden lg:block overflow-hidden">
          <p className="text-sm font-semibold truncate">Alex Rivera</p>
          <p className="text-xs text-gray-400">Pro Member</p>
        </div>
      </div>
    </div>
  </aside>
  <main className="md:ml-20 lg:ml-64 min-h-screen pb-32 md:pb-12">
    <div className="max-w-4xl mx-auto px-6 pt-12">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">Monday, May 22</p>
          <h1 className="text-4xl font-bold tracking-tight">Today</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full ios-shadow border border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Emergency</span>
            <button className="w-10 h-5 bg-gray-200 rounded-full relative transition-colors">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
          </div>
        </div>
      </header>
      <section className="mb-10">
        <div className="bg-white rounded-[2rem] p-8 ios-shadow border border-gray-50/50">
          <h2 className="text-center text-gray-400 text-sm font-medium mb-6">How is your energy level?</h2>
          <div className="flex justify-between items-center max-w-sm mx-auto">
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-gray-50 transition-all text-2xl">😫</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-gray-50 transition-all text-2xl">😐</button>
            <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[var(--primary)] text-3xl shadow-lg shadow-blue-200">😊</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-gray-50 transition-all text-2xl">⚡</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-gray-50 transition-all text-2xl">🔥</button>
          </div>
        </div>
      </section>
      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            <h3 className="text-xl font-bold">Morning</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white rounded-[1.5rem] p-5 ios-shadow border-l-4 border-l-[var(--primary)] flex items-start gap-4">
              <div className="w-6 h-6 rounded-full border-2 border-blue-100 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-lg">Architecture Strategy</h4>
                  <span className="text-[10px] font-bold text-[var(--primary)] bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wide">Essential</span>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  09:00 AM — 11:30 AM
                </p>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
            <h3 className="text-xl font-bold">Afternoon</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2rem] p-6 ios-shadow flex flex-col items-center justify-center text-center">
              <div className="w-full flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase">Focus Timer</span>
                <span className="material-symbols-outlined text-gray-300">more_horiz</span>
              </div>
              <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                <svg className="w-full h-full -rotate-90">
                  <circle cx={72} cy={72} fill="none" r={68} stroke="#F2F2F7" strokeWidth={8} />
                  <circle cx={72} cy={72} fill="none" r={68} stroke="var(--primary)" strokeDasharray={427} strokeDashoffset={140} strokeLinecap="round" strokeWidth={8} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold tracking-tight">25:00</span>
                </div>
              </div>
              <button className="bg-[var(--primary)] text-white w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <span className="material-symbols-outlined fill-1">play_arrow</span>
                Start Session
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-[1.5rem] p-5 ios-shadow flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[var(--primary)]">
                    <span className="material-symbols-outlined fill-1">water_drop</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Water Intake</h4>
                    <p className="text-xs text-gray-400">6 of 8 glasses</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-all">
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="font-bold text-sm w-4 text-center">6</span>
                  <button className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[var(--primary)]">
                    <span className="material-symbols-outlined text-sm font-bold">add</span>
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-[1.5rem] p-5 ios-shadow flex items-center gap-4">
                <div className="w-6 h-6 rounded-full border-2 border-gray-100 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold">Project Sync Prep</h4>
                  <p className="text-xs text-gray-400">02:00 PM</p>
                </div>
                <span className="material-symbols-outlined text-gray-300">chevron_right</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
  <nav className="fixed bottom-0 left-0 right-0 glass-nav border-t border-gray-100 px-6 py-4 flex md:hidden justify-between items-center z-50">
    <a className="text-[var(--primary)] flex flex-col items-center gap-1" href="#">
      <span className="material-symbols-outlined fill-1">grid_view</span>
      <span className="text-[10px] font-bold">Today</span>
    </a>
    <a className="text-gray-400 flex flex-col items-center gap-1" href="#">
      <span className="material-symbols-outlined">repeat</span>
      <span className="text-[10px] font-medium">Routines</span>
    </a>
    <a className="text-gray-400 flex flex-col items-center gap-1" href="#">
      <span className="material-symbols-outlined">monitoring</span>
      <span className="text-[10px] font-medium">Insights</span>
    </a>
    <a className="text-gray-400 flex flex-col items-center gap-1" href="#">
      <span className="material-symbols-outlined">military_tech</span>
      <span className="text-[10px] font-medium">Wins</span>
    </a>
  </nav>
</div>

    </>
  );
}
