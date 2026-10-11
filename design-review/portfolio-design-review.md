# Manav’s World: visual design review

Reviewed 11 October 2026. This is a proposal for discussion. No portfolio source files were changed during the review.

## Recommendation

Develop the existing concept into a calm personal observatory: a Mac-inspired desktop under a midnight sky, lavender controls, a purple introduction, warm paper for poetry, and a curated music collection. The next pass should make the existing experience coherent, readable, and dependable, then give it more personal detail.

The review combined live desktop and phone inspection, a source audit, primary Apple/W3C guidance, and reference portfolios. Proposed sizes, colors, motion timings, and layouts below are design choices for this website, not requirements from Apple.

## What already deserves to stay

- The starry background and quiet horizon establish atmosphere.
- A compact dock and familiar window controls give people a recognizable way to explore.
- About Me’s purple treatment supplies an identity color.
- Georgia and dark brown ink on ivory suit the poems. The current poem text colors have approximately 9.68:1 contrast.
- FoodFreaky supplies a concrete product story and measurable outcomes.
- Poetry and music give the portfolio a personal identity beyond its professional summary.

## 1. A coherent color and material system

Use the same window frame, corner shape, spacing rhythm, controls, and text hierarchy across every app. Individual app content can keep its own accent.

Proposed starting palette:

| Role | Starting color | Use |
| --- | --- | --- |
| Midnight | #101426 | Desktop background |
| Deep violet | #29243E | Quiet atmosphere and backdrop tint |
| Lavender | #B6A0E8 | Highlights on dark desktop surfaces |
| Violet | #76519F | Actions on light surfaces, checked for contrast |
| Lilac | #F0E7FA | About Me surface |
| Paper | #FFFDF7 | Poetry reading surface |
| Ink | #49382F | Poetry titles and text |

These colors need contrast checks in their actual combinations. Lavender should not become pale body text on white.

Reserve translucency for the menu bar, dock, title bars, and transient panels. Give projects and poems opaque or softly tinted reading surfaces. Use one subtle edge highlight and a consistent layered shadow for depth. Apple’s materials guidance separates navigation/controls from content and recommends restraint with glass effects. [Apple materials](https://developer.apple.com/design/human-interface-guidelines/materials)

## 2. Icon craftsmanship and dock hierarchy

The current dock uses 46px boxes on desktop and 34px on phones. Its illustrated silhouettes occupy different proportions: folders are wide, books narrow, and app tiles almost fill their artboards. Equal dimensions therefore create unequal apparent weight.

Keep the compact direction, starting around 40–44px on desktop. Normalize apparent size, baseline, illumination, edge definition, and shadow before further reducing everything. Use simple shapes readable at the actual dock size. The book’s small decorative marks should be reduced; the About icon could become a personal violet M/portrait tile.

Proposed identities: About = personal violet tile; Projects = blue folder; Music = record or note tile; Literature = plum book; Contact = blue envelope; Résumé = ivory document. Give all of them the same illustrated material language.

Keep labels available on keyboard focus as well as hover. Order the strongest routes deliberately: About, Projects, Poetry, Music, Contact, with smaller utilities collected together. An optional launcher could hold Terminal, Notes, and Résumé if the dock still feels crowded. Retain access to every existing app.

Apple recommends simple, recognizable ideas and warns that fine details are hard to discern at small sizes. [Apple app icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)

## 3. Typography and contrast

Use one clean sans-serif for the desktop, projects, and controls, while preserving Georgia for literature. The current DM Sans/Manrope pairing contributes less distinction than the serif already gives the poetry section.

Proposed type scale: 15–16px reading body; 12–13px meaningful secondary labels; 28–34px main app headings; 17–18px poem text where line lengths permit. Give paragraphs generous spacing instead of relying on tiny labels and wide letter spacing to appear refined.

Calculated examples from declared CSS colors on solid backgrounds:

| Text | Current approximate contrast |
| --- | --- |
| General paragraphs | 4.15:1 |
| Project metric captions | 2.74:1 |
| Contact secondary text | 2.63:1 |
| Literature introduction | 3.66:1 |
| Poem body | 9.68:1 |

These calculations are limited to the specified pairs; gradients and transparency require checking the actual rendered backgrounds. The normal-text benchmark is 4.5:1. Darken faint descriptions, captions, dates, and placeholders. Keep the poem ink. [W3C contrast guidance](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

## 4. Window behavior and composition

A polished desktop needs a stable frame as much as a good screenshot.

The live audit observed internal desktop scrolling during some browser interactions, moving window tops, menu bar, and dock out of position. Native pointer checks subsequently produced a stable view. This warrants investigation of focus/scroll behavior rather than assuming every interaction is broken.

The source also permits a 650px window to open at x=220 on an 800px-wide viewport, and drag bounds allow most of a window to move offscreen. The green control currently centres using an assumed width of 650px, including after a window has been resized.

Proposed improvements:

- Fix the desktop shell to the viewport; allow scrolling only inside app content.
- Clamp opening, dragging, and resizing to the usable desktop area, and adjust when browser dimensions change.
- Make the green control maximize and restore inside the portfolio desktop.
- Make the active window visibly distinct through title contrast, border, shadow, and controls.
- Bring windows forward when keyboard focus enters them.
- Give each app a useful default size: wider Projects, tall Poetry, compact Music.
- Preserve dimensions when minimizing/restoring.
- Offer a simple Show Desktop action.

The first view should be intentional: one well-positioned introduction with an obvious Explore My Work action. The wallpaper slogan should sit where that window does not cut through its text. [Apple windows](https://developer.apple.com/design/human-interface-guidelines/windows), [daedalOS window behavior](https://github.com/DustinBrett/daedalOS)

## 5. Projects as evidence

FoodFreaky’s current cover is attractive but primarily a wordmark and gradient. Real product screens would explain the work faster: ordering, status, administration, or invoices. Use imagery that can be shown without exposing customer information.

Present a concise gallery first. Each project should reveal purpose, contribution, outcome, and a clear next action. Then open a detailed case study for architecture, implementation, and decisions.

FoodFreaky: lead with a real screen, Co-founder / Backend & deployment, the existing user/revenue figures, and foodfreaky.in. Keep detailed specifications available through disclosure.

CIDA: show the document-to-question-to-answer flow with a genuine sample screen or clearly labelled illustration. Explain retrieval and model context through one simple visual.

Brittany Chiang’s portfolio is a useful reference for visible identity, experience, project imagery, and writing. The lesson is readable evidence within our own desktop layout. [Brittany Chiang](https://brittanychiang.com/)

## 6. Poetry as a reader

Keep the font and paper/ink palette the user likes. Replace the tall introductory cover and stacked full poems with a compact library and one selected poem.

On desktop, a small title list can sit beside the reading area; on mobile, use a compact selection list and full reading view. Add previous/next poem navigation and a distraction-free reading mode. Preserve stanza spacing and author attribution. Keep decorative textures extremely subtle.

The original handwritten page could become a View manuscript option after cropping out surrounding unrelated content. That would supply an authentic personal artifact. Empty Prose and Reading Notes sections can remain as quiet tabs rather than large boxes until content is ready.

## 7. Music that belongs to the world

After songs are provided, replace the temporary file picker as the main visitor experience with album art, track/artist metadata, a playlist, and one consistent transport control design. Optional mood collections can be created from Manav’s own choices.

The current audio element lives inside the Music window. Closing or minimizing it removes that element, so playback continuity needs to be implemented in a persistent controller. A small now-playing strip can let visitors keep listening while reading poems or projects.

Keep explicit sound control. Bruno Simon’s immersive portfolio includes audio and quality controls; the useful lesson is giving visitors control while they explore. [Bruno Simon](https://bruno-simon.com/)

## 8. A few personal and atmospheric details

Replace generic introduction language with details specific to Manav: backend engineering, co-founding FoodFreaky, poetry, and music. A chosen portrait or personal illustration would make About more memorable than the generic monogram alone.

Possible signature details: a handwritten signature in Literature; a short personal note explaining a favorite song; or a small constellation connecting Build, Write, and Listen. Choose one or two, so the desktop retains empty space.

Use a brief welcome-to-desktop transition and windows opening from their dock location. Suggested motion is around 180–240ms for controls/windows, adjusted through review. Keep reading areas still and honor reduced-motion preferences. Henry Heffernan’s portfolio demonstrates how coherent personal objects can make a computer setting feel inhabited. [Henry Heffernan](https://henryheffernan.com/)

## 9. A designed phone experience

The current phone layout fits every window into one shared position and shrinks the dock. A more polished version would show one active app as a comfortable sheet with a clear return-to-desktop control. Use a compact launcher when eight icons become crowded.

Keep the stars and personal apps while adapting their arrangement. Give touch controls ample hit areas even when their visible icons are small. Test at 320px, 390px, tablet widths, landscape, with the keyboard open, and with enlarged text. [W3C target and dragging guidance](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)

## Proposed sequence

| Pass | Scope | Expected benefit |
| --- | --- | --- |
| Foundation | Window bounds/focus, shared materials, type/contrast, optical icon balance | A cohesive and dependable desktop |
| Content | Product imagery, concise project gallery, poem library/reader, personal About details | A clearer professional and personal identity |
| Atmosphere | Curated music, persistent player, restrained transitions, selected personal details | A world visitors want to linger in |
| Final review | Mobile layout, keyboard/touch checks, load performance | A polished experience across devices |

The first implementation pass should concentrate on foundation improvements. It can be reviewed before committing to music, new artwork, or more elaborate motion.

## Scope and verification limits

No application code or deployment settings were changed for this research. Screenshots and browser observations were used for visual review; source-derived behavior risks are identified separately. The live FoodFreaky URL returned its app shell, but its complete runtime flow was not tested. Actual project screenshots, a portrait/illustration choice, and the final song list remain content inputs. Source structure and accumulated style overrides should be consolidated during implementation to make later design revisions reliable.
