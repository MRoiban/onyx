# W4 — Display and layout implementation report

Work is uncommitted on `feat/primitives-expansion`. Only W4 source, CSS, gallery, tests, docs and screenshots were edited. No shared manifests, index, globals, Tailwind config, Kbd or Code were edited.

## Files changed

- `src/components/{badge,tag,alert,card,avatar,skeleton,meter,separator,link,breadcrumb,layout}.tsx` — implemented W0 stubs.
- `src/components/{toast,progress,empty-state}.tsx` — extended existing APIs.
- `src/components/display.test.tsx` — 15 behavior/ARIA tests.
- `src/components/progress.test.tsx` — updated the old styling assertion for token CSS; kept normalization/ARIA test.
- `src/styles/display.css` — layered token styling, tone mappings, density/theme inheritance and reduced motion.
- `gallery/sections/display.tsx` — real section 6 and 7 demos plus named `DisplayActions` in section 2.
- `docs/primitives/{badge,tag,alert,card,avatar,skeleton,meter,separator,link,breadcrumb,layout,toast,progress,empty-state}.md` and this report.
- `gallery/screenshots/w4-*.png` — screenshot artifacts listed below. The gallery’s generated `onyx.css` was regenerated with the normal build script.

## Public APIs

Every DOM part forwards its ref, merges className with cn, has a slot, and exposes relevant tone/variant/size/state attributes. Single-element parts support asChild; compound convenience renderers delegate child content to the supplied element. Each part exports its cva variant function.

- **Badge:** Badge, Count, StatusDot; DisplayTone type; badgeVariants/countVariants/statusDotVariants; formatCount. Badge supports five tones, subtle/solid/outline and icon. Count formats max overflow, retains full accessible number and tabular digits. StatusDot supports accessible label or decorative use and pulse.
- **Tag:** Tag, TagGroup, useTagGroup, tagVariants/tagGroupVariants. Removal callback/label, disabled; horizontal roving focus, arrows/Home/End, Delete/Backspace removal with neighbour focus. Consumers own the values.
- **Alert:** Alert, AlertTitle, AlertDescription, AlertActions, useAlert, corresponding variants, toneIcons. Title/description/icon/actions, inline/banner, dismissible, urgency. Routine messages use status; warning/danger use alert by default, with explicit urgency and role overrides. Never moves focus or auto-expires.
- **Card:** Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter, CardMedia and corresponding variants. Interactive hover border; asChild anchors retain native focus/navigation.
- **Avatar:** Avatar, AvatarImage, AvatarFallback, AvatarGroup, getAvatarInitials and corresponding variants. Radix image loading/fallback; name-derived Unicode initials, sm/md/lg, circle/square, status dot and max/+N group. Image clips to the shape while the status ring remains visible.
- **Skeleton:** Skeleton, skeletonVariants. Shape text/text-line/circle/rect, shimmer and reduced-motion fallback.
- **Meter:** Meter, useMeter, meterVariants. Label/valueText, finite normalized range, low/high/optimum classification, tone override; role=meter and complete aria values.
- **Progress:** existing API, class-name exports and getProgressPercent preserved; adds indeterminate/tone/asChild and progressVariants/progressIndicatorVariants. Indeterminate omits aria-valuenow.
- **Separator:** Separator, separatorVariants. Orientation, decorative/semantic and optional label.
- **Link:** Link, linkVariants. Native anchor/router composition, external icon, safe target/rel defaults and muted variant.
- **Breadcrumb:** Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbOverflow, useBreadcrumb and corresponding variants. nav/ol/li, aria-current page, maxItems collapse, W1 Menu overflow; onOverflowClick is an optional notification callback.
- **Layout:** Stack, Inline, Container, Grid, SpaceStep, spaceValue and corresponding variants. Token-step gaps/padding; alignment/justification/direction/wrapping; four container sizes; fixed columns or auto-fill/minChildWidth. CSS custom properties can override each layout decision.
- **Toast:** existing ToastViewport/Root/Content/Icon/Message/Source/Text/Close/Actions/Progress retained with their legacy classes and slots. Adds ToastProvider, ToastQueueViewport, useToast, useToastQueue, queue types and part variants. toast(options) returns id; update/dismiss; max visible, queued timers, stacked/expanded presentation, live countdown bar, hover/focus/window blur/hidden-document pause, swipe and Escape dismissal, polite atomic live region. Zero/Infinity duration persists. Background stacked cards are inert. Headless queue also exposes remaining/defaultDuration and pause/expansion setters.
- **EmptyState:** existing root/parts retained, asChild added, root tone/size added, all dimensions/type moved to semantic/component token CSS and variants exported.

## Validation

- `bun run typecheck`: **passed**, repository-wide.
- `bun test`: **111 pass, 0 fail**, 2,586 assertions across 20 files.
- W4 tests plus existing Progress tests: **17 pass, 0 fail**, 66 assertions.
- `bun run build:css`: **passed**.
- Owned tracked-file `git diff --check`: passed.
- Registry tests and token tests passed as part of the suite.
- Tested Count max formatting, initials, meter values/thresholds, tag keyboard navigation/removal/focus, breadcrumb current page/real overflow menu, layout variable mapping, indeterminate progress, external router composition, alert dismissal, toast add/update/dismiss/max/timer pause/queued activation/reset/Escape/hover/swipe.
- Earlier W2/W3 in-progress failures were not changed by W4. Their owners resolved them before the final successful checks.

## Visual checks and screenshots

Compared with the mockup through the T3 browser at 1280 and 390, dark/compact and light/comfortable. Also checked dark/comfortable and light/compact at 390: document width remained 390, inputs resolved to 36 and 28 respectively. Final captures contain live components, three queued toasts and no gallery runtime error.

Full-gallery shell captures use the requested Chromium headless shell with `--headless --hide-scrollbars --window-size=<width>,5000 --virtual-time-budget=1500`. Focused T3 captures supplement them because section 6 is below the first 5000 pixels on narrow screens.

- `gallery/screenshots/w4-full-1280-dark-compact.png`
- `gallery/screenshots/w4-full-1280-light-comfortable.png`
- `gallery/screenshots/w4-full-390-dark-compact.png`
- `gallery/screenshots/w4-full-390-light-comfortable.png`
- `gallery/screenshots/w4-sections-1280-dark-compact.png`
- `gallery/screenshots/w4-sections-1280-light-comfortable.png`
- `gallery/screenshots/w4-sections-390-dark-compact.png`
- `gallery/screenshots/w4-sections-390-light-comfortable.png`
- `gallery/screenshots/w4-link-1280-dark-compact.png`
- `gallery/screenshots/w4-link-1280-light-comfortable.png`
- `gallery/screenshots/w4-link-390-dark-compact.png`
- `gallery/screenshots/w4-link-390-light-comfortable.png`

### Visual deviations and reasons

- W0’s scaffold renders Display after Collections, so feedback remains section **6**, not mockup section 5. W4 keeps the established gallery ownership/order; Pagination/Carousel remain W3’s demo.
- The layout form uses only Container, Stack, Inline, Heading, CardDescription, Field/Label/Input/Textarea and Button. Design-only dashed outlines and positioned annotation labels are omitted to meet the explicit no-app-CSS success criterion. Form demo content/order matches the mockup.
- The toast demo adds an Add notification control and uses 60-second real timers; its bar measures actual remaining time rather than a fixed mockup 64%. Hover/focus reveals and pauses the full stack.
- Status pulse uses W0’s opacity keyframe rather than the mockup’s expanding shadow; reduced motion removes it. Spinner dimensions/keyframes remain W0’s implementation. Large avatar initials use the semantic large text size (15px rather than the mockup’s hard-coded 14px).
- Narrow alerts move actions below the message to avoid crowding. Avatar/tag dimensions use spacing-token calculations to preserve the mockup’s 28/20/40 and 22 geometry in both densities.
- The middle-truncation demo uses W1 Truncate with a positioned boundary to contain its measurement node, keeping document width at 390. No W1 files were modified.

## Shared-file requests

No new dependency, export, CSS import or animation is needed. Please correct the existing registry metadata; **Common** below means `class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-slot`.

| Registry item | dependencies                    | registryDependencies      |
| ------------- | ------------------------------- | ------------------------- |
| badge         | Common                          | theme                     |
| tag           | Common                          | theme, icon, hooks        |
| alert         | Common                          | theme, icon               |
| card          | Common                          | theme                     |
| avatar        | Common + @radix-ui/react-avatar | theme, badge              |
| skeleton      | Common                          | theme                     |
| meter         | Common                          | theme                     |
| separator     | Common                          | theme                     |
| link          | Common                          | theme, icon               |
| breadcrumb    | Common                          | theme, icon, menu         |
| layout        | Common                          | theme                     |
| toast         | Common                          | theme, icon, alert, hooks |
| progress      | Common                          | theme                     |
| empty-state   | Common                          | theme                     |

Only runtime imports need registry dependencies; type-only DisplayTone imports disappear during compilation. Toast reads toneIcons from Alert; Avatar uses StatusDot from Badge; Tag/Toast use the hooks module’s utility files. Component-token defaults live as semantic fallbacks in display.css and require no globals edit. The orchestrator can add the new docs to `docs/primitives/README.md` or consolidate them into `docs/primitives.md`.

## Open issues

No known W4 functional or typecheck failures. The registry corrections above remain orchestrator work. Toast dismissal removes immediately; entry/exit animation polish is not implemented. Screen-reader announcements and native swipe/focus behavior were structurally tested in happy-dom/browser, not manually verified with assistive technology. Timer behavior uses real elapsed time rather than a shared app clock.
