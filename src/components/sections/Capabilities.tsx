'use client';

import { skills } from '@/content/skills';
import { useGsapFadeIn } from '@/components/animations/useGsapFadeIn';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Capabilities() {
  const rowsRef = useGsapFadeIn<HTMLDivElement>({
    stagger: 0.08,
    staggerSelector: '[data-capability]',
  });

  return (
    <section
      id="capabilities"
      className="mx-auto max-w-[var(--layout-width)] px-[var(--safe)] py-[var(--spacer-lg)]"
    >
      <SectionHeading className="mb-12">Capabilities</SectionHeading>

      <div ref={rowsRef} className="border-t border-line">
        {skills.map((group, index) => (
          <div
            key={group.category}
            data-capability
            className="grid grid-cols-1 gap-4 border-b border-line py-8 transition-colors duration-fast hover:bg-surface-hover md:grid-cols-12 md:items-baseline"
          >
            <span className="font-mono text-xs text-text-secondary md:col-span-1">
              {String(index + 1).padStart(2, '0')}
            </span>

            <h3 className="font-display uppercase leading-none text-text-primary text-3xl md:col-span-4 md:text-5xl">
              {group.category}
            </h3>

            <div className="md:col-span-7">
              {group.description ? (
                <p className="text-text-secondary">{group.description}</p>
              ) : null}
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <li
                    key={skill.name}
                    className="rounded-sm border border-line px-3 py-1 font-mono text-xs text-text-secondary transition-colors duration-fast hover:text-text-primary"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
