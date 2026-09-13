type Outlet = {
  name: string;
  href?: string;
};

const OUTLETS: Outlet[] = [
  {
    name: "Belgium Startup Award winner",
    href: "https://www.startupawards.be/",
  },
  { name: "start-it KBC", href: "https://startit.be" },
  { name: "Forbes", href: "https://www.forbes.com" },
  { name: "Tectonic", href: "https://www.tectonicconf.eu/" },
];

export default function Featured({
  eyebrow = "As featured in",
  outlets = OUTLETS,
}: {
  eyebrow?: string;
  outlets?: Outlet[];
}) {
  return (
    <section className="relative isolate border-y border-noah-ink-hairline bg-noah-cream px-6 py-16 sm:px-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
        {eyebrow ? (
          <p className="font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
            {eyebrow}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {outlets.map((outlet) =>
            outlet.href ? (
              <a
                key={outlet.name}
                href={outlet.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-lg text-noah-ink-dim transition-colors duration-200 hover:text-noah-ink sm:text-xl"
              >
                {outlet.name}
              </a>
            ) : (
              <span
                key={outlet.name}
                className="font-display text-lg text-noah-ink-dim sm:text-xl"
              >
                {outlet.name}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
