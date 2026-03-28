"use client";

import { useState, useEffect } from "react";
import { Card, Input, Badge, Button } from "@/components/ui";

interface Node {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
}

interface Edge {
  source: string;
  target: string;
  label: string;
}

export function NeuralGraphExplorer() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Initial load or search
  const performSearch = async (searchTerm: string) => {
    setIsSearching(true);
    try {
      // In production, use the actual backend API
      // const response = await fetch(`http://localhost:8000/api/v1/graph/explore?q=${searchTerm}`);
      // const data = await response.json();
      
      // MOCK simulating backend logic for now to ensure front-end stability
      await new Promise(r => setTimeout(r, 1000));
      const mockResult = getMockGraph(searchTerm);
      setNodes(mockResult.nodes);
      setEdges(mockResult.edges);
    } catch (err) {
      console.error("Graph Error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    performSearch("Neo4j");
  }, []);

  return (
    <div className="w-full flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <Badge className="mb-4">Knowledge Graph</Badge>
          <h2 className="text-[40px] font-bold tracking-tight text-[#1D1D1F] leading-tight">Neural Relation Engine</h2>
          <p className="text-[17px] text-[#86868B] font-medium leading-relaxed max-w-xl">
            Visualize multi-dimensional skill clusters and discovery implicit candidate-to-skill trajectories.
          </p>
        </div>
      </header>

      <section className="flex flex-col gap-8">
        <Card variant="sliced" className="!p-8 !bg-white/80 !backdrop-blur-xl border-[#D2D2D7]/50 shadow-sm overflow-visible">
          <div className="flex gap-4 mb-10 overflow-visible relative">
            <div className="flex-1 relative">
               <Input 
                placeholder="Search specific skill or candidate relation (e.g. 'Neo4j to GNN Architects')"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && performSearch(query)}
                className="!py-6 !pl-14 !text-lg !rounded-[20px]"
              />
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--accent)] opacity-60">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
            <Button onClick={() => performSearch(query)} disabled={isSearching} className="!px-10 !rounded-[20px]">
              {isSearching ? "Mapping..." : "Extract Relations"}
            </Button>
          </div>

          {/* THE GRAPH CANVAS */}
          <div className="w-full h-[500px] bg-[#F5F5F7]/50 rounded-[32px] border border-[#D2D2D7]/30 relative overflow-hidden dot-grid group">
             <div className="absolute inset-0 bg-radial from-[var(--accent-subtle)] to-transparent opacity-40 blur-3xl" />
             
             <svg className="absolute inset-0 w-full h-full">
               {edges.map((edge, i) => {
                 const from = nodes.find(n => n.id === edge.source);
                 const to = nodes.find(n => n.id === edge.target);
                 if (!from || !to) return null;
                 return (
                   <line 
                     key={i}
                     x1={`${from.x}%`} y1={`${from.y}%`}
                     x2={`${to.x}%`} y2={`${to.y}%`}
                     stroke="var(--accent)"
                     strokeWidth="1.5"
                     strokeDasharray="4 4"
                     className="opacity-20 transition-opacity group-hover:opacity-40"
                   />
                 );
               })}
             </svg>

             {nodes.map((node) => (
               <div 
                 key={node.id}
                 className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:scale-110 cursor-pointer ${isSearching ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                 style={{ left: `${node.x}%`, top: `${node.y}%` }}
               >
                 <div className={`
                    p-4 rounded-[1.5rem_0.5rem_1.5rem_0.5rem] border shadow-xl flex flex-col items-center gap-2
                    ${node.type === 'skill' ? 'bg-white border-[var(--border)]' : 'bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] text-white border-transparent'}
                 `}>
                   <div className="text-[10px] font-black uppercase tracking-widest opacity-60">{node.type}</div>
                   <div className="font-bold text-[15px] whitespace-nowrap">{node.label}</div>
                 </div>
               </div>
             ))}

             {isSearching && (
               <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse">
                  <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-[13px] font-black uppercase tracking-widest text-[var(--accent)]">Traversing Neural Graph...</p>
               </div>
             )}
          </div>
        </Card>

        {/* BOTTOM INSIGHTS */}
        <div className="grid grid-cols-2 gap-8">
           <Card variant="asym" className="!p-8 !bg-white">
              <h4 className="text-[13px] font-black uppercase tracking-widest text-[#86868B] mb-6">Cluster Analysis</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[15px] font-medium p-4 bg-[#F5F5F7] rounded-xl">
                   <span>Related to "{query || 'Neural Core'}"</span>
                   <Badge variant="success">High Density</Badge>
                </div>
                <p className="text-sm text-[#86868B] italic leading-relaxed">
                  Detected implicit skill trajectory towards <strong>Deep Learning Expansion</strong> in {(Math.random() * 20 + 70).toFixed(0)}% of candidates.
                </p>
              </div>
           </Card>
           <Card variant="asym-alt" className="!p-8 !bg-white">
              <h4 className="text-[13px] font-black uppercase tracking-widest text-[#86868B] mb-6">Discovery Actions</h4>
              <div className="flex flex-col gap-3">
                <Button variant="outline" size="sm" className="w-full">Export Semantic Map</Button>
                <Button variant="outline" size="sm" className="w-full">Run Cross-Cluster Audit</Button>
              </div>
           </Card>
        </div>
      </section>
    </div>
  );
}

function getMockGraph(q: string) {
  // Simple deterministic random based on query string length
  const seed = q.length;
  return {
    nodes: [
      { id: "1", label: q || "Core", type: "skill", x: 50, y: 50 },
      { id: "2", label: "Candidate A", type: "candidate", x: 20 + (seed % 10), y: 30 },
      { id: "3", label: "Candidate B", type: "candidate", x: 80 - (seed % 10), y: 35 },
      { id: "4", label: "Next Skill", type: "skill", x: 45, y: 80 + (seed % 5) },
      { id: "5", label: `${q} Advanced`, type: "skill", x: 70, y: 70 },
    ],
    edges: [
      { source: "1", target: "2", label: "has_skill" },
      { source: "1", target: "3", label: "has_skill" },
      { source: "1", target: "4", label: "prerequisite" },
      { source: "1", target: "5", label: "advanced" },
    ]
  };
}
