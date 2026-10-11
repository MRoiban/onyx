# Combobox

Use when: searchable choices, creation flows or multiple selections. Not for: command menus, inline autocomplete completion or virtualized huge result sets.

## Public API

`comboboxVariants`, `ComboboxOption`, `ComboboxValue`, `UseComboboxOptions`, `useCombobox`, `ComboboxHighlight`, `ComboboxProps`, `Combobox`.

## Anatomy

`combobox`, `combobox-chip`, `combobox-control`, `combobox-create-option`, `combobox-empty`, `combobox-indicator`, `combobox-input`, `combobox-label`, `combobox-listbox`, `combobox-match`, `combobox-option`, `combobox-option-description`, `combobox-option-label`, `combobox-separator`, `combobox-trigger`.

## Props and state

options: {value,label,disabled?,description?}[]; value/defaultValue/onValueChange (string or string[]); multiple; inputValue/defaultInputValue/onInputValueChange; open/defaultOpen/onOpenChange; filter=false for consumer filtering or a custom predicate; onCreate/createOption; emptyState; showTags; renderSelected/renderOption; activeIndex/defaultActiveIndex/onActiveIndexChange; label/inputProps. Ref points to the input.

All DOM parts forward refs, merge className and expose data-slot. Single-element Radix parts and structural parts support asChild. Roots/providers/portals are context-only and have no DOM slot. Floating parts expose data-state and data-side from Radix; menu items expose data-highlighted/data-disabled and check/radio data-state. All floating placement uses 8px collision padding; body portals inherit the document theme and density. CSS lives in onyx.components and uses motion tokens with reduced-motion support.

## Tokens read

`--onyx-space-*`, `--onyx-text-*`, `--onyx-weight-*`, `--onyx-radius-*`, `--onyx-border-*`, `--onyx-duration-*`, `--onyx-ease-*`, `--onyx-focus-ring-*`, `--onyx-control-focus-ring`, `--onyx-menu-item-height`, `--onyx-menu-radius`, `--onyx-surface-menu`, `--onyx-shadow-md`, `--onyx-z-popover`, `--onyx-state-selected{,-fg}`, `--onyx-input-height`, `--onyx-input-radius`, `--onyx-control-input-bg`, `Tag/Input/Button/Calendar tokens for composed primitives`.

## Headless behavior

useCombobox(options) exposes value/selected/query/setQuery/open/setOpen/activeIndex/setActiveIndex/filteredOptions/canCreate/inputRef/inputProps/listboxProps/getOptionProps/select/remove. Wire these into custom markup; keep DOM focus in the input. ArrowUp/Down skip disabled choices; Enter selects or creates, Escape closes without selection, Tab dismisses. Native editing keys are preserved. Use unique option values.

## References

[WAI-ARIA APG combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), [Radix Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip), [Floating UI autoUpdate](https://floating-ui.com/docs/autoupdate).

## Example

```tsx
<Combobox
  label="Language"
  options={[{ value: 'fr', label: 'French' }, { value: 'en', label: 'English' }]}
  onValueChange={setLanguage}
  onCreate={createLocale}
  createOption={query => `Add “${query}” as custom locale`}
/>
```

For consumer filtering, set `filter={false}` and supply the filtered `options` yourself. `onCreate` notifies the consumer, which owns creating and selecting the new value. Default multiple-selection chips use Tag; `renderSelected` can replace their markup. The input's `aria-activedescendant` always references a rendered enabled option, and committed selection remains separate from keyboard exploration.

## Nested floating content

DialogContent, SheetContent and AlertDialogContent provide their content element as the default portal container. Combobox, Popover, Menu (including submenus), Menubar, Tooltip, HoverCard, NavigationMenu and DatePicker floating content inherit it, keeping pointer interaction, focus and stacking within the modal. Explicit `container` props override the default; `null` requests the Radix/body fallback.

For a consumer modal, capture its element with a callback ref and wrap floating controls in `PortalContainerProvider` (exported from `@onyx/ui/popover`), or pass that element to each floating content's `container` prop. DatePicker accepts it through `contentProps.container`. Keep the container inside the modal's focus scope.

## Root and input customization

`className`, `style`, `rootProps` (div attributes/events) and `rootRef` target the composite root. Root classes/styles merge with `rootProps`; direct `className`/`style` take precedence. `inputProps` styles and attributes target the text input. The existing forwarded `ref` still points to that input for compatibility.

Selected labels refresh when options load or change, for controlled and uncontrolled selections. An active typed query is preserved until blur or selection. Internally, active options follow their unique value through reordering; removed or disabled active options clear exploration rather than selecting the item at their old index. The optional controlled `activeIndex` API remains consumer-owned.
