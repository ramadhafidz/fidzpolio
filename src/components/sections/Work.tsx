'use client';

import { getFeaturedProjects } from '@/content/projects';
import { useMarquee } from '@/components/animations/useMarquee';
import { useGsapFadeIn } from '@/components/animations/useGsapFadeIn';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from '@/components/ui/Tag';

function projectYear(iso: string): string {
  return iso.slice(0, 4);
}

export function Work() {
  const featured = getFeaturedProjects();
  const trackRef = useMarquee<HTMLDivElement>({ speed: 30, direction: -1 });
  const headingRef = useGsapFadeIn<HTMLDivElement>();

  // Rendered twice so the loop is seamless: the tween advances exactly one
  // copy's width, so the duplicate takes the original's place. Built from a
  // single renderCards() so the two copies cannot drift apart.
  const renderCards = (keyPrefix: string, ariaHidden = false) =>
    featured.map((project, index) => (
      <article
        key={`${keyPrefix}-${project.slug}`}
        aria-hidden={ariaHidden || undefined}
        aria-label={ariaHidden ? undefined : project.title}
        className="group w-[70vw] shrink-0 md:w-[40vw]"
      >
        <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-sm border border-line bg-surface-hover">
          {/* CSS-only monochrome placeholder — lenis.dev carries no images here,
              and a hairline box with an index reads better than a recoloured
              gradient. */}
          <span className="font-display text-7xl text-text-primary/10">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display uppercase text-2xl leading-none text-text-primary md:text-3xl">
              {project.title}
            </h3>
            <span className="font-mono text-xs text-text-secondary">
              {projectYear(project.date)}
            </span>
          </div>
          {project.description ? (
            <p className="mt-2 max-w-prose text-text-secondary">{project.description}</p>
          ) : null}
          {project.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    ));

  return (
    <section
      id="work"
      className="overflow-hidden py-[var(--spacer-lg)]"
    >
      <div ref={headingRef} className="mx-auto max-w-[var(--layout-width)] px-[var(--safe)]">
        <SectionHeading className="mb-12">Selected Work</SectionHeading>
      </div>

      {/* Marquee renders the sequence twice so the loop is seamless.
          Below 1024px the track is a static vertical stack instead, so
          every card is reachable without the marquee. */}
      <div
        ref={trackRef}
        data-track
        className="flex flex-col gap-8 px-[var(--safe)] lg:flex-row lg:flex-nowrap lg:gap-12"
      >
        {renderCards('primary')}
        {renderCards('duplicate', true)}
      </div>
    </section>
  );
}
