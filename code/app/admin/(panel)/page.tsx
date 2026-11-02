export const metadata = { title: "Analytics" };

const DASHBOARDS = [
  {
    name: "Google Analytics",
    detail: "Users, sessions, and pages.",
    href: "https://analytics.google.com/analytics/web/",
  },
  {
    name: "Snitcher",
    detail: "Companies that visited the site.",
    href: "https://app.snitcher.com/",
  },
];

export default function AnalyticsPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10">
      <div>
        <h1 className="font-display text-4xl text-noah-ink">Analytics</h1>
        <p className="mt-2 font-body text-sm text-noah-ink-dim">Open the dashboards for traffic and identified companies.</p>
      </div>
      <ul className="flex flex-col">
        {DASHBOARDS.map((dashboard) => (
          <li key={dashboard.href} className="border-t border-noah-ink-hairline py-4">
            <a href={dashboard.href} target="_blank" rel="noreferrer" className="group flex flex-wrap items-baseline justify-between gap-3">
              <span>
                <span className="font-display text-2xl text-noah-ink group-hover:underline">{dashboard.name}</span>
                <span className="mt-1 block font-body text-sm text-noah-ink-dim">{dashboard.detail}</span>
              </span>
              <span className="font-body text-sm text-noah-ink-dim">Open</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
