"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, StatCard, Badge } from "@/components/ui";
import { SkillGapCard } from "@/components/SkillGapRadar";
import { jobService } from "@/services/job.service";

export default function JobDetail() {
  const { id } = useParams();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobData, rankingData] = await Promise.all([
          jobService.getPosition(id as string),
          jobService.getRanking(id as string)
        ]);
        
        setJob(jobData);
        setCandidates(rankingData);
        if (rankingData.length > 0) {
          setSelected(rankingData[0]);
        }
      } catch (err) {
        console.error("Deep Dive Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)]">Synchronizing Neural Data...</p>
        </div>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No candidates analyzed yet</h2>
          <Button href="/dashboard">Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-[var(--foreground)] font-sans overflow-hidden">
      <div className="w-[400px] border-r border-[var(--border)] bg-[var(--surface-alt)]/30 p-10 overflow-y-auto">
        <Button href="/dashboard" variant="outline" size="sm" className="mb-8">
          ← Pipeline
        </Button>
        
        <header className="mb-14">
          <Badge className="mb-4">Pipeline Explorer</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] mb-2">{job?.title || "Position"}</h1>
          <p className="text-sm text-[var(--muted)] font-medium">Synced with Infrastructure Stack</p>
        </header>

        <div className="flex flex-col gap-5">
          {candidates.map((c) => (
            <CandidateRow key={c.id} candidate={c} active={selected.id === c.id} onClick={() => setSelected(c)} />
          ))}
        </div>
      </div>

      <div className="flex-1 p-20 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <Badge className="mb-4">Candidate Profile</Badge>
              <h2 className="text-6xl font-black tracking-tight mb-2 text-[var(--foreground)]">{selected.name}</h2>
              <p className="text-xl text-[var(--muted)] font-medium">{selected.email}</p>
            </div>
            <div className="score-ring p-8 bg-[var(--accent-subtle)] rounded-[2rem_0.5rem_2rem_0.5rem] border border-[rgba(108,92,231,0.12)] shadow-xl shadow-[#6c5ce7]/5">
              <div className="text-6xl font-black bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] bg-clip-text text-transparent mb-1">
                {Math.round(selected.overall_score * 100)}<span className="text-2xl opacity-50">%</span>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">Match Accuracy</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-16">
            <StatCard label="Semantic Depth" value={`${Math.round((selected.vector_score || 0.85) * 100)}%`} progress={(selected.vector_score || 0.85) * 100} variant="asym" />
            <StatCard label="Skill Graph Align" value={`${Math.round((selected.skill_score || 0.8) * 100)}%`} progress={(selected.skill_score || 0.8) * 100} variant="asym-alt" />
            <StatCard label="GNN Neural Potent" value={`${Math.round((selected.potential_score || 0.9) * 100)}%`} progress={(selected.potential_score || 0.9) * 100} variant="asym" />
          </div>

          <Card variant="sliced" className="relative !bg-[var(--surface-alt)] mb-12 dot-grid corner-ornament !p-12">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)] mb-8 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-[0.5rem_0.1rem_0.5rem_0.1rem] bg-[var(--accent)]" />
              Strategic Insight Engine
            </h3>
            <p className="text-2xl text-[var(--foreground)]/80 leading-relaxed font-semibold italic text-balance">
              &ldquo;{selected.reasoning || "Analysis pending neural cluster synchronization."}&rdquo;
            </p>
          </Card>

          <section className="mb-16">
            <SkillGapCard data={[
              { skill: "DS Architect", required: 0.9, actual: 0.82 },
              { skill: "Neo4j/Graph", required: 0.8, actual: 0.45 },
              { skill: "Python/API", required: 0.95, actual: 0.92 },
              { skill: "Cloud Arch", required: 0.85, actual: 0.72 },
              { skill: "Leadership", required: 0.6, actual: 0.88 }
            ]} />
          </section>

          <div className="grid grid-cols-1 gap-8">
            <Card variant="asym" className="p-10">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)] mb-8">Skill Evidence</h4>
              <div className="flex flex-wrap gap-3">
                {(selected.skills || ["Graph Topology", "Kafka Stream", "System Design"]).map((s: string) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateRow({ candidate, active, onClick }: any) {
  return (
    <Card 
      onClick={onClick}
      variant="asym"
      className={`p-6 cursor-pointer !bg-transparent !border-transparent ${
        active 
          ? "!bg-white !border-[var(--accent)] scale-[1.02] z-10 shadow-lg shadow-[#6c5ce7]/10" 
          : "hover:!border-[var(--border)] hover:!bg-white/50"
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className={`font-bold text-lg ${active ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>{candidate.name}</h4>
        <span className={`text-[13px] font-black ${active ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>{Math.round(candidate.overall_score * 100)}%</span>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex-1 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-700 ${active ? "progress-accent" : "bg-[var(--muted)]/30"}`} style={{ width: `${candidate.overall_score * 100}%` }} />
        </div>
        <span className="text-[9px] font-black text-[var(--muted)] uppercase tracking-widest">{candidate.matches || 0} MS</span>
      </div>
    </Card>
  );
}
