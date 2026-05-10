import Link from 'next/link';

const features = [
  {
    title: 'Architecture & System Design',
    description:
      'Overview of the Yomu monorepo, service boundaries, and communication patterns between Java, Rust, and Next.js.',
  },
  {
    title: 'Java Backend Service',
    description:
      'Auth, users, articles, quizzes, and the outbox pattern. Built with Spring Boot 4 and Java 21.',
  },
  {
    title: 'Rust Gamification Engine',
    description:
      'Achievements, missions, daily rewards, clans, and Redis-backed leaderboards. Clean Architecture with Axum 0.8.',
  },
  {
    title: 'Next.js Frontend',
    description:
      'BFF proxy pattern, shadcn/ui components, React Server Components, and Zod v4 validation on a Tailwind v4 canvas.',
  },
  {
    title: 'CI/CD Pipeline',
    description:
      'Multi-stage Docker builds, PMD linting, JaCoCo coverage, nextest parallel testing, and OWASP dependency checks.',
  },
  {
    title: 'Development Guide',
    description:
      'Setup instructions, conventions, API response format, anti-patterns, and how to run the full stack locally.',
  },
];

const techStack = [
  'Spring Boot 4',
  'Rust 2024',
  'Next.js 16',
  'PostgreSQL',
  'Redis',
  'Docker',
  'GitHub Actions',
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center flex-1">
      {/* Hero */}
      <section className="flex flex-col items-center text-center py-24 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Yomu Documentation
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Comprehensive docs for the Yomu polyglot learning platform
        </p>
        <p className="mt-6 text-muted-foreground max-w-prose">
          Yomu is a full-stack learning platform built with a Java auth and user
          service, a Rust gamification engine, and a Next.js frontend. Explore
          the docs to learn about the architecture, development workflow, and
          deployment pipeline.
        </p>
        <Link
          href="/docs"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse Documentation
        </Link>

        {/* Tech stack badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Feature highlights */}
      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <h3 className="font-semibold text-card-foreground">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
