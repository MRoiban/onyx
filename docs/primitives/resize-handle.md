# ResizeHandle

A draggable, keyboard-accessible divider that changes the size of the region next to it, with optional collapse, snap points and a size tooltip.

**Use when:** a single region (a sidebar, a bottom panel, an inspector) has a user-adjustable width or height that you store.
**Not for:** several panes sharing a space (use [SplitView](split-view.md), which inserts handles for you), a sidebar rail (use [Sidebar](sidebar.md)'s resize support), or general drag-and-drop.

## Import

```tsx
import { ResizeHandle, useResizable } from '@onyx/ui/resize-handle';
```

## Example

```tsx
<div style={{ display: 'flex', height: '100%' }}>
  <aside id="inspector" style={{ width }}>…</aside>
  <ResizeHandle
    aria-label="Resize inspector"
    aria-controls="inspector"
    orientation="vertical"
    value={width}
    onValueChange={setWidth}
    min={200}
    max={600}
    defaultValue={280}
    collapsible
    snap={[280, 400]}
    onResizeEnd={() => save('inspectorWidth', width)}
    showSize
  />
  <main style={{ flex: 1 }}>…</main>
</div>

{/* a handle on the right edge of a region on the right: invert the direction */}
<ResizeHandle direction={-1} … />
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` / `defaultValue` / `onValueChange` | `number` | `240` | In your units (pixels by default). `defaultValue` is also the double-click reset value. |
| `min`, `max` | `number` | `0`, `1000` | |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | The **separator's** orientation: `vertical` resizes widths. |
| `collapsible` | `boolean` | `false` | Dragging below halfway between `collapsedSize` and `min` collapses the region. |
| `collapsedSize` | `number` | `0` | |
| `unitsPerPixel` | `number` | `1` | Converts pointer pixels to your units, for example percentages. |
| `direction` | `1 \| -1` | `1` | Use `-1` when dragging toward the region makes it larger (handles on right or bottom edges). |
| `snap`, `snapThreshold` | `number[]`, `number` | —, `4` | |
| `onResizeStart`, `onResizeEnd` | `() => void` | — | Also fire around keyboard and double-click changes, so persist in `onResizeEnd`. |
| `showSize`, `formatValue` | `boolean`, `(v) => ReactNode` | | A tooltip showing the size while hovering or dragging. |
| `grip` | `boolean` | — | Shows a visible grip. |
| `disabled`, `asChild` | | | |
| `aria-label` | `string` | — | **Required.** |
| `aria-controls` | `string` | — | The id of the region being resized. |

**`useResizable(options)`** returns `{ value, setValue, dragging, hovered, collapsed, handleProps }`. Spread `handleProps` onto your own focusable separator.

Also exported: `resizeHandleVariants`.

## Behavior contract

**Onyx owns:** dragging with pointer capture, the keyboard behavior, clamping, snapping, collapse and restore, the `role="separator"` ARIA values, and the tooltip.

**You supply:** applying the value to the region's size, and storing it.

## Keyboard

| Key | Result |
|---|---|
| ← / → (vertical) or ↑ / ↓ (horizontal) | 10px; with Shift, 50px |
| Home / End | `min` (or collapsed) / `max` |
| Enter | Collapse, or restore the last size |
| Double-click | Reset to `defaultValue` |

## Anatomy

`resize-handle` (`data-state="idle|hover|dragging"`, `data-orientation`, `data-disabled`), `resize-handle-grip`, `resize-handle-tooltip` (not portalled).

## Tokens read

`--onyx-resize-handle-size` (the hit area), `--onyx-border-{default,strong}`, `--onyx-control-focus-ring`, `--onyx-space-{0-5,1,2,6}`, `--onyx-radius-{xs,sm}`, `--onyx-text-xs`, `--onyx-text-foreground`, `--onyx-surface-tooltip`, `--onyx-shadow-md`, `--onyx-z-tooltip`.

## Gotchas

- **`orientation` describes the line, not the layout.** A vertical line between side-by-side regions resizes widths.
- **`onValueChange` fires before `onResizeEnd`,** so `onResizeEnd` always sees the latest value.
