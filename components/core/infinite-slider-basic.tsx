'use client';

import { InfiniteSlider } from '@/components/core/infinite-slider';

const businessTechnologies = [
  { name: 'Next.js', src: '/nextjs_logo.svg', role: 'Full-Stack React' },
  { name: 'TypeScript', src: '/typescript_logo.svg', role: 'Type-Safe Architecture' },
  { name: 'React', src: '/react_logo.svg', role: 'Reactive UI & Mobile' },
  { name: 'Python', src: '/python_logo.svg', role: 'Backend & Automation' },
  { name: 'PostgreSQL', src: '/postgresql_logo.svg', role: 'Relational Scale' },
  { name: 'AWS Cloud', src: '/aws_logo.svg', role: 'Cloud Infrastructure' },
  { name: 'Docker', src: '/docker_logo.svg', role: 'Containerization' },
  { name: 'Kubernetes', src: '/kubernetes_logo.svg', role: 'Cloud Orchestration' },
  { name: 'Node.js', src: '/nodejs_logo.svg', role: 'High-Throughput APIs' },
  { name: 'Redis', src: '/redis_logo.svg', role: 'In-Memory Cache & Queues' },
  { name: 'Cybersecurity', src: '/cybersecurity_logo.svg', role: 'Zero-Trust Defense' },
  { name: 'Cloudflare', src: '/cloudflare_logo.svg', role: 'Edge & Network WAF' },
  { name: 'GraphQL', src: '/graphql_logo.svg', role: 'API Protocols' },
  { name: 'Figma', src: '/figma_logo.svg', role: 'Design Systems' },
];

export function InfiniteSliderBasic() {
  return (
    <div className="w-full pt-16 pb-4 mt-12 border-t border-white/[0.06]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <span className="w-6 h-px bg-[#8fc4ed]/60 inline-block" />
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#8fbbe1]">
            ENGINEERING ECOSYSTEM & TECHNOLOGIES
          </span>
        </div>
        <p className="text-xs text-[#8e9dae] font-sans">
          Engineered with modern frameworks, resilient cloud infrastructure, and zero-trust security.
        </p>
      </div>

      <div className="overflow-hidden mask-fade-edges py-3">
        <InfiniteSlider gap={24} reverse speed={36} speedOnHover={14}>
          {businessTechnologies.map((tech) => (
            <div
              key={tech.name}
              className="flex items-center justify-center px-6 py-3.5 rounded-2xl bg-[rgba(8,16,28,0.65)] border border-[rgba(144,202,255,0.12)] backdrop-blur-xl hover:border-[rgba(144,202,255,0.4)] hover:bg-[rgba(14,28,48,0.85)] hover:shadow-[0_0_28px_rgba(70,150,240,0.25)] transition-all duration-300 group shrink-0 select-none cursor-default"
            >
              <img
                src={tech.src}
                alt={`${tech.name} logo`}
                className="h-[30px] w-auto object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200"
                draggable={false}
              />
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </div>
  );
}
