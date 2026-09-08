# Liquid Glass on the web: agent instructions

Everything an agent needs to build a website in Apple's Liquid Glass style. What the material actually is, how to build it in a browser, and where it breaks.

Read section 1 and section 10 before writing any code. Section 10 is where most implementations fail.

---

## 1. What Liquid Glass actually is

Apple introduced it at WWDC 2025 for the 2025 OS releases (iOS 26, macOS Tahoe and the rest). Apple's own framing is a digital meta-material that bends and shapes light.

The important technical distinction: **it lenses rather than scatters.** Frosted glass scatters light, which is what `backdrop-filter: blur()` does. Liquid Glass concentrates and bends light like a lens. Content behind it warps through the edges while the centre stays comparatively clear. Get this wrong and you have built 2020 glassmorphism with a new name.

Four things combine to make the material:

1. **Refraction.** Content behind the element displaces through the curved edges. Strongest at the border, near zero at the centre.
2. **Specular highlights.** A bright edge where light catches the rim. On Apple devices these shift with device motion.
3. **Adaptive contrast.** The material samples what is behind it and adjusts its own tint and text colour to stay legible.
4. **Fluid morphing.** Controls expand, contract, merge and split during interaction. The glass behaves like a soft body, not a rigid panel.

Apple ships two tiers:

- **Regular.** The default. More frosting, adaptive, safe over unpredictable content. Use this for anything with text in or near it.
- **Clear.** Much more transparent, for media-rich contexts. It needs a dimming layer underneath to stay legible. Use it rarely.

**Instruction:** default to Regular. Reach for Clear only over deliberately chosen dark imagery, and always with a scrim.

---

## 2. The layer model

This is the part that carries the style, more than the optics do.

- There is a **content layer** and a **glass layer**. Content fills the space. Glass floats above it as controls and navigation.
- **Glass never sits on glass.** One translucent layer at a time in any given stack. Two stacked glass surfaces read as mud and the compositing cost doubles.
- Glass is for **controls and chrome**, not for content containers. Navigation, toolbars, floating action groups, sheets, tab bars.
- Content extends **edge to edge and scrolls under the glass.** That is the whole point. If your glass nav has an opaque page behind it that stops at its edge, the material has nothing to refract and the effect is pointless.
- Glass elements group. Related controls share one glass surface rather than each getting their own.

**Instruction:** before styling anything, decide which elements are content and which are chrome. Only chrome gets glass. If you cannot justify an element as chrome, it stays solid.

---

## 3. Geometry

- **Capsule and rounded-rectangle shapes.** Fully rounded pills for buttons and segmented controls.
- **Concentric radii.** A rounded element inside a rounded container shares the same centre of curvature. Inner radius equals outer radius minus the padding. Never nest a 16px radius inside a 12px radius.
- Radii are generous. 20 to 32px for panels, full pills for controls.
- Glass elements float clear of the edges with real margin around them. They do not span the full width flush to the viewport.

---

## 4. Building the optics: three levels

Pick a level and commit. Do not mix.

### Level 1: frosted baseline (works everywhere)

Not real Liquid Glass, but the honest floor. Use it as the fallback for levels 2 and 3.

```css
.glass {
  position: relative;
  isolation: isolate;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.18);

  /* the tint. keeps text legible and gives the glass a body */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.14),
    rgba(255, 255, 255, 0.06)
  );

  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);

  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.35),      /* the float */
    inset 0 1px 0 rgba(255, 255, 255, 0.45), /* top specular rim */
    inset 0 -1px 0 rgba(255, 255, 255, 0.10); /* bottom bounce */
}
```

The `saturate(180%)` matters. It is what stops the blur looking grey and dead.

### Level 2: real refraction with an SVG displacement map (Chromium only)

This is what gets you actual lensing. It works by pointing `backdrop-filter` at an SVG filter rather than a blur function.

```html
<svg width="0" height="0" aria-hidden="true" style="position:absolute">
  <filter id="lens" x="0" y="0" width="100%" height="100%"
          color-interpolation-filters="sRGB">
    <feImage href="DISPLACEMENT_MAP_DATA_URI" result="map"
             preserveAspectRatio="none"/>
    <feDisplacementMap in="SourceGraphic" in2="map"
                       scale="58"
                       xChannelSelector="R" yChannelSelector="B"
                       result="warped"/>
    <feGaussianBlur in="warped" stdDeviation="0.7"/>
  </filter>
</svg>
```

```css
.glass--lens {
  backdrop-filter: url(#lens);
}
```

**Non-negotiable details:**

- `color-interpolation-filters="sRGB"` is mandatory. SVG filters default to linearRGB, which remaps the map's neutral grey and injects a constant phantom displacement across the whole element.
- The host `<svg>` must be in the DOM and must not be `display: none`. Give it zero size and absolute position instead.
- Neutral in the map is `rgb(128, ?, 128)` for R and B channels. Anything off-centre displaces.

**Generating the displacement map.** Draw it on a canvas at the element's size, then export as a data URI:

1. For each pixel, compute the signed distance to the rounded-rect edge.
2. Inside the central region, write neutral grey. No displacement.
3. Within an edge band of roughly 10 to 20% of the smaller dimension, write the inward surface normal. Horizontal component into the red channel, vertical into the blue channel, both offset from 128.
4. Ramp the magnitude smoothly from zero at the inner boundary to maximum at the edge. A smoothstep curve reads as glass. A linear ramp reads as a cheap bevel.
5. Regenerate on resize. The map is size-specific.

### Level 3: add chromatic aberration

The rainbow fringing at the rim. Three displacement passes at slightly different scales, one per colour channel, recombined.

```html
<filter id="lens-chroma" color-interpolation-filters="sRGB">
  <feImage href="MAP" result="map" preserveAspectRatio="none"/>

  <feDisplacementMap in="SourceGraphic" in2="map" scale="64"
                     xChannelSelector="R" yChannelSelector="B" result="dR"/>
  <feDisplacementMap in="SourceGraphic" in2="map" scale="58"
                     xChannelSelector="R" yChannelSelector="B" result="dG"/>
  <feDisplacementMap in="SourceGraphic" in2="map" scale="52"
                     xChannelSelector="R" yChannelSelector="B" result="dB"/>

  <feColorMatrix in="dR" result="cR" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
  <feColorMatrix in="dG" result="cG" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
  <feColorMatrix in="dB" result="cB" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"/>

  <feBlend in="cR" in2="cG" mode="screen" result="rg"/>
  <feBlend in="rg" in2="cB" mode="screen" result="rgb"/>
  <feGaussianBlur in="rgb" stdDeviation="0.6"/>
</filter>
```

Keep the scale spread small. A 10 to 20% difference between channels is plenty. More than that looks like a broken video codec.

### Browser reality

`backdrop-filter: url()` with an SVG filter reference is **Chromium only**. Safari and Firefox need a fallback. Detect and degrade:

```css
.glass { /* level 1 styles, always applied */ }

@supports (backdrop-filter: url(#lens)) {
  .glass { backdrop-filter: url(#lens); }
}
```

`@supports` is unreliable for this specific case, so also feature-detect in JS by applying the filter and checking the computed style, then add a `.has-lens` class to `<html>`.

Two further limits worth stating plainly. SVG displacement filters have no super-sampling, so the warp looks slightly pixelated. A small blur after the displacement softens it but does not fix it. And this technique only works on fixed-size rounded rectangles and circles. Apple's version lenses arbitrary shapes including text and icons. Yours will not.

---

## 5. Motion

Motion is half the material. Static glass is just a texture.

- **Morph, do not fade.** When a control expands into a menu, the glass surface should stretch and reflow into the new shape. Shared-element transitions, not crossfades.
- **Spring easing.** Use a spring or a strong ease-out. Something in the region of `cubic-bezier(0.22, 1, 0.36, 1)`. No linear, no ease-in-out.
- **Short durations.** 200 to 350ms for control response. Longer only for a deliberate narrative reveal.
- **Highlights track the pointer.** Apple's rim highlights respond to device tilt. On the web, map pointer position to the angle of the specular gradient. Keep it subtle, and throttle it to one update per frame.
- **Gel on press.** A small scale-down plus a brief rim brighten on `:active`. It should feel like pressing something soft.
- **Never animate `backdrop-filter` or `blur()`.** It forces a full recomposite every frame and will tank the frame rate. Animate `transform`, `opacity` and `box-shadow` only.
- **Everything interruptible.** No transition traps the user.

---

## 6. Colour and tint

- Glass has almost no colour of its own. It takes colour from what is behind it.
- Tint with very low alpha white or black, plus saturation boost. Not with brand colour.
- If you need brand colour on glass, put it on a small solid element sitting on top of the glass, not in the glass itself.
- Light mode glass leans white-tinted. Dark mode leans black-tinted with a stronger white rim. These are different token sets, not one set with an inverted variable.
- Glass works far better over dark and mid-tone backdrops. Over light backgrounds it disappears and the specular rim has nothing to contrast against.

---

## 7. Typography on glass

Apple's own rollout got this wrong and the criticism was specific and sustained. Learn from it.

- **Never put body copy on glass.** Labels, single lines and numbers only.
- Bump the weight one step up from what you would use on a solid background. Regular becomes Medium. Medium becomes Semibold.
- Add a small amount of letter spacing. Around 0.01em. It opens the counters enough to survive the busy backdrop.
- Increase the size slightly versus the same text on solid.
- Do not use text shadows to fake contrast. Add a dimming layer behind the glass instead.
- Test every text-on-glass instance over the lightest and the darkest backdrop it can ever land on. Not the average.

---

## 8. Where to use it, and where not to

**Use glass for:**

- The floating navigation bar or header.
- A floating action group or toolbar.
- Modals, sheets and popovers.
- Small cards that overlay media.
- Player controls over video or imagery.

**Do not use glass for:**

- The page background.
- Text-heavy content sections.
- Every card in a grid.
- Form fields and long inputs.
- Tables and data.
- Anything a person needs to read for more than a few seconds.
- Two nested surfaces at once.

**Instruction:** count the glass surfaces on the page. If there are more than three or four, you are using it as a texture rather than as a material, and the page will feel cheap and run slowly.

---

## 9. Accessibility

Honour all four of these. They are not optional and the browser support exists.

```css
/* the user has asked for less transparency */
@media (prefers-reduced-transparency: reduce) {
  .glass {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: var(--glass-solid-fallback);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
}

/* the user has asked for more contrast */
@media (prefers-contrast: more) {
  .glass {
    backdrop-filter: blur(8px);
    background: var(--glass-solid-fallback);
    border-color: currentColor;
  }
}

@media (prefers-reduced-motion: reduce) {
  .glass, .glass * { transition: none !important; animation: none !important; }
  /* and disable the pointer-tracked highlight in JS */
}

@media (forced-colors: active) {
  .glass {
    backdrop-filter: none;
    background: Canvas;
    border: 1px solid CanvasText;
  }
}
```

Beyond the media queries:

- Every text-on-glass combination must clear **4.5:1 contrast** against the worst-case backdrop, not the average one.
- Glass must never be the only thing carrying meaning. It is delight, not information.
- Keyboard focus rings must be visible on glass. That usually means a solid, high-contrast ring rather than a translucent one.
- Do not require the user to change a setting to be able to read your page. Legibility is the default, not the accommodation.

---

## 10. Performance

`backdrop-filter` is one of the most expensive properties on the web. SVG-filter backdrops are worse.

- **Cap the compositing layers.** Four translucent surfaces per screen, maximum.
- **Cap the blur radius.** Around 40px on mobile, 60px on desktop. Beyond that the cost climbs and it just looks milky anyway.
- **Never animate blur or filters.**
- **Never apply glass to a large scrolling area.** A full-viewport glass panel over a scrolling page recomposites the whole viewport every frame.
- Displacement map generation is O(width × height). Generate once, cache, regenerate on a debounced resize only.
- Use `contain: paint` on glass containers to limit the repaint area.
- Use `will-change: transform` only on elements actively animating, and remove it after.
- Test on a mid-range Android device, not on your laptop. Chrome on a mid-tier phone is where this style dies.
- Budget: the page still hits 60fps while scrolling with all glass surfaces visible. If it does not, remove a glass surface. Do not optimise around it.

---

## 11. Token set to start from

```css
:root {
  /* regular glass, dark backdrop */
  --glass-tint-top:    rgba(255, 255, 255, 0.14);
  --glass-tint-bottom: rgba(255, 255, 255, 0.06);
  --glass-blur:        24px;
  --glass-saturate:    180%;
  --glass-border:      rgba(255, 255, 255, 0.18);
  --glass-rim:         rgba(255, 255, 255, 0.45);
  --glass-shadow:      0 24px 60px rgba(0, 0, 0, 0.35);
  --glass-radius:      24px;

  /* clear glass. use sparingly, always over a scrim */
  --glass-clear-tint:  rgba(255, 255, 255, 0.06);
  --glass-clear-blur:  12px;

  /* the fallback. every glass surface needs one */
  --glass-solid-fallback: rgba(28, 28, 32, 0.92);

  /* motion */
  --glass-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --glass-duration: 280ms;
}
```

Build a `Default` and a `Fallback` variant of every glass component from the start. Retrofitting the fallback later never happens properly.

---

## 12. Anti-patterns

- Glass on glass.
- Glass over a light or busy background.
- Body text on glass.
- Glass as the page background.
- Every card in a grid made of glass.
- A blur radius above 60px, which reads as milky plastic rather than glass.
- Animating `backdrop-filter`.
- Text shadows used to rescue contrast.
- Chromatic aberration turned up until it looks like a rendering fault.
- Shipping the Chromium-only refraction with no Safari fallback.
- Using SF Pro without a licence. Use `-apple-system, system-ui` so Apple devices get it natively and everyone else gets a sane fallback.

---

## 13. Review gate

- [ ] Can I name every glass surface on the page as chrome rather than content?
- [ ] Are there four or fewer glass surfaces per screen?
- [ ] Is there any glass on glass? (There must not be.)
- [ ] Does content scroll under the glass, edge to edge?
- [ ] Are radii concentric wherever elements nest?
- [ ] Does every text-on-glass instance clear 4.5:1 against its worst-case backdrop?
- [ ] Is there any body copy on glass? (There must not be.)
- [ ] Does Safari get a working frosted fallback?
- [ ] Are `prefers-reduced-transparency`, `prefers-contrast`, `prefers-reduced-motion` and `forced-colors` all handled?
- [ ] Are focus rings visible on every glass surface?
- [ ] Is anything animating `backdrop-filter`? (There must not be.)
- [ ] Does the page hold 60fps while scrolling on a mid-range phone?
- [ ] Does the glass carry only delight, never meaning?

---

## 14. Two honest limits

**You cannot match Apple's version.** Theirs runs on Metal with real-time lensing on arbitrary shapes, including text and icons, with adaptive per-pixel contrast sampling. The web gives you fixed rounded rectangles, Chromium-only refraction, no super-sampling, and manual fallbacks. A good web implementation is a convincing impression, not a reproduction. Plan for the impression.

**It is a borrowed identity.** Liquid Glass is unmistakably Apple's. On a non-Apple product it reads either as a tribute or as a derivative, and it dates the work to a specific year. If the brand's positioning is that it is building something new, adopting another company's current design language works against that. Use the underlying ideas, which are layering, lensing, deference to content and fluid morphing. Do not use the surface as-is.
