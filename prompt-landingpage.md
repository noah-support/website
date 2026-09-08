# New website landingpage

I want this landingpage to feel like a story being tolled when scrolling through it.

## design

/skills
@design-language.md (for guidelines)

### scrolling mechanic

Pinned scroll is the mechanism. The section sticks to the viewport while the page keeps scrolling, and that scroll distance drives something else. In GSAP this is ScrollTrigger with pin: true and scrub: true. In CSS it is position: sticky plus scroll-driven animations.

Scroll-driven or scroll-linked animation is the general term for scroll position controlling animation progress instead of time. Scrubbing is the specific word for the reader dragging a timeline back and forth with their scroll.

Scrollytelling is the name when it is used narratively, with copy revealed beat by beat. It came out of data journalism.

Scrolljacking is the same family, but it is a criticism. It means the native scroll has been overridden so a flick of the wheel no longer moves the page a predictable distance. Snapping to full slides usually earns this label.

If elements move sideways while you scroll down, people call it pinned horizontal scroll or a horizontal scroll section.

The distinction worth keeping in your head is remapping versus overriding. If scrolling 500px still advances the story by a proportional 500px, that is scroll-linked and it feels good. If 500px gets swallowed and snapped into one slide transition, that is scrolljacking and people hate it.

## colors & fonts

- dark navy blue
- orange (#eb5c1c)
- Frauces -> Titles
- merriweather-sans -> general text

## navigation

- Header: I want a header that is just a lequid glass menu button in the top right. When you press it. A solid page should slide down with very big menu items and a contact button. Next to that buttons should be a login button (also liquid glass styled). Finally, left aligned I want the noah logo (@noah-logo) on a liquid glass pane.

- Footer: Do something that you think would look good

## Sections

> part x: I put this at after the title of a section to indicate that I want the following sections under it should be treated as parts togehter. When moving from one part to another. It should show a slider that fills when you keep scrolling but empties when you stop. Inside that slides should be a circle, left aligned with just the point of the arrow and when you keep scrolling the slider fills up and at all times in that slider should say 'go to part [x + 1]'

1. opening: there should be one big quote on the screen "you're either growing or you're dying" by Abraham Maslow. This should be styled like a quote with the name of the author below. The cursor should be turned into a fine circle with start in it. I want the background of this screen to be dark blurry overlay over the actual Hero.When you press anywhere on screen it should transitions into the actual hero (see below 2. hero) The transition is the bg blur that fades away and exposes the actual use case together with the text that slides out of screen to the top.

2. problem (part 1):

a. title: The page should be almost totally empty and should have in big letters the problem statement. "No organisation 's processes are perfect but the goal is to get as close as possible to make them perfect.".

transition: the 'a' text should disappear and the 'b' text should apear

b. different solutions:  The page should be almost totally empty and should have in big letters the problem statement. "Big organisations only have 2 options to accomplish this".

transition: 'b' text dissapears and two liquid glass pains swirls on the screen one-by-one.

c. This page should show in its final form 2 liquid glass pains that list the 2 options described below.

c1. Do it yourself: In the one payne, you show a title 'DIY' with a some of the cons in like no internal expertise, better ways to spend the time, takes a long time, etc.

c2. Consultant: In the second payne, you show a titel 'Consultant' with some of the cons in like expensive, takes a long time and subjective.

3. solution (part 2):

a. interviewer: when scrolling into this section do a scroll linked image sequence on a canvas using noah-laptop.gif. and towards the end, show a text next to it. title: 'interviews' subtitle: 'bottom-up interview a whole department in 24 hours to get there operational insights'

transition: the previous fade away when scrolling

b. processes: when scrolling into this section do a scroll linked image sequence on a canvas using noah-processes.gif. and towards the end, show a text next to it. title: 'mapping' subtitle: 'based on the conversation we map you processes and identify problems'

transition: the previous fade away when scrolling

c. business cases: when scrolling into this section make 3 panes with business cases appear. on every business case should be a rank, an time savings estimate, a money savings estimate and an explination of what is proposed.

transition: the previous fade away when scrolling

d. CTA: show a big piece of text. 'start with your first department today!' with a button to a meeting booking page that doesn't not yet exist. and in the left bottom the slider for the next part.

4. Vision: Look at the @vision.html folder to know what I mean but insteady of a picture in the middle. I would like to change that to show the 4 steps of the noah innovation circle. when you scroll to it, it sticks to the empty top 12 o'clock that shows discovery with the explination on the right of the circle. When you scroll, each quarter of a circle gets a dot on the outer line saying 1. discovery, 2. scoping, 3. MvP experiment and 4. Manage & control. (view @noahproductstrategy.pdf for what copy to add)

5. Clients: look at @clients.html

6. featured: look at @featured.html

8. features: look at @features.html

9. FAQ: improvise that works with the rest

10. CTA: improvise that works with the rest

## general notes

- make sure that it is mobile friendly aswell
- use the assests provided by me
- if not sure ask me the questions
- the panes I mentioned they should be 3D