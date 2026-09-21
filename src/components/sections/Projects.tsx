'use client';

import Image from 'next/image';
import { getFeaturedProjects } from '@/content/projects';
import { useHorizontalPin } from '@/components/animations/useHorizontalPin';
import { useGsapFadeIn } from '@/components/animations/useGsapFadeIn';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from '@/components/ui/Tag';

export function Projects() {
  const featured = getFeaturedProjects();
  const sectionRef = useHorizontalPin<HTMLDivElement>({
    trackSelector: '[data-track]',
  });
  const headingRef = useGsapFadeIn<HTMLDivElement>();

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden bg-bg-primary py-[var(--section-padding)]"
    >
      <div
        ref={headingRef}
        className="mx-auto max-w-[var(--content-max-width)] px-6 md:px-10"
      >
        <SectionHeading className="mb-12">Selected Projects</SectionHeading>
      </div>

      {/* Desktop: pinned horizontal track. Mobile: vertical stack. */}
      <div
        data-track
        className="flex flex-col gap-8 px-6 md:flex-row md:flex-nowrap md:gap-10 md:px-10 lg:gap-16"
      >
        {featured.map((project, index) => (
          <article
            key={project.slug}
            data-cursor="hover"
            className="group relative w-full shrink-0 md:w-[60vw] lg:w-[55vw]"
          >
            <span className="absolute -top-10 left-0 font-display text-6xl font-extrabold text-white/5">
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
              {project.thumbnail.src ? (
                <Image
                  src={project.thumbnail.src}
                  alt={project.thumbnail.alt || project.title}
                  fill
                  className="object-cover transition-transform duration-slow ease-out-expo group-hover:scale-105"
                  sizes="(min-width: 1024px) 55vw, 100vw"
                />
              ) : null}
            </div>

            <div className="mt-6">
              <h3 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                {project.title}
              </h3>
              {project.description ? (
                <p className="mt-2 max-w-prose text-text-secondary">
                  {project.description}
                </p>
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
        ))}
      </div>
    </section>
  );
}
