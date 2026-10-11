# Toast queue

Use when: transient feedback with optional action. Not for: critical persistent errors (Alert) or confirmations (AlertDialog).

## Anatomy

Preserved ToastViewport/Root/Content/Icon/Message/Source/Text/Close/Actions/Progress and their existing toast-* classes/slots. Added `toast-live`, ToastQueueViewport.

## Props and data attributes

ToastProvider duration (5000ms), maxVisible (3), initialToasts, viewport (true), inline (false), label. useToast: toast({title,description,tone,action,duration}) → id; update(id,patch), dismiss(id?) (omit for all). duration 0/Infinity persists; large finite durations run in chunks no longer than 2³¹−1 ms and preserve elapsed time when paused. Hidden-document startup pauses before any timer starts. Latest maxVisible stack (a focused toast remains visible until focus leaves); older records wait, timers start when visible. Hover/focus expands and pauses all visible timers; blur/hidden document also pauses. Escape dismisses latest; pointer swipe over 60 CSS pixels dismisses. Background stacked cards are inert and aria-hidden. Finite-duration notifications display a live countdown bar. One provider-owned polite atomic live region serializes enqueue and update events, including repeated identical content, with a blank interval between announcements. Dismissals do not announce; multiple viewports share the same announcer. `data-tone`, `data-state=open|stacked|expanded`, `data-background`, `data-paused`, `data-variant=fixed|inline`.

Every DOM part forwards its ref, merges `className`, and supports `asChild` (unless explicitly noted). Exported `*Variants` cva functions supply base and modifier classes: their options style custom markup without requiring data attributes. Components also emit data attributes for integration hooks. Optional `displayAttributes({tone, variant, size, state, orientation, interactive, pulse})` from `badge` and the specialized `badgeAttributes`/`avatarAttributes` helpers continue to style markup through the same CSS rules. Supply semantic ARIA separately. All styling is in `src/styles/display.css`, inside `onyx.components`. Component variables use semantic fallbacks; override them on an ancestor or with `style`. Theme and density inherit from any ancestor.

## Tokens read

`--onyx-toast-{width,bg,border,radius,index}`, surface-menu, border-default, shadow-md, space/motion/z-toast, tones/focus.

## Headless hook

`useToastQueue(options)` exports the entire queue without markup, including visible/toasts/paused/expanded/setHovered/setFocused/remaining/defaultDuration. useToast accesses the provider. [Sonner source reference](https://github.com/emilkowalski/sonner/blob/main/src/index.tsx) informed pause, stacking and expansion; implementation is local, no new package.

When a focused toast or a toast containing focus disappears (dismissal, expiry or displacement), focus moves to the next surviving toast, otherwise the previous, preserving the data-slot control or control index where possible. With no surviving control, focus returns to the connected element focused before entering that viewport. If that element is unavailable, focus goes to the viewport (tabIndex=-1). Removal never steals focus from a control the user has already moved to. Focus inside a toast pauses expiry and prevents overflow displacement.
