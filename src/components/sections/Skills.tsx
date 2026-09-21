'use client';

import { skills } from '@/content/skills';
import { useGsapFadeIn } from '@/components/animations/useGsapFadeIn';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils';

export function Skills() {
  const gridRef = useGsapFadeIn<HTMLDivElement>({
    stagger: 0.06,
    staggerSelector: '[data-skill]',
  });

  return (
    <section
      id="skills"
      className="mx-auto max-w-[var(--content-max-width)] px-6 py-[var(--section-padding)] md:px-10"
    >
      <SectionHeading className="mb-12">Skills</SectionHeading>

      <div
        ref={gridRef}
        className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4"
      >
        {skills.map((group) => (
          <div key={group.category}>
            <h3 className="mb-5 text-xs uppercase tracking-[0.2em] text-accent">
              {group.category}
            </h3>
            <ul className="flex flex-wrap gap-2.5">
              {group.items.map((skill) => (
                <li
                  key={skill.name}
                  data-skill
                  data-cursor="hover"
                  className={cn(
                    'rounded-lg border border-white/10 bg-bg-secondary px-4 py-2 text-sm',
                    'text-text-secondary transition-all duration-fast',
                    'hover:-translate-y-1 hover:border-accent/60 hover:text-accent',
                  )}
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
