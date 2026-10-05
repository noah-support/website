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
  "We start with your employees. Not a workshop. Not a slide deck. But Individual interviews, until your workflow is fully uncovered.",
  "Most transformations fail because they describe how work should look, then force people into that picture. We go the other way. We listen, we map what we hear, and we find the solution before anyone spends a quarter on consultants or new tools.",
  "The map is not the product. An actionable business case is, each one built from real team feedback and ranked so you know exactly where to start. But identifying the problem is only half the battle. From scoping stakeholders and running live MVP experiments to evaluating the hard numbers, Noah stays by your side to help you build the permanent fixes that actually transform your business.",
  "Noah has a small team on purpose. Fewer people in the room, more of the work in the product. Interview, map, ship.",
];

export const TEAM_HEADING = "Meet our team";

export const TEAM_SLOGAN = "A small team. One department at a time.";

export const TEAM: TeamMember[] = [
  {
    slug: "Denis",
    name: "Denis Leysen",
    role: "Founder & CEO",
    bio: "Denis spent years as an AI consultant at Datashift, helping some of Europe's largest organisations (Allianz, Securitas, Adidas, Luminus) figure out where AI could create real value. The process was always the same: months of interviews, workshops, and market research, all done manually. He knew it could be done faster, more objectively, and at a scale no consultant could match.",
    image: "/about/denis.jpg",
    alt: "Portrait of Denis Leysen",
  },
  {
    slug: "Tom",
    name: "Tom De Smedt",
    role: "Founder & CTO",
    bio: "Tom spent 13 years on the other side of the table, as IT manager at large organisations, sitting through endless agency demos and watching AI projects fail before they started. Not because the technology wasn't ready, but because nobody had done the homework to find the right problem first.",
    image: "/about/tom.jpg",
    alt: "Portrait of Tom De Smedt",
  },
  {
    slug: "César",
    name: "César Van Leuffelen",
    role: "Founder & CPO",
    bio: "César has always been drawn to the intersection of technology and real-world impact. While studying Applied Computer Science and later pursuing a Master in Applied IT, he didn't just learn the theory, he built things. From building a first business at 18 to an AI-powered tool for helping pathologists detect skin cancer, he has consistently turned ideas into working software.",
    image: "/about/cesar.jpeg",
    alt: "Portrait of César Van Leuffelen",
  },
  {
    slug: "Benjamin",
    name: "Benjamin Huyghe",
    role: "Founder 's associate",
    bio: "With his advanced master in AI from KULeuven, three years of experience as an AI consultant at Delaware, and an AI engineering background, Benjamin joined Noah with a lot of expertise and ambition regarding AI. As a former AI consultant, Benjamin recognised that there was a lot of time and money to be saved in the world of consulting. Leveraging this insight, he currently drives sales and business development at Noah.",
    image: "/about/benjamin.JPG",
    alt: "Portrait of Benjamin Huyghe",
  },
  {
    slug: "Roel",
    name: "Roel De Wever",
    role: "Sales Lead",
    bio: "Roel spent a decade building and leading sales teams from the ground up at Belgian scale-ups like Xpenditure, Rydoo and Mbrella, turning early traction into repeatable growth. As a sales leader, he felt the push to implement AI firsthand and saw what happens when teams rush in without thinking it through. At noah, he helps organisations find the right place for AI first.",
    image: "/about/roel.jpeg",
    alt: "Portrait of Roel De Wever",
  },
  {
    slug: "Nick",
    name: "Nick De smedt",
    role: "Compliance & Cyber sec.",
    bio: "Nick is an experienced IT professional with a speciality in cyber security, compliance & cloud.",
    image: "/about/nick.jpeg",
    alt: "Portrait of Nick De Smedt",
  },
  {
    slug: "Patryk",
    name: "Patryk Radkowski",
    role: "Junior sales",
    bio: "Patryk recently graduated in KMO Management and joined Noah driven by a passion for startups. Patryk is eager to learn everything he can about sales, driven by the ambition to help build something meaningful from the ground up.",
    image: "/about/patryk.jpeg",
    alt: "Portrait of Patryk Radkowski",
  },
];

export const JOIN_TITLE = "Build this with us";

export const JOIN_BODY =
  "We are hiring people who would rather ship a map than present one. If that is you, look at the open roles.";

export const JOIN_CTA = "See open roles";

export const JOIN_IMAGE = "/about/team.JPG";

export const JOIN_IMAGE_ALT =
  "The Noah team talking together in a restaurant";
