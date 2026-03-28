"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { jobService } from "@/services/job.service";

export default function CreatePosition() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: [] as string[],
  });
  const [reqInput, setReqInput] = useState("");

  const addRequirement = () => {
    if (reqInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, reqInput.trim()]
      }));
      setReqInput("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await jobService.createPosition({
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to create job:", err);
      // Fallback for visual demo if backend is not running
      // await new Promise(r => setTimeout(r, 1200));
      // router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif] selection:bg-[var(--accent-subtle)]">
      <nav className="sticky top-0 z-50 w-full glass-panel px-8 py-4 flex justify-between items-center border-b border-[#D2D2D7]/30">
        <Link href="/dashboard" className="flex items-center gap-2 text-[15px] font-semibold text-[var(--accent)] hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-[13px] font-medium text-[#86868B] uppercase tracking-wider">Aura Position Architect</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] shadow-inner" />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto pt-20 pb-40 px-6">
        <header className="mb-16 text-center">
          <h1 className="text-[48px] md:text-[56px] font-bold tracking-tight leading-[1.1] mb-4 text-[#1D1D1F]">
            Define the <span className="bg-gradient-to-r from-[#6c5ce7] to-[#8e44ad] bg-clip-text text-transparent">Future.</span>
          </h1>
          <p className="text-[21px] text-[#86868B] font-medium max-w-2xl mx-auto leading-relaxed">
            Specify the technical core and behavioral matrix for your new neural pipeline.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          <Card variant="sliced" className="!p-10 !bg-white/80 !backdrop-blur-xl">
            <h2 className="text-[21px] font-bold mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#F5F5F7] flex items-center justify-center text-[14px]">01</span>
              Core Identity
            </h2>
            
            <div className="space-y-8">
              <Input 
                label="Position Title"
                placeholder="e.g. Lead Distributed Systems Engineer"
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />

              <Textarea 
                label="Contextual Description"
                placeholder="Describe the mission, technical stack, and cultural impact..."
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </Card>

          <Card variant="sliced" className="!p-10 !bg-white/80 !backdrop-blur-xl">
            <h2 className="text-[21px] font-bold mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#F5F5F7] flex items-center justify-center text-[14px]">02</span>
              Neural Requirements Matrix
            </h2>

            <div className="space-y-6">
              <div className="flex gap-3">
                <Input 
                  className="flex-1"
                  placeholder="Add specific skill, tool, or experience..."
                  value={reqInput}
                  onChange={e => setReqInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                />
                <Button onClick={addRequirement} className="!rounded-[16px] !px-8 !py-5 !bg-[#1D1D1F] !text-white hover:!bg-[#424245]">
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                {formData.requirements.map((req, i) => (
                  <span key={i} className="inline-flex items-center gap-3 px-5 py-3 bg-[#F5F5F7] border border-[#D2D2D7]/30 rounded-full text-[15px] font-semibold text-[#1D1D1F] animate-in fade-in zoom-in duration-300">
                    {req}
                    <button type="button" onClick={() => removeRequirement(i)} className="text-[#86868B] hover:text-[#FF3B30] transition-colors focus:outline-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </span>
                ))}
                {formData.requirements.length === 0 && (
                  <p className="text-[15px] text-[#86868B] italic py-4">No requirements defined yet. Our GNN models will suggest matches based on shared patterns if left empty.</p>
                )}
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <Link href="/dashboard" className="text-[17px] font-semibold text-[var(--accent)] hover:underline underline-offset-4 decoration-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg px-2">
              Cancel and Discard
            </Link>
            <Button 
              type="submit"
              disabled={loading || !formData.title}
              size="xl"
              className="min-w-[240px]"
            >
              {loading ? "Syncing..." : "Instantiate Pipeline"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
