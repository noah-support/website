const OUTLETS = [
  {
    name: "Belgium Startup Award winner",
    href: "https://www.startupawards.be/",
  },
  { name: "start-it KBC", href: "https://startit.be" },
  { name: "Forbes", href: "https://www.forbes.com" },
  { name: "Tectonic", href: "https://www.tectonicconf.eu/" },
];

export default function Featured() {
  return (
    <section className="relative isolate border-y border-noah-ink-hairline bg-noah-cream px-6 py-16 sm:px-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
        <p className="font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
          As featured in
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {OUTLETS.map((outlet) => (
            <a
              key={outlet.name}
              href={outlet.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-lg text-noah-ink-dim transition-colors duration-200 hover:text-noah-ink sm:text-xl"
            >
              {outlet.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
