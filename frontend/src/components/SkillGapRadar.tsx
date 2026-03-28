"use client";

import { Card, Badge } from "@/components/ui";

interface SkillData {
  skill: string;
  required: number;
  actual: number;
}

export function SkillGapRadar({ data }: { data: SkillData[] }) {
  const size = 320;
  const center = size / 2;
  const radius = size * 0.35;
  const levels = 4;

  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
    return {
      x_req: center + radius * d.required * Math.cos(angle),
      y_req: center + radius * d.required * Math.sin(angle),
      x_act: center + radius * d.actual * Math.cos(angle),
      y_act: center + radius * d.actual * Math.sin(angle),
      label_x: center + (radius + 40) * Math.cos(angle),
      label_y: center + (radius + 20) * Math.sin(angle),
      angle
    };
  });

  const generatePath = (type: 'req' | 'act') => {
    return points.map((p, i) => {
      const x = type === 'req' ? p.x_req : p.x_act;
      const y = type === 'req' ? p.y_req : p.y_act;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ' Z';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[320px] h-[320px]">
        <svg width={size} height={size} className="overflow-visible">
          {[...Array(levels)].map((_, i) => {
            const levelRadius = (radius / levels) * (i + 1);
            const path = points.map((p, j) => {
                const x = center + levelRadius * Math.cos((Math.PI * 2 * j) / data.length - Math.PI / 2);
                const y = center + levelRadius * Math.sin((Math.PI * 2 * j) / data.length - Math.PI / 2);
                return `${j === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ') + ' Z';
            return <path key={i} d={path} fill="none" stroke="#D2D2D7" strokeWidth="0.5" strokeDasharray="2 2" />;
          })}

          {points.map((p, i) => (
            <line key={i} x1={center} y1={center} x2={p.label_x} y2={p.label_y} stroke="#D2D2D7" strokeWidth="0.5" opacity="0.3" />
          ))}

          <path d={generatePath('req')} fill="rgba(108, 92, 231, 0.05)" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 2" />

          <path d={generatePath('act')} fill="rgba(162, 155, 254, 0.3)" stroke="var(--accent)" strokeWidth="3" className="drop-shadow-xl" />

          {points.map((p, i) => (
            <circle key={i} cx={p.x_act} cy={p.y_act} r="4" fill="var(--accent)" stroke="white" strokeWidth="2" />
          ))}

          {points.map((p, i) => (
            <text 
              key={i} 
              x={p.label_x} 
              y={p.label_y} 
              textAnchor="middle" 
              className="text-[10px] font-black uppercase tracking-widest fill-[#86868B]"
            >
              {data[i].skill}
            </text>
          ))}
        </svg>

        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-6 whitespace-nowrap">
           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#86868B]">
              <span className="w-3 h-0.5 bg-indigo-200 border border-dashed border-indigo-400" /> Target Requirement
           </div>
           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
              <span className="w-3 h-1 bg-[var(--accent)]" /> Candidate Mastery
           </div>
        </div>
      </div>
    </div>
  );
}

export function SkillGapCard({ data }: { data: SkillData[] }) {
  const analysis = data.sort((a, b) => (a.actual - a.required) - (b.actual - b.required))[0];
  const isCritical = analysis.required - analysis.actual > 0.3;

  return (
    <Card variant="asym" className="!p-10 flex flex-col md:flex-row gap-12 items-center bg-white shadow-xl shadow-indigo-100/20">
      <div className="flex-1 space-y-8">
        <div>
          <Badge className="mb-4">Neural Skill Radar</Badge>
          <h3 className="text-3xl font-black tracking-tight text-[#1D1D1F]">Competency Trajectory</h3>
          <p className="text-[15px] font-medium text-[#86868B] leading-relaxed mt-4">
            Autonomous gap evaluation between the ideal neural profile and the current candidate trajectory.
          </p>
        </div>

        <div className={`p-6 rounded-2xl border ${isCritical ? 'bg-rose-50 border-rose-100' : 'bg-indigo-50 border-indigo-100'}`}>
          <div className="text-[11px] font-black uppercase tracking-widest text-[#86868B] mb-3">Critical Insight</div>
          <p className={`text-[15px] font-bold leading-relaxed ${isCritical ? 'text-rose-600' : 'text-indigo-600'}`}>
            {isCritical 
               ? `Significant gap detected in ${analysis.skill}. Accelerated onboarding or specialized training required.`
               : `Optimal alignment in most vectors. Potential for high-impact deployment with minimal oversight.`}
          </p>
        </div>
      </div>

      <div className="w-full md:w-auto pt-6">
        <SkillGapRadar data={data} />
      </div>
    </Card>
  );
}
