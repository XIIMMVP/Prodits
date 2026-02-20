import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <>
<div>
  
  <main className="w-full h-full max-w-7xl mx-auto">
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
  
</div>

    </>
  );
}
