# Apple design principles, as instructions

A working set of rules for designing in the Apple tradition. Written as instructions, not as history.

This is a synthesis, not an Apple document. It draws on three sources: the Apple Marketing Philosophy that Mike Markkula wrote in 1977, the clarity-deference-depth framework from Apple's Human Interface Guidelines, and the Dieter Rams principles that shaped Apple's industrial design under Jony Ive. Apple's own published guidelines cover app interfaces. The choreography of an apple.com product page is not documented anywhere, so those rules are drawn from observation.

Use it as a lens, not a template. A page that copies Apple's look is a knock-off. A page that follows Apple's reasoning arrives somewhere of its own.

---

## 0. How to use this

Read it once before you plan. Then use section 16 as a review gate after every build slice.

When a rule here conflicts with the project brief, the brief wins. Say out loud when that happens and why.

---

## 1. Start with empathy, focus and impute

The three founding rules. Everything else is downstream.

**Empathy.** Understand the person's needs better than any competitor does. Not their demographics. Their actual situation, in their own words. Design for what they are trying to get done, not for what you want to show them.

**Focus.** In order to do a good job of the things you decide to do, you have to eliminate the unimportant. This is the hardest of the three. Focus is not tidiness. It is refusing to include things that are genuinely good, because they would dilute the one thing that matters.

**Impute.** People form an opinion about the substance of a thing from the signals around it. A sloppy page implies a sloppy product. A page with obvious care in the small details implies a product built with the same care. You are not decorating. You are transmitting evidence about quality.

**Instruction:** before you design anything, write one sentence for each of the three. Who this is for, the one thing this page must do, and what quality signal it needs to send. If you cannot write them, you are not ready to design.

---

## 2. Clarity first

Clarity beats beauty, personality, cleverness and novelty. Every time.

- Text is legible at every size. If you have to squint, it fails.
- Every element has an obvious purpose. If you cannot say what a thing is for in one short sentence, remove it.
- The most important thing on the screen is visibly the most important thing.
- Nothing on the page requires an explanation of how to read it.

**Instruction:** show your design to someone for three seconds, then take it away. If they cannot say what the product does, the design has failed regardless of how it looks.

---

## 3. Defer to the content

The design is the frame. The content is the picture. The frame does not compete.

- Chrome, containers, borders and decoration earn their place or they go.
- Do not put a box around something to make it feel designed.
- Use full-bleed content and generous space instead of panels and cards.
- Backgrounds recede. If your background is the most interesting thing on the screen, you have inverted the hierarchy.

**Instruction:** delete every border, card, shadow and divider on the page. Add back only the ones whose absence actually broke comprehension. You will add back fewer than you removed.

---

## 4. Use depth to establish hierarchy

Layers and motion tell the person where they are and what relates to what.

- Depth means a legible sense of front and back, not drop shadows on everything.
- What is nearer is more important. Keep that consistent.
- Transitions show how one state became the next. They orient people, so they are not decoration.

**Instruction:** if two elements sit at the same visual depth, they should be of the same importance. If they are not, change the depth, not the colour.

---

## 5. Simplicity is subtraction, and it is expensive

Simple is not the same as easy or plain. Simplicity comes from understanding the problem so completely that you can remove everything that was compensating for not understanding it.

- The first design is never simple. It becomes simple through revision.
- Reducing the number of elements is not the goal. Reducing the number of things the person has to think about is the goal.
- Hiding complexity in a menu is not simplification. It is relocation.
- Say no to good ideas. Not just bad ones.

**Instruction:** after your design works, do a subtraction pass. Remove one thing. Then remove another. Stop when the next removal genuinely breaks it. Note what you removed and why, so you do not add it back later out of habit.

---

## 6. One idea per view

Each screen, each section, each scroll beat carries exactly one idea.

- A section that makes three points makes none.
- If a section needs two headlines, it is two sections.
- The person should be able to describe each section in one short phrase.

**Instruction:** write the single idea for each section as a one-line comment above it in the code. If you cannot, split the section or cut it.

---

## 7. Design the sequence, not the page

An Apple product page is not a layout. It is a film with a scrollbar. The reader controls the pacing, and the page is built to reward that control.

- Establish, then reveal, then explain, then prove, then close. In that order.
- Open with the thing itself, not with a claim about it.
- Withhold. Do not put every capability in the first viewport. Anticipation is a design material.
- Vary the rhythm. A dense section after two spacious ones lands harder. Uniform pacing reads as a brochure.
- Each beat should make the reader want the next one. If a section can be removed without breaking the momentum, remove it.
- Earn the reader's scroll. Every screen height you ask for must return something.

**Instruction:** storyboard the beats as a list of one-line descriptions before you write any markup. Read the list aloud. If it is boring as a list, no amount of animation will fix it.

---

## 8. Motion reveals, it does not perform

Motion exists to show what changed and to control pacing. Nothing else.

- Motion should feel like physics, not like animation. Things have weight and they settle.
- Ease out on entrances, so things arrive quickly and settle softly.
- Keep durations short. Around 200 to 300ms for interface response. Longer only for narrative reveals under scroll control.
- Everything is interruptible. Never trap the reader inside a transition.
- Scroll-linked motion must track the reader's input exactly. Any lag between finger and frame destroys the illusion of direct control, and direct control is the entire point.
- One memorable moment beats five pleasant ones. Spend your motion budget in a single place.
- Respect `prefers-reduced-motion` with a genuinely different static treatment, not a faster version of the same thing.

**Instruction:** for each animation, write down what information it conveys. Any animation whose answer is "it looks nice" comes out.

---

## 9. Typography is the primary material

On a page with no product photography, type carries the whole personality. Treat it as a designed object, not as a container for words.

- Set a real scale. Deliberate steps, not arbitrary sizes.
- Use very few sizes. Two or three for display, two for text.
- Large type wants tighter tracking and tighter leading. Small type wants the opposite.
- Line length under 80 characters. Give serif text slightly more leading than sans.
- Optical alignment beats mathematical alignment. Trust the eye over the number.
- Weight and size carry hierarchy. Colour is a last resort for that job.

**Instruction:** print your type scale as a specimen and look at it on its own. If the steps are not obviously distinct, the hierarchy will not read on the page either.

---

## 10. Let the subject supply the colour

Apple pages are usually neutral because the product provides the colour. Colour is used to identify, not to excite.

- Build on a neutral base. Introduce colour where it means something.
- Never use colour as the only carrier of information.
- Gradients are a material, not a decoration. If a gradient is not describing a surface, a light source or a depth, it is filler.
- Check contrast at the worst point, not the average point.

**Instruction:** convert your design to greyscale. The hierarchy must still read completely. If it collapses, you were using colour to do structure's job.

---

## 11. Space is not empty

White space is the most reliable signal of confidence on a page. Crowding signals doubt.

- Space groups and separates. Use it before you reach for a border or a rule.
- Give the most important element the most room around it.
- Be generous at the top and bottom of sections. Cramped vertical rhythm makes premium content look cheap.
- Space should be consistent and derived from a scale, not eyeballed per section.

**Instruction:** find the element you most want the reader to remember. Double the space around it. Look again.

---

## 12. Write the way Apple writes

Copy is design content. It fails the same way design fails, by trying too hard.

- Short declarative sentences. Often no verb at all in a headline.
- Sentence case. Plain verbs. Active voice.
- Specific beats superlative. A number is worth ten adjectives.
- Never explain the joke. If the design already conveys it, cut the caption.
- Name things the way the reader would name them, not the way the system is built.
- A button says what happens when it is pressed.
- Where a superlative is unavoidable, put the evidence next to it in the same breath.

**Instruction:** read every line aloud. Cut any word that survives only because it sounded professional.

---

## 13. Finish the parts nobody was asked to look at

This is the impute principle applied to craft. It is the difference between good and Apple.

- Alignment holds at every breakpoint, not just the one you designed in.
- Focus states are designed, not defaults.
- The empty state, the error state and the loading state get the same care as the hero.
- Loading states tell the truth about progress. A fake progress bar is a small lie about the product.
- Nothing shifts as the page loads.
- Hairlines are hairlines at every pixel density.

**Instruction:** resize the window slowly from 320px to 2560px and watch. Fix everything that stutters, collides or drifts.

---

## 14. Be honest

Rams' rule, and Apple's when it is at its best. The design must not make the product appear more capable or more valuable than it is.

- Do not imply capability the product does not have.
- Do not use imagery of an output that the product does not actually produce.
- Show real interface, real data and real numbers, or clearly show none.
- If a limitation matters to the buying decision, state it plainly. Confidence is a stronger signal than concealment.

**Instruction:** list every claim on the page. Next to each one, write where the evidence comes from. Cut the ones you cannot source.

---

## 15. What Apple does not do

Useful as a negative check.

- No stock photography of smiling people in offices.
- No three-column feature grid with an icon at the top of each card.
- No accenting one word of a headline in a different colour.
- No tracked-out all-caps labels above every heading.
- No arrow glyph appended to every link.
- No fade-and-slide-up entrance on every section.
- No badge, ribbon, starburst or countdown timer.
- No more than one call to action competing at the same moment.
- No exclamation marks in body copy.
- No decorative gradient washes behind text for no structural reason.
- No autoplaying audio, ever.

---

## 16. Review gate

Run this after each build slice. Answer each one in writing.

- [ ] Can I state the single idea of every section in one short phrase?
- [ ] Would a reader understand what this is in three seconds?
- [ ] Does the hierarchy survive in greyscale?
- [ ] Have I done a subtraction pass, and can I name what I removed?
- [ ] Does every animation convey information I can name?
- [ ] Is every motion interruptible, and is reduced motion genuinely handled?
- [ ] Does each screen height of scroll return something to the reader?
- [ ] Is there exactly one memorable moment, not five competing ones?
- [ ] Are the loading, empty and error states designed?
- [ ] Does the layout hold from 320px to 2560px without drift?
- [ ] Is every claim on the page sourced?
- [ ] Have I read all the copy aloud?
- [ ] Does anything on the page appear in section 15?

---

## 17. When to break these rules

These principles produce restraint. Restraint is right for a premium product aimed at a sceptical buyer. It is wrong for a children's game, a festival, a protest or anything whose job is joy or noise.

Apple's own design is a specific answer to a specific brief: expensive objects for a broad audience, sold on trust. If your brief is different, the reasoning here still applies but the output should not look like Apple.

Follow the reasoning. Do not copy the surface.
