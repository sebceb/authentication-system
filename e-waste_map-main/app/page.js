"use client"; // This directive is required for ssr: false logic

import dynamic from 'next/dynamic';

const MapNoSSR = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-slate-900 animate-pulse rounded-lg border-2 border-slate-700 flex items-center justify-center font-mono">LOADING_MAP_ENGINE...</div>
});

export default function Home() {
  return (
    <main className="min-h-screen pixel-grid p-8">
      <nav className="flex justify-between items-center mb-12 glass-morphism p-4 rounded-xl">
        <h1 className="text-2xl font-bold tracking-tighter text-lime-400 uppercase">
          min<span className="text-cyan-400">DISPOSE</span>
        </h1>
        <div className="space-x-6 font-mono text-xs uppercase">
          <a href="#about" className="hover:text-lime-400 transition">About</a>
          <a href="#map" className="hover:text-lime-400 transition">Map</a>
          <a href="/docs" className="hover:text-lime-400 transition text-cyan-400">[Documentation]</a>
        </div>
      </nav>

      <section id="map" className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-lime-400">&gt; E-WASTE_NODES_DAVAO</h2>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">Mindanao Digital Waste Mapping v1.0</span>
        </div>
        <MapNoSSR />
      </section>

        {/* About / E-Waste 101 Section */}
        <section id="about" className="max-w-6xl mx-auto mt-32 space-y-16 pb-20">
        
        {/* Header & Hero Image */}
        <div className="space-y-6">
            <div className="border-l-4 border-lime-400 pl-4">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">
                E-WASTE_PROTOCOL_<span className="text-cyan-400">101</span>
            </h2>
            <p className="font-mono text-xs text-slate-500 mt-2 uppercase tracking-widest">
                System_Subject: Global impact and local mitigation strategies.
            </p>
            </div>

            {/* Hero Photo Placeholder */}
            <div className="relative w-full h-[400px] bg-slate-800 border-2 border-slate-700 overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-mono text-xl opacity-20 group-hover:opacity-40 transition-opacity">
                [HERO_VISUAL_ASSET_01]
            </div>
            <div className="absolute bottom-4 left-4 glass-morphism p-4 border border-cyan-400/30">
                <p className="text-[10px] font-mono text-cyan-400 underline">IMG_REF: WASTE_ACCUMULATION_2026</p>
            </div>
            </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
            <h3 className="text-xl font-bold text-lime-400 font-mono uppercase underline decoration-2 underline-offset-8">
                The_Digital_Labyrinth
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            </p>
            <p className="text-slate-400 leading-relaxed text-sm">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <button className="btn-pill">Download_Report.pdf</button>
            </div>

            {/* Small Photo Grid */}
            <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-500 italic">
                [ASSET_02_CRT]
            </div>
            <div className="aspect-square bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-500 italic">
                [ASSET_03_CIRCUIT]
            </div>
            <div className="aspect-square bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-500 italic">
                [ASSET_04_MOBILE]
            </div>
            <div className="aspect-square bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-500 italic">
                [ASSET_05_LITHIUM]
            </div>
            </div>
        </div>

        {/* Secondary Info Block */}
        <div className="glass-morphism p-8 border-t-2 border-cyan-400 relative overflow-hidden">
            {/* Background watermark */}
            <span className="absolute -bottom-4 -right-4 text-8xl font-black text-white/5 pointer-events-none select-none">
            DISPOSE
            </span>
            
            <h3 className="font-mono text-cyan-400 mb-6 uppercase tracking-[0.2em] text-sm font-bold">
            Subheading: Toxic_Heavy_Metals
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { title: "LEAD", desc: "Found in CRT glass and solder. Highly neurotoxic to developing organisms." },
                { title: "MERCURY", desc: "Present in LCD backlights and switches. Accumulates in aquatic food chains." },
                { title: "CADMIUM", desc: "Common in rechargeable batteries. Known carcinogen affecting bone density." }
            ].map((metal, i) => (
                <div key={i} className="space-y-2">
                <h4 className="text-lime-400 font-mono text-xs font-bold border-b border-lime-400/30 pb-1 w-fit">
                    {metal.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-sans leading-tight">
                    {metal.desc}
                </p>
                </div>
            ))}
            </div>
        </div>
        </section>      
    </main>
  );
}