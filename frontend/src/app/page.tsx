import Link from "next/link";

const mockMetrics = [
  { name: "Deep Learning Lead", score: "98%", tag: "Ideal Fit", insight: "High alignment in Graph Theory & PyTorch Scalability." },
  { name: "Backend Architect", score: "92%", tag: "Top Talent", insight: "GNN predicts rapid mastery of Neo4j/Cypher ecosystems." },
  { name: "SRE Specialist", score: "89%", tag: "Strong Potential", insight: "Exceptional trajectory in multi-cloud infrastructure automation." },
  { name: "MLOps Engineer", score: "95%", tag: "Strategic", insight: "Near-perfect overlap with existing internal architectural patterns." },
  { name: "Frontend Innovator", score: "96%", tag: "Visionary", insight: "Demonstrated UI/UX mastery and advanced state management." },
  { name: "Data Scientist", score: "91%", tag: "Analytical", insight: "Deep knowledge in NLP, LLM fine-tuning, and robust datasets." },
  { name: "Product Manager (AI)", score: "88%", tag: "Strategic", insight: "Translates complex GNN models into actionable business value." },
  { name: "Security Analyst", score: "94%", tag: "Protector", insight: "Impeccable zero-trust architecture adoption." },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-[var(--accent-subtle)] overflow-x-hidden">
      {/* ─── NAV ─── */}
      <nav className="fixed w-full z-50 glass-panel px-8 py-5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[1rem_0.25rem_1rem_0.25rem] bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] flex items-center justify-center font-black text-white text-sm shadow-lg shadow-[#6c5ce7]/25">
            A
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--foreground)] border-l border-[var(--border)] pl-3">
            Aura <span className="bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] bg-clip-text text-transparent">AI</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-[13px] font-bold uppercase tracking-wider text-[var(--muted)]">
          <a href="#platform" className="hover:text-[var(--accent)] transition-colors">Platform</a>
          <a href="#solutions" className="hover:text-[var(--accent)] transition-colors">Solutions</a>
          <a href="#company" className="hover:text-[var(--accent)] transition-colors">Company</a>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/dashboard" className="text-[13px] font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
            Login
          </Link>
          <Link href="/dashboard" className="btn-accent px-7 py-3 text-[13px] uppercase tracking-wider shadow-lg shadow-[#6c5ce7]/20">
            <span>Request Demo</span>
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <main className="flex-1 flex flex-col items-center pt-56 pb-32 px-6 relative">
        {/* Decorative floating shapes */}
        <div className="absolute top-40 left-[10%] w-24 h-24 rounded-[2rem_0.5rem_2rem_0.5rem] bg-[var(--accent-subtle)] rotate-12 animate-float opacity-60" />
        <div className="absolute top-60 right-[12%] w-16 h-16 rounded-[0.5rem_2rem_0.5rem_2rem] bg-[var(--accent-subtle)] -rotate-12 animate-float opacity-40" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[22rem] left-[5%] w-8 h-8 rotate-45 bg-[var(--accent)] opacity-[0.06]" />

        <div className="max-w-6xl w-full text-center relative z-10">
          <div className="tag-pill mb-10 mx-auto w-fit animate-float select-none">
            Intelligent Talent Automation
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-[-0.04em] text-[var(--foreground)] leading-[0.95] mb-10 max-w-4xl mx-auto select-none">
            The AI engine for <br />
            <span className="bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] bg-clip-text text-transparent">elite talent delivery.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--muted)] max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
            Scale your recruitment with autonomous Graph Neural Networks. 
            Identify precision matches with zero human bias.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-32">
            <Link href="/dashboard" className="btn-accent w-full sm:w-auto px-10 py-5 text-lg shadow-2xl shadow-[#6c5ce7]/20">
              <span>Get Started</span>
            </Link>
            <button className="btn-outline w-full sm:w-auto px-10 py-5 text-lg">
              Platform Overview
            </button>
          </div>
        </div>
      </main>

      {/* ─── CAROUSEL ─── */}
      <section className="w-full relative overflow-hidden carousel-mask py-16 dot-grid">
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-10 block text-center">
          Real-time Neural Analysis
        </h2>
        <div className="animate-scroll flex gap-8 whitespace-nowrap px-4 w-max">
          {mockMetrics.map((metric, idx) => (
            <MetricCard key={`m1-${idx}`} {...metric} idx={idx} />
          ))}
          {mockMetrics.map((metric, idx) => (
            <MetricCard key={`m2-${idx}`} {...metric} idx={idx} />
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="w-full py-24 bg-[var(--surface-alt)] border-t border-[var(--border)] px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-[0.75rem_0.2rem_0.75rem_0.2rem] bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe]" />
              <span className="text-xl font-bold tracking-tight">
                Aura <span className="bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] bg-clip-text text-transparent">Logic</span>
              </span>
            </div>
            <p className="text-[var(--muted)] leading-relaxed text-sm">
              Reimagining human capital through the lens of sophisticated graph theory and neural automation.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-20 uppercase tracking-widest text-[11px] font-black text-[var(--muted)]">
            <div className="flex flex-col gap-4">
              <span className="text-[var(--foreground)]">Product</span>
              <a href="#" className="hover:text-[var(--accent)] transition-colors">Engine</a>
              <a href="#" className="hover:text-[var(--accent)] transition-colors">XAI</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[var(--foreground)]">Logic</span>
              <a href="#" className="hover:text-[var(--accent)] transition-colors">Neo4j</a>
              <a href="#" className="hover:text-[var(--accent)] transition-colors">Qdrant</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[var(--foreground)]">Contact</span>
              <a href="#" className="hover:text-[var(--accent)] transition-colors">Sales</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MetricCard({ name, score, tag, insight, idx }: { name: string, score: string, tag: string, insight: string, idx: number }) {
  const isEven = idx % 2 === 0;
  return (
    <div className={`min-w-[400px] p-10 relative overflow-hidden snap-center cursor-default ${isEven ? 'card-asym' : 'card-asym-alt'}`}>
      {/* Corner ornament */}
      <div className={`absolute ${isEven ? 'top-0 right-0' : 'bottom-0 left-0'} w-12 h-12 opacity-[0.06]`}>
        <div className="w-full h-full bg-[var(--accent)]" style={{ clipPath: isEven ? 'polygon(100% 0, 0 0, 100% 100%)' : 'polygon(0 100%, 100% 100%, 0 0)' }} />
      </div>

      <div className="flex justify-between items-start mb-8 relative">
        <div className="tag-pill">{tag}</div>
        <div className="text-4xl font-black text-[var(--foreground)] tracking-tighter">{score}</div>
      </div>
      <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">{name}</h3>
      <div className="h-1.5 w-full bg-[var(--surface-alt)] rounded-full overflow-hidden mb-6">
        <div className="h-full progress-accent w-[94%]" />
      </div>
      <p className="text-[var(--muted)] font-medium leading-relaxed italic">
        &ldquo;{insight}&rdquo;
      </p>
    </div>
  );
}
