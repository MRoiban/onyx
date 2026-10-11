# SplitView

Two or more panes side by side (or stacked) with draggable handles between them. Sizes are percentages, panes can collapse, and the layout can be saved automatically. SplitViews can be nested for editor-style layouts.

**Use when:** adjacent panes share one area: editor plus preview, file list plus details, an editor area above a terminal.
**Not for:** a single resizable region (use [ResizeHandle](resize-handle.md)), the app's main sidebar (use [Sidebar](sidebar.md)), or floating windows.

## Import

```tsx
import { SplitView, SplitViewPane, SplitViewHandle, useSplitView, normalizeSplitSizes, resizeSplitSizes } from '@onyx/ui/split-view';
```

## Example

```tsx
<div style={{ height: '100%' }}>
  <SplitView orientation="vertical" autoSaveId="workbench-main" defaultSizes={[70, 30]}>
    <SplitViewPane minSize={30}>
      <SplitView orientation="horizontal" autoSaveId="editors">
        <SplitViewPane minPixels={240}><Editor /></SplitViewPane>
        <SplitViewPane collapsible collapsedSize={0} minSize={20}><Preview /></SplitViewPane>
      </SplitView>
    </SplitViewPane>
    <SplitViewPane minSize={10} collapsible snap={[30]}><Terminal /></SplitViewPane>
  </SplitView>
</div>
```

## API

**`SplitView`**

| Prop | Type | Default | Notes |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The **layout** direction: horizontal places panes side by side. |
| `sizes` / `defaultSizes` / `onSizesChange` | `number[]` (%) | equal shares | |
| `autoSaveId` | `string` | — | Saves sizes to `localStorage` under `onyx:split:<id>`. Read once on mount. Controlled `sizes` win. |
| `handleProps` | ResizeHandle options | — | Shared by every handle, for example `showSize` or `formatValue`. |
| `asChild` | `boolean` | `false` | Wrap the panes in a single custom root element. |

**`SplitViewPane`** (all sizes are **percentages** of the group)

| Prop | Type | Notes |
|---|---|---|
| `defaultSize` | `number` | |
| `minSize`, `maxSize` | `number` | |
| `minPixels`, `maxPixels` | `number` | Pixel limits, combined with the percentage limits. |
| `collapsible`, `collapsedSize` | `boolean`, `number` | Collapsed panes are inert and clip their content. |
| `snap` | `number[]` | |
| `asChild` | `boolean` | |

`SplitViewHandle` (with `index`) is for custom composition. The standard root inserts handles for you.

**`useSplitView({ sizes, defaultSizes, onSizesChange, autoSaveId, constraints, orientation })`** returns `ref`, the extent, normalized sizes and defaults, effective limits, setters, `resize(index, size)` and `reset()`. Pure math: `normalizeSplitSizes(sizes, constraints)` and `resizeSplitSizes(sizes, index, next, constraints, snapThreshold)`.

Also exported: `splitViewVariants`, `splitViewPaneVariants`.

## Behavior contract

**Onyx owns:**
- Inserting handles between panes.
- Resizing only the two panes next to a handle, keeping their total and both their limits; other panes don't move.
- Snapping, collapse, and resetting on double-click.
- Keyboard steps (10 and 50 CSS pixels, converted to percentages) and the separator ARIA (`aria-controls`, a percentage value text).
- Saving the layout, guarded against missing storage and server rendering.

**You supply:** a container with a definite size in the resize direction, pane content and its padding, and limits that can be satisfied together.

## Anatomy

`split-view` (`data-orientation`), `split-view-pane` (`data-orientation`, `data-state="collapsed|expanded"`), `split-view-handle` (as [ResizeHandle](resize-handle.md); its `data-orientation` is perpendicular to the layout).

## Tokens read

[ResizeHandle](resize-handle.md) tokens, plus `--onyx-surface-panel`, `--onyx-radius-md`, `--onyx-text-{description,sm}`.

## Gotchas

- **Limits must add up.** The pane minimums (counting collapsed panes at their reserved size) must total at most 100, and the maximums at least 100.
- **The container needs a size.** A SplitView inside an element with no height (vertical) or width (horizontal) can't resize.
- **Changing `autoSaveId` doesn't reload.** To load a different saved layout, remount with a new `key`.
- **Panes have no padding.** That suits edge-to-edge editors. Add padding inside the pane yourself.
