"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, StatCard, Badge } from "@/components/ui";
import { NeuralGraphExplorer } from "@/components/NeuralGraphExplorer";
import { jobService } from "@/services/job.service";
import { candidateService } from "@/services/candidate.service";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await jobService.getPositions();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <aside className="w-80 border-r border-[var(--border)] bg-white p-8 flex flex-col gap-10 sticky top-0 h-screen" aria-label="Sidebar Navigation">
        <Link href="/" className="flex items-center gap-3 px-2 group focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg" aria-label="Aura AI Home">
          <div className="w-10 h-10 rounded-[1rem_0.25rem_1rem_0.25rem] bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] flex items-center justify-center font-black text-white text-sm shadow-lg shadow-[#6c5ce7]/25 group-hover:scale-110 transition-transform">
            A
          </div>
          <span className="text-xl font-bold tracking-tight">
            Aura <span className="bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] bg-clip-text text-transparent">AI</span>
          </span>
        </Link>

        <nav className="flex flex-col gap-1" role="tablist">
          <SidebarItem active={activeTab === "jobs"} onClick={() => setActiveTab("jobs")} label="Job Pipeline" icon="◆" ariaSelected={activeTab === "jobs"} />
          <SidebarItem active={activeTab === "candidates"} onClick={() => setActiveTab("candidates")} label="Candidate Pool" icon="◈" ariaSelected={activeTab === "candidates"} />
          <SidebarItem active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} label="Strategic Insights" icon="◇" ariaSelected={activeTab === "analytics"} />
        </nav>

        <div className="h-[1px] bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      </aside>

      <main className="flex-1 p-16 overflow-y-auto">
        {activeTab === "jobs" && <JobsPipelineView loading={loading} jobs={jobs} router={router} />}
        {activeTab === "candidates" && <CandidatePoolView jobs={jobs} router={router} />}
        {activeTab === "analytics" && (
          <NeuralGraphExplorer />
        )}
      </main>
    </div>
  );
}

function JobsPipelineView({ loading, jobs, router }: any) {
  return (
    <>
      <header className="flex justify-between items-end mb-20">
        <div>
          <div className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-4">Autonomous Intelligence</div>
          <h1 className="text-[48px] font-bold tracking-tight text-[#1D1D1F] leading-tight mb-3">Neural Pipeline</h1>
          <p className="text-[19px] text-[#86868B] font-medium leading-relaxed max-w-xl">
            Real-time talent identification via autonomous Graph Neural Networks and cross-functional matching.
          </p>
        </div>
        <Button href="/dashboard/create" size="xl" className="shadow-2xl shadow-[#6c5ce7]/25">
          Create Position
        </Button>
      </header>

      {loading ? (
        <Card variant="asym" className="w-full h-64 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent)] mb-4"></div>
          <div className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)]">Syncing with Graph Neural Networks</div>
        </Card>
      ) : jobs.length === 0 ? (
        <Card variant="asym" className="w-full text-center py-20 border-2 border-dashed">
          <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">No Active Positions</h3>
          <p className="text-[var(--muted)] font-medium max-w-sm mx-auto">Create your first job position to initialize the AI analysis.</p>
          <Button href="/dashboard/create" size="md" className="mt-8">Initialize Pipeline</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {jobs.map((job: any, idx: number) => (
            <StatCard 
              key={job.id}
              label={job.title}
              subLabel={job.department || "TECH"}
              value={job.candidates_count || 0}
              progress={job.average_match_score ? Math.round(job.average_match_score * 100) : 0}
              variant={idx % 2 === 0 ? "asym" : "asym-alt"}
              onClick={() => router.push(`/dashboard/job/${job.id}`)}
              icon={<Badge variant={job.status === "Synchronized" ? "primary" : "neutral"}>{job.status}</Badge>}
            />
          ))}
        </div>
      )}
    </>
  );
}

function CandidatePoolView({ jobs, router }: any) {
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || "");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedJobId) { setLoading(false); return; }
    const loadCandidates = async () => {
      setLoading(true);
      try {
        const data = await candidateService.getCandidatesByJob(selectedJobId);
        setCandidates(data);
      } catch (err) { 
        console.error("Error fetching candidates:", err);
        setCandidates([]);
      } finally { setLoading(false); }
    };
    loadCandidates();
  }, [selectedJobId]);

  return (
    <>
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] mb-3">Global Talent Pool</h1>
          <p className="text-lg text-[var(--muted)] font-medium italic">Filter capabilities across deployment vectors.</p>
        </div>
        <div className="flex flex-col items-end gap-6">
          <Button onClick={() => setIsModalOpen(true)} disabled={!selectedJobId} size="md">
            + Add Candidate CV
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)]">Context:</span>
            <div className="flex bg-white border border-[var(--border)] p-1.5 rounded-[1rem_0.375rem_1rem_0.375rem] shadow-sm max-w-sm overflow-x-auto no-scrollbar">
              {jobs.map((j: any) => (
                <button key={j.id} onClick={() => setSelectedJobId(j.id)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-[0.75rem_0.25rem_0.75rem_0.25rem] text-[13px] font-bold transition-all ${
                    selectedJobId === j.id 
                      ? "bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] text-white shadow-md shadow-[#6c5ce7]/15" 
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}>
                  {j.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <Card variant="asym-alt" className="w-full h-64 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent)] mb-4"></div>
          <div className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)]">Extracting Talent Density</div>
        </Card>
      ) : (
        <Card variant="asym" className="overflow-hidden">
          <table className="w-full text-left table-distinctive">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-[var(--muted)]">Candidate</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-[var(--muted)]">Status</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-[var(--muted)]">Neural Sync</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-[var(--muted)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(candidate => (
                <tr key={candidate.id} className="border-b border-[var(--border)]/30 hover:bg-[var(--surface-alt)]/50 transition-colors focus-within:bg-[var(--surface-alt)]/70">
                  <td className="px-10 py-8">
                    <div className="font-bold text-[var(--foreground)] text-lg mb-1">{candidate.name}</div>
                    <div className="text-sm font-medium text-[var(--muted)]">{candidate.email}</div>
                  </td>
                  <td className="px-10 py-8">
                    <Badge variant={candidate.parsing_status === 'analyzed' ? 'success' : 'warning'}>
                      {candidate.parsing_status}
                    </Badge>
                  </td>
                  <td className="px-10 py-8">
                    {candidate.overall_score ? (
                      <div className="flex items-center gap-4" aria-label={`Neural Sync Score: ${Math.round(candidate.overall_score * 100)}%`}>
                        <span className="font-black text-[var(--accent)] text-lg w-12">{Math.round(candidate.overall_score * 100)}%</span>
                        <div className="w-32 h-2 bg-[var(--surface-alt)] rounded-full overflow-hidden shadow-inner">
                          <div className="h-full progress-accent" style={{ width: `${candidate.overall_score * 100}%` }} />
                        </div>
                      </div>
                    ) : (
                      <Badge variant="neutral">Waitlist</Badge>
                    )}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/job/${selectedJobId}`)} aria-label={`View detail for ${candidate.name}`}>
                      Deep Dive
                    </Button>
                  </td>
                </tr>
              ))}
              {candidates.length === 0 && (
                <tr><td colSpan={4} className="px-10 py-16 text-center text-[var(--muted)] font-medium italic">No records matched in the current neural cluster.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--foreground)]/30 backdrop-blur-sm p-6">
          <Card variant="asym" className="bg-white w-full max-w-lg p-10 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-[var(--muted)] hover:text-[var(--foreground)] font-bold text-lg">✕</button>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] mb-2">Upload Candidate</h2>
            <p className="text-sm text-[var(--muted)] font-medium mb-8">
              Target pipeline: <span className="font-bold text-[var(--accent)]">{jobs.find((j: any) => j.id === selectedJobId)?.title}</span>
            </p>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const email = (form.elements.namedItem("email") as HTMLInputElement).value;
              const file = (form.elements.namedItem("cv") as HTMLInputElement).files?.[0];
              
              if (!file || !selectedJobId) return;
              
              setLoading(true);
              try {
                await candidateService.createCandidate(selectedJobId, email, file);
                setIsModalOpen(false);
                // Trigger reload
                const data = await candidateService.getCandidatesByJob(selectedJobId);
                setCandidates(data);
              } catch (err) {
                console.error("Upload failed:", err);
              } finally {
                setLoading(false);
              }
            }} className="space-y-6">
              <Input name="email" type="email" label="Candidate Email" placeholder="email@example.com" required />
              <div className="group">
                <label className="block text-[13px] font-black uppercase tracking-[0.1em] text-[#86868B] mb-3 ml-1 group-focus-within:text-[var(--accent)] transition-colors">
                  Resume / CV (PDF)
                </label>
                <div className="relative border-2 border-dashed border-[#D2D2D7] rounded-[16px] p-8 text-center hover:border-[var(--accent)] transition-colors cursor-pointer group/upload">
                  <input name="cv" type="file" accept=".pdf,.doc,.docx" required className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="text-[var(--muted)] group-hover/upload:text-[var(--accent)] transition-colors">
                    <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                    <p className="text-sm font-bold">Click or drag to upload neural profile</p>
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Processing..." : "Initiate Analysis"}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}

function SidebarItem({ label, active, onClick, icon, ariaSelected }: any) {
  return (
    <button onClick={onClick}
      role="tab"
      aria-selected={ariaSelected}
      className={`flex items-center gap-3 px-5 py-4 rounded-[0.75rem_0.25rem_0.75rem_0.25rem] transition-all text-sm font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
        active ? "bg-[var(--accent-subtle)] text-[var(--accent)] sidebar-active" : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-alt)]"
      }`}>
      <span className="text-xs opacity-60" aria-hidden="true">{icon}</span>
      {label}
    </button>
  );
}
