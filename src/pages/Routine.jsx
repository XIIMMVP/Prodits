import { Link } from 'react-router-dom';

export default function Routine() {
  return (
    <>
      <div>

        <main className="w-full h-full max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto px-8 pt-16">
            <header className="flex items-center justify-between mb-12">
              <div>
                <span className="text-[var(--ios-blue)] text-xs font-bold tracking-widest uppercase mb-2 block">Management</span>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">Routines</h1>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-5 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">tune</span>
                  Filter
                </button>
                <button className="px-5 py-2 rounded-full bg-[var(--ios-blue)] text-white text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
                  <span className="material-symbols-outlined text-lg">auto_awesome</span>
                  AI Optimize
                </button>
              </div>
            </header>
            <div className="space-y-4">
              <div className="ios-card p-6 flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                    <span className="material-symbols-outlined text-2xl fill">wb_sunny</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Morning Ritual</h3>
                    <p className="text-slate-400 text-sm font-medium tracking-tight">Daily • 7:30 AM — 8:15 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-400 transition-colors">chevron_right</span>
                </div>
              </div>
              <div className="ios-card p-0 overflow-hidden ring-1 ring-black/5">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[var(--ios-blue)]">
                        <span className="material-symbols-outlined text-3xl fill">directions_car</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-xl font-bold text-slate-900">Wash Car</h3>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Monthly</span>
                        </div>
                        <p className="text-slate-400 font-medium">Scheduled for 12:00 PM</p>
                      </div>
                    </div>
                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                  </div>
                  <div className="bg-[var(--ios-bg)] rounded-3xl p-6 border border-slate-100/50">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="material-symbols-outlined text-[var(--ios-blue)] text-xl fill">auto_awesome</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-[var(--ios-blue)]">AI Assistant Breakdown</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 group/item">
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover/item:border-[var(--ios-blue)] transition-colors cursor-pointer" />
                        <span className="text-slate-700 font-medium">Vacuum interior floor mats and seats</span>
                      </div>
                      <div className="flex items-center gap-4 group/item">
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover/item:border-[var(--ios-blue)] transition-colors cursor-pointer" />
                        <span className="text-slate-700 font-medium">Clean exterior windows with streak-free solution</span>
                      </div>
                      <div className="flex items-center gap-4 group/item">
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover/item:border-[var(--ios-blue)] transition-colors cursor-pointer" />
                        <span className="text-slate-700 font-medium font-medium">Apply premium wax coat for UV protection</span>
                      </div>
                    </div>
                    <div className="mt-8 flex gap-3">
                      <button className="flex-1 bg-[var(--ios-blue)] text-white py-3.5 rounded-2xl font-semibold hover:opacity-90 transition-all shadow-md shadow-blue-500/10">
                        Start Routine
                      </button>
                      <button className="px-8 py-3.5 rounded-2xl bg-white border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  </div>
                </div>
              </div>
              <div className="ios-card p-6 flex items-center justify-between group cursor-pointer opacity-80">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <span className="material-symbols-outlined text-2xl fill">laptop_mac</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Deep Work Block</h3>
                    <p className="text-slate-400 text-sm font-medium">Daily • 2:00 PM</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-400 transition-colors">chevron_right</span>
              </div>
              <div className="ios-card p-6 flex items-center justify-between group cursor-pointer opacity-80">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-500">
                    <span className="material-symbols-outlined text-2xl fill">self_improvement</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Evening Wind Down</h3>
                    <p className="text-slate-400 text-sm font-medium">Daily • 9:30 PM</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-400 transition-colors">chevron_right</span>
              </div>
            </div>
          </div>

          <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[var(--ios-blue)] text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all z-50">
            <span className="material-symbols-outlined text-3xl font-light">add</span>
          </button>
        </main>
      </div>

    </>
  );
}
