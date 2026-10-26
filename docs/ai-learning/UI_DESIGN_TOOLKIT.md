# UI Design Toolkit

This is the default design workflow for Sentinel and the other venture applications. The tools are used in sequence so each has a clear job.

## Approved toolkit

| Order | Tool | Role | Use |
|---|---|---|---|
| 1 | [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Design intelligence | Choose an appropriate layout, palette, typography, interaction pattern, accessibility requirements, and responsive behavior. |
| 2 | [Google DESIGN.md](https://github.com/google-labs-code/design.md) | Project design contract | Record the approved design system in the repository before broad interface work begins. |
| 3 | [React Bits](https://github.com/DavidHDev/react-bits) | Optional React components and effects | Use individual components only when they improve comprehension, feedback, or task completion. |
| 4 | [GSAP](https://github.com/greensock/GSAP) | Optional motion system | Use for controlled storytelling, transitions, and marketing pages when motion has a defined purpose. |
| 5 | [Impeccable](https://github.com/pbakaus/impeccable) | Final visual review | Audit the built interface for generic AI patterns, weak hierarchy, spacing, responsiveness, accessibility, and visual consistency. |

## Required workflow

1. Write the user, task, device, environment, accessibility, and performance requirements.
2. Use UI/UX Pro Max to select a design direction appropriate to the product.
3. Create or update the project’s `DESIGN.md`.
4. Build the simplest complete interface using the project’s existing stack.
5. Add React Bits or GSAP only when the interaction has a stated user benefit.
6. Test mobile, tablet, desktop, keyboard, screen reader, reduced motion, loading, empty, error, success, and permission-denied states.
7. Run an Impeccable review and resolve material findings.
8. Capture screenshots and record the final checks with the release evidence.

## Required DESIGN.md contents

Every project design file must define:

- Product purpose, primary users, and primary tasks
- Brand attributes and visual direction
- Color tokens with contrast requirements
- Typography scale
- Spacing, radius, border, shadow, and elevation tokens
- Grid, containers, and breakpoints
- Navigation and page structure
- Component inventory and variants
- Forms, validation, tables, dashboards, and data-display rules
- Loading, empty, error, success, disabled, and permission-denied states
- Motion purpose, duration, easing, reduced-motion behavior, and stop conditions
- Mobile, tablet, desktop, keyboard, screen-reader, and touch requirements
- Content rules and prohibited visual patterns

## Design quality gates

A release fails the design review when:

- A primary task is unclear or unnecessarily long.
- Color contrast, keyboard access, focus indication, labeling, or touch targets fail.
- The interface breaks on an iPhone or iPad viewport.
- Loading, empty, error, success, or permission states are missing.
- Animation blocks interaction, causes disorientation, or ignores reduced-motion preferences.
- Components conflict with the project’s `DESIGN.md`.
- Decorative effects reduce readability or application performance.
- The interface uses generic dashboard cards, gradients, icons, or copy without a product reason.
- Screenshots were not reviewed at mobile, tablet, and desktop widths.

## Tool limits

- UI/UX Pro Max guides decisions; the project brief and user evidence control the result.
- DESIGN.md is the approved source of truth for the product, not a gallery of borrowed styles.
- React Bits and GSAP are optional dependencies. Review their current documentation, license, bundle impact, accessibility, and compatibility before adding them.
- Impeccable findings require judgment. A detector result is evidence for review, not an automatic design decision.
- Do not copy a recognizable third-party product design in a way that confuses ownership or identity.

## Project application

- **Sentinel:** restrained institutional interface, dense evidence workflows, explicit permissions, strong audit visibility, minimal decorative motion.
- **Island Leads:** mobile-first property comparison, source visibility, risk clarity, map and evidence usability.
- **VIVCO Signal:** production-readiness workflow, qualification states, manufacturing data clarity, confident Caribbean visual identity.
- **Terra Mobi Systems:** low-bandwidth, offline-capable field workflows, large touch targets, clear sync and verification states.
- **KandaSokoni:** commodity traceability, multilingual and low-connectivity support, trustworthy pricing and custody evidence.
