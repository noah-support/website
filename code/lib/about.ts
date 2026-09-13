export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  alt: string;
};

export const ABOUT_QUOTE = `"We want to give corporations the ability to innovate like startups."`;

export const ABOUT_MANIFESTO = [
  "We start with the people who do the work. Not a workshop. Not a slide deck. Interviews, one department at a time, until the real process is on the table.",
  "Most transformations fail because they describe how work should look, then force people into that picture. We go the other way. We listen, we map what we hear, and we price the fix before anyone spends a quarter on consultants or new tools.",
  "The map is not the product. A priced business case is. Each one traces back to something a real person said, ranked so you know what to do first.",
  "We stay a small team on purpose. Fewer people in the room, more of the work in the product. Interview, map, ship.",
];

export const TEAM_HEADING = "Meet our team";

export const TEAM_SLOGAN = "A small team. One department at a time.";

export const TEAM: TeamMember[] = [
  {
    slug: "Denis",
    name: "Denis Leysen",
    role: "Founder & CEO",
    bio: "Denis spent years as an AI consultant at Datashift, helping some of Europe's largest organisations (Allianz, Securitas, Adidas, Luminus) figure out where AI could create real value. The process was always the same: months of interviews, workshops, and market research, all done manually. He knew it could be done faster, more objectively, and at a scale no consultant could match.",
    image: "/about/portrait-denis.jpg",
    alt: "Portrait of Denis Leysen",
  },
  {
    slug: "Tom",
    name: "Tom De Smedt",
    role: "Founder & CTO",
    bio: "Tom spent 13 years on the other side of the table, as IT manager at large organisations, sitting through endless agency demos and watching AI projects fail before they started. Not because the technology wasn't ready, but because nobody had done the homework to find the right problem first.",
    image: "/about/portrait-tom.jpg",
    alt: "Portrait of Tom De Smedt",
  },
  {
    slug: "César",
    name: "César Van Leuffelen",
    role: "Founder & CPO",
    bio: "César has always been drawn to the intersection of technology and real-world impact. While studying Applied Computer Science and later pursuing a Master in Applied IT, he didn't just learn the theory, he built things. From building a first business at 18 to an AI-powered tool for helping pathologists detect skin cancer, he has consistently turned ideas into working software.",
    image: "/about/portrait-cesar.png",
    alt: "Portrait of César Van Leuffelen",
  },
  {
    slug: "Benjamin",
    name: "Benjamin Huyghe",
    role: "Founder 's associate",
    bio: "Example",
    image: "/about/portrait-benjamin.jpg",
    alt: "Portrait of Benjamin Huyghe",
  },
  {
    slug: "Roel",
    name: "Roel De Wever",
    role: "Sales Lead",
    bio: "Example",
    image: "/about/portrait-roel.jpg",
    alt: "Portrait of Roel De Wever",
  },
  {
    slug: "Nick",
    name: "Nick De smedt",
    role: "Compliance & Cyber sec.",
    bio: "Example",
    image: "/about/portrait-nick.jpg",
    alt: "Portrait of Nick De Smedt",
  },
  {
    slug: "Patryk",
    name: "Patryk Radkowski",
    role: "Junior sales",
    bio: "Example",
    image: "/about/portrait-patryk.png",
    alt: "Portrait of Patryk Radkowski",
  },
];

export const JOIN_TITLE = "Build this with us";

export const JOIN_BODY =
  "We are hiring people who would rather ship a map than present one. If that is you, look at the open roles.";

export const JOIN_CTA = "See open roles";

export const JOIN_IMAGE = "/about/team.jpg";

export const JOIN_IMAGE_ALT =
  "The Noah team talking together in a bright office";
