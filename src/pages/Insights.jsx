import { Link } from 'react-router-dom';

export default function Insights() {
  return (
    <>
<div className="flex h-screen overflow-hidden">
  
  <main className="w-full h-full max-w-7xl mx-auto">
    <header className="sticky top-0 z-30 bg-apple-bg/80 backdrop-blur-md px-8 py-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight">Unified Insights</h1>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray text-xl">search</span>
          <input className="bg-[#EDEDF0] border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-1 focus:ring-primary/30" placeholder="Search insights..." type="text" />
        </div>
        <button className="size-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-apple-gray">notifications</span>
        </button>
      </div>
    </header>
    <div className="max-w-6xl mx-auto px-8 pb-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-apple-card rounded-ios-lg p-8 border border-apple-border card-shadow flex flex-col items-center text-center">
          <div className="relative size-32 mb-4">
            <svg className="size-full activity-ring" viewBox="0 0 36 36">
              <circle className="stroke-gray-100" cx={18} cy={18} fill="none" r={16} strokeWidth={3} />
              <circle className="stroke-emerald-500" cx={18} cy={18} fill="none" r={16} strokeDasharray="82, 100" strokeLinecap="round" strokeWidth={3} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">82%</span>
              <span className="text-[10px] text-apple-gray font-bold uppercase">Vitality</span>
            </div>
          </div>
          <h3 className="font-semibold text-lg">Health Ring</h3>
          <p className="text-sm text-emerald-600 font-medium">+2% vs last week</p>
        </div>
        <div className="bg-apple-card rounded-ios-lg p-8 border border-apple-border card-shadow flex flex-col items-center text-center">
          <div className="relative size-32 mb-4">
            <svg className="size-full activity-ring" viewBox="0 0 36 36">
              <circle className="stroke-gray-100" cx={18} cy={18} fill="none" r={16} strokeWidth={3} />
              <circle className="stroke-primary" cx={18} cy={18} fill="none" r={16} strokeDasharray="95, 100" strokeLinecap="round" strokeWidth={3} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">95%</span>
              <span className="text-[10px] text-apple-gray font-bold uppercase">Clarity</span>
            </div>
          </div>
          <h3 className="font-semibold text-lg">Mind Ring</h3>
          <p className="text-sm text-primary font-medium">+5% vs last week</p>
        </div>
        <div className="bg-apple-card rounded-ios-lg p-8 border border-apple-border card-shadow flex flex-col items-center text-center">
          <div className="relative size-32 mb-4">
            <svg className="size-full activity-ring" viewBox="0 0 36 36">
              <circle className="stroke-gray-100" cx={18} cy={18} fill="none" r={16} strokeWidth={3} />
              <circle className="stroke-[#FF9500]" cx={18} cy={18} fill="none" r={16} strokeDasharray="78, 100" strokeLinecap="round" strokeWidth={3} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">78%</span>
              <span className="text-[10px] text-apple-gray font-bold uppercase">Presence</span>
            </div>
          </div>
          <h3 className="font-semibold text-lg">Home Ring</h3>
          <p className="text-sm text-rose-500 font-medium">-1% vs last week</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        <div className="lg:col-span-3 ios-glass rounded-ios-lg p-8 border border-white/40 card-shadow flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -top-12 size-48 bg-primary/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Smart Insight</span>
            </div>
            <p className="text-2xl font-medium leading-tight mb-8">
              "You usually miss <span className="text-primary font-bold">reading sessions</span> on Thursday afternoons. Move it to the morning?"
            </p>
          </div>
          <div className="flex gap-4 relative z-10">
            <button className="bg-primary text-white px-8 py-3.5 rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity">
              Accept Suggestion
            </button>
            <button className="bg-black/5 text-apple-gray px-8 py-3.5 rounded-2xl font-semibold text-sm hover:bg-black/10 transition-colors">
              Dismiss
            </button>
          </div>
        </div>
        <div className="lg:col-span-2 bg-apple-card rounded-ios-lg p-8 border border-apple-border card-shadow">
          <h3 className="font-bold text-lg mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-apple-gray">donut_large</span>
            Life Balance
          </h3>
          <div className="flex items-center justify-between gap-6">
            <div className="relative size-36">
              <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                <circle cx={50} cy={50} fill="transparent" r={40} stroke="#F2F2F7" strokeWidth={10} />
                <circle cx={50} cy={50} fill="transparent" r={40} stroke="#007AFF" strokeDasharray="160 251" strokeLinecap="round" strokeWidth={10} />
                <circle cx={50} cy={50} fill="transparent" r={40} stroke="#FF9500" strokeDasharray="60 251" strokeDashoffset={-160} strokeLinecap="round" strokeWidth={10} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] text-apple-gray font-bold uppercase">Real Time</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2">
                <div className="size-2 rounded-full bg-primary mt-1.5" />
                <div>
                  <p className="text-[10px] text-apple-gray font-bold uppercase">Planned Work</p>
                  <p className="text-sm font-bold">40h / Week</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="size-2 rounded-full bg-[#FF9500] mt-1.5" />
                <div>
                  <p className="text-[10px] text-apple-gray font-bold uppercase">Actual Spent</p>
                  <p className="text-sm font-bold">48h / Week</p>
                </div>
              </div>
              <div className="pt-2 border-t border-apple-border mt-1">
                <p className="text-[10px] text-rose-500 font-bold uppercase">+8.2% Stress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-apple-card rounded-ios-lg p-8 border border-apple-border card-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="font-bold text-xl mb-1">Consistency Heatmap</h3>
            <p className="text-sm text-apple-gray">Daily habit completion across all categories.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-apple-gray font-bold uppercase">Less</span>
            <div className="flex gap-1.5">
              <div className="size-3.5 rounded-[3px] bg-gray-100" />
              <div className="size-3.5 rounded-[3px] bg-primary/20" />
              <div className="size-3.5 rounded-[3px] bg-primary/40" />
              <div className="size-3.5 rounded-[3px] bg-primary/70" />
              <div className="size-3.5 rounded-[3px] bg-primary" />
            </div>
            <span className="text-[10px] text-apple-gray font-bold uppercase">Peak</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[700px]">
            <div className="text-center text-[10px] font-bold text-apple-gray uppercase tracking-widest pb-4">Mon</div>
            <div className="text-center text-[10px] font-bold text-apple-gray uppercase tracking-widest pb-4">Tue</div>
            <div className="text-center text-[10px] font-bold text-apple-gray uppercase tracking-widest pb-4">Wed</div>
            <div className="text-center text-[10px] font-bold text-apple-gray uppercase tracking-widest pb-4">Thu</div>
            <div className="text-center text-[10px] font-bold text-apple-gray uppercase tracking-widest pb-4">Fri</div>
            <div className="text-center text-[10px] font-bold text-apple-gray uppercase tracking-widest pb-4">Sat</div>
            <div className="text-center text-[10px] font-bold text-apple-gray uppercase tracking-widest pb-4">Sun</div>
            <div className="aspect-square rounded-[10px] bg-primary/40 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary/70 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary/20 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-gray-100 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary/80 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary/70 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary/80 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary/40 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary/20 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary/80 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary/70 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary/40 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-gray-100 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary/70 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary/40 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary/80 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-primary/20 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-gray-100 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
            <div className="aspect-square rounded-[10px] bg-gray-100 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 ios-glass px-8 py-4 rounded-full shadow-2xl z-40 border border-white/60">
      <div className="flex items-center gap-10">
        <button className="flex flex-col items-center gap-1 group">
          <span className="material-symbols-outlined text-apple-gray group-hover:text-primary transition-colors">home</span>
          <span className="text-[8px] font-bold text-apple-gray uppercase tracking-widest">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 group">
          <span className="material-symbols-outlined text-primary fill-1">analytics</span>
          <span className="text-[8px] font-bold text-primary uppercase tracking-widest">Insights</span>
        </button>
        <button className="flex flex-col items-center gap-1 group">
          <span className="material-symbols-outlined text-apple-gray group-hover:text-primary transition-colors">event</span>
          <span className="text-[8px] font-bold text-apple-gray uppercase tracking-widest">Plan</span>
        </button>
        <button className="flex flex-col items-center gap-1 group">
          <span className="material-symbols-outlined text-apple-gray group-hover:text-primary transition-colors">settings</span>
          <span className="text-[8px] font-bold text-apple-gray uppercase tracking-widest">Settings</span>
        </button>
      </div>
    </div>
  </main>
</div>

    </>
  );
}
