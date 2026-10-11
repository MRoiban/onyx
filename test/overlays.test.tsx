import { describe, it, expect } from "bun:test";
import * as React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
} from "../src/components/menu";
import { Combobox } from "../src/components/combobox";
import { Tooltip, TooltipProvider } from "../src/components/tooltip";
import { Truncate } from "../src/components/truncate";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../src/components/alert-dialog";

const options = [
  { value: "fr", label: "French" },
  { value: "fr-CA", label: "French (Canada)" },
  { value: "fy", label: "Frisian" },
  { value: "en", label: "English" },
  { value: "xx", label: "Unavailable", disabled: true },
];
describe("W1 overlays keyboard and ARIA", () => {
  it("menu arrows, typeahead, submenu and Escape are handled by Radix", async () => {
    render(
      <Menu modal={false}>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem>Alpha</MenuItem>
          <MenuItem>Beta</MenuItem>
          <MenuSub>
            <MenuSubTrigger>Recent</MenuSubTrigger>
            <MenuSubContent>
              <MenuItem>fr.json</MenuItem>
              <MenuItem>content.json</MenuItem>
            </MenuSubContent>
          </MenuSub>
          <MenuItem disabled>Unavailable</MenuItem>
        </MenuContent>
      </Menu>,
    );
    fireEvent.keyDown(screen.getByText("Actions"), { key: "ArrowDown" });
    await waitFor(() =>
      expect(document.activeElement?.textContent).toBe("Alpha"),
    );
    fireEvent.keyDown(screen.getByText("Alpha"), { key: "ArrowDown" });
    await waitFor(() =>
      expect(document.activeElement?.textContent).toBe("Beta"),
    );
    fireEvent.keyDown(screen.getByText("Beta"), { key: "r" });
    await waitFor(() =>
      expect(document.activeElement?.textContent?.trim()).toBe("Recent"),
    );
    fireEvent.keyDown(screen.getByText("Recent"), { key: "ArrowRight" });
    await waitFor(() =>
      expect(document.activeElement?.textContent).toBe("fr.json"),
    );
    expect(screen.getByText("Recent").getAttribute("aria-expanded")).toBe(
      "true",
    );
    fireEvent.keyDown(screen.getByText("fr.json"), { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(screen.getByText("Actions").getAttribute("aria-haspopup")).toBe(
      "menu",
    );
  });
  it("combobox filters, keeps focus in input, selects by Enter and dismisses by Escape", async () => {
    let value: unknown;
    render(
      <Combobox
        label="Language"
        options={options}
        onValueChange={(v) => (value = v)}
      />,
    );
    const input = screen.getByRole("combobox") as HTMLInputElement;
    act(() => input.focus());
    fireEvent.change(input, { target: { value: "fr" } });
    expect(screen.getAllByRole("option")).toHaveLength(3);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    const id = input.getAttribute("aria-activedescendant");
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)?.textContent).toBe("French");
    expect(document.activeElement).toBe(input);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(value).toBe("fr");
    expect(input.value).toBe("French");
    expect(input.getAttribute("aria-expanded")).toBe("false");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(input.hasAttribute("aria-activedescendant")).toBe(false);
    expect(screen.queryByRole("listbox")).toBeNull();
    await act(async () => {});
  });
  it("combobox supports create options, consumer filtering, empty state and multi selection", async () => {
    let created = "";
    const { rerender } = render(
      <Combobox
        label="Locale"
        options={options}
        onCreate={(q) => (created = q)}
        createOption={(q) => `Create ${q}`}
      />,
    );
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "zz" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(created).toBe("zz");
    rerender(
      <Combobox label="Locale" options={[]} emptyState="Nothing found" />,
    );
    fireEvent.change(input, { target: { value: "other" } });
    expect(screen.getByRole("status").textContent).toBe("Nothing found");
    rerender(
      <Combobox
        label="Locale"
        options={options}
        filter={false}
        multiple
        showTags
      />,
    );
    fireEvent.change(input, { target: { value: "whatever" } });
    expect(screen.getAllByRole("option")).toHaveLength(5);
    fireEvent.click(screen.getByRole("option", { name: "English" }));
    expect(screen.getByRole("button", { name: "Remove English" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Remove English" }));
    expect(screen.queryByRole("button", { name: "Remove English" })).toBeNull();
    await act(async () => {});
  });
  it("alert dialog focuses cancel and ignores outside pointer interaction", async () => {
    render(
      <>
        <button>Outside</button>
        <AlertDialog>
          <AlertDialogTrigger>Discard changes</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Discard?</AlertDialogTitle>
            <AlertDialogDescription>
              Unsaved work will be lost.
            </AlertDialogDescription>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction>Discard</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      </>,
    );
    fireEvent.click(screen.getByText("Discard changes"));
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByText("Keep editing")),
    );
    fireEvent.pointerDown(screen.getByText("Outside"), { button: 0 });
    expect(screen.getByRole("alertdialog")).toBeTruthy();
    fireEvent.keyDown(screen.getByText("Keep editing"), { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
  });
  it("tooltip appears on focus and includes a Kbd shortcut", async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip content="Refresh explorer" shortcut="⌘R">
          <button>Refresh</button>
        </Tooltip>
      </TooltipProvider>,
    );
    act(() => screen.getByText("Refresh").focus());
    await waitFor(() =>
      expect(screen.getByRole("tooltip").textContent).toContain(
        "Refresh explorer",
      ),
    );
    expect(
      document.querySelector('[data-slot="tooltip-shortcut"]')?.tagName,
    ).toBe("KBD");
    expect(
      screen.getByText("Refresh").getAttribute("aria-describedby"),
    ).toBeTruthy();
  });
  it("truncate enables tooltip only for overflow and responds to ResizeObserver", async () => {
    let resize: ResizeObserverCallback | undefined;
    const Original = globalThis.ResizeObserver;
    class Observer {
      callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }
      observe(element: Element) {
        if (element.getAttribute("data-slot") === "truncate-measure")
          resize = this.callback;
      }
      unobserve() {}
      disconnect() {}
    }
    globalThis.ResizeObserver = Observer as unknown as typeof ResizeObserver;
    const width = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "clientWidth",
    );
    const scroll = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollWidth",
    );
    let measured = 100;
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get: () => 200,
    });
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get: () => measured,
    });
    try {
      const { container } = render(
        <Truncate tooltipProps={{ open: true }}>
          mods/[CP] Sunberry Village/i18n/fr.json
        </Truncate>,
      );
      expect(screen.queryByRole("tooltip")).toBeNull();
      expect(
        container
          .querySelector('[data-slot="truncate"]')
          ?.getAttribute("data-state"),
      ).toBe("idle");
      measured = 400;
      act(() => resize?.([], {} as ResizeObserver));
      await waitFor(() => expect(screen.getByRole("tooltip")).toBeTruthy());
      expect(
        container
          .querySelector('[data-slot="truncate"]')
          ?.getAttribute("tabindex"),
      ).toBe("0");
      measured = 100;
      await act(async () => resize?.([], {} as ResizeObserver));
      await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
    } finally {
      if (width)
        Object.defineProperty(HTMLElement.prototype, "clientWidth", width);
      else Reflect.deleteProperty(HTMLElement.prototype, "clientWidth");
      if (scroll)
        Object.defineProperty(HTMLElement.prototype, "scrollWidth", scroll);
      else Reflect.deleteProperty(HTMLElement.prototype, "scrollWidth");
      globalThis.ResizeObserver = Original;
    }
  });
});

describe("W1 DatePicker and controlled choices", () => {
  it("updates the combobox display from controlled selections and skips disabled options", async () => {
    const { rerender } = render(
      <Combobox label="Choice" options={options} value="en" filter={false} />,
    );
    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe("English");
    rerender(
      <Combobox label="Choice" options={options} value="fr" filter={false} />,
    );
    expect(input.value).toBe("French");
    act(() => input.focus());
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(
      document.getElementById(input.getAttribute("aria-activedescendant")!)
        ?.textContent,
    ).toBe("English");
    await act(async () => {});
  });
  it("DatePicker validates ISO edits and focuses the calendar grid", async () => {
    const { DatePicker } = await import("../src/components/date-picker");
    let value: unknown;
    render(
      <DatePicker
        label="Due date"
        defaultMonth={new Date(2026, 9, 1)}
        onValueChange={(next) => (value = next)}
      />,
    );
    const input = screen.getByLabelText("Due date") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "2026-02-31" } });
    fireEvent.blur(input);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(value).toBeUndefined();
    fireEvent.change(input, { target: { value: "2026-10-05" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect((value as Date).getDate()).toBe(5);
    fireEvent.click(
      screen.getByRole("button", { name: "Open calendar: Due date" }),
    );
    await waitFor(() =>
      expect(document.activeElement?.getAttribute("data-slot")).toBe(
        "calendar-day",
      ),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Saturday, October 10, 2026" }),
    );
    expect((value as Date).getDate()).toBe(10);
    expect(input.value).toBe("2026-10-10");
    await waitFor(() => expect(screen.queryByRole("grid")).toBeNull());
  });
  it("DatePicker range stays open after the start and closes after the end", async () => {
    const { DatePicker } = await import("../src/components/date-picker");
    let value: unknown;
    render(
      <DatePicker
        mode="range"
        label="Dates"
        name="dates"
        defaultMonth={new Date(2026, 9, 1)}
        onValueChange={(next) => (value = next)}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Open calendar: Dates" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Monday, October 5, 2026" }),
    );
    expect(screen.getByRole("grid")).toBeTruthy();
    fireEvent.click(
      screen.getByRole("button", { name: "Saturday, October 10, 2026" }),
    );
    expect((value as { from: Date; to: Date }).from.getDate()).toBe(5);
    expect((value as { from: Date; to: Date }).to.getDate()).toBe(10);
    expect(
      (document.querySelector('[name="dates"]') as HTMLInputElement).value,
    ).toBe("2026-10-05");
    expect(
      (document.querySelector('[name="dates.to"]') as HTMLInputElement).value,
    ).toBe("2026-10-10");
    await waitFor(() => expect(screen.queryByRole("grid")).toBeNull());
  });
});

it("Menu asChild retains the child element, indicator and submenu adornment", async () => {
  const { MenuCheckboxItem } = await import("../src/components/menu");
  render(
    <Menu modal={false} defaultOpen>
      <MenuTrigger>More</MenuTrigger>
      <MenuContent>
        <MenuCheckboxItem asChild checked>
          <button>Hidden files</button>
        </MenuCheckboxItem>
        <MenuSub>
          <MenuSubTrigger asChild>
            <button>Recent files</button>
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuItem>fr.json</MenuItem>
          </MenuSubContent>
        </MenuSub>
      </MenuContent>
    </Menu>,
  );
  expect(screen.getByRole("menuitemcheckbox").tagName).toBe("BUTTON");
  expect(
    screen.getByRole("menuitemcheckbox").getAttribute("aria-checked"),
  ).toBe("true");
  expect(
    screen
      .getByRole("menuitemcheckbox")
      .querySelector('[data-slot="menu-indicator"]'),
  ).toBeTruthy();
  expect(
    screen
      .getByText("Recent files")
      .querySelector('[data-slot="menu-submenu-icon"]'),
  ).toBeTruthy();
  await act(async () => {});
});

it("NavigationMenu keeps keyboard access to portalled link cards", async () => {
  const {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
  } = await import("../src/components/navigation-menu");
  render(
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#bedrock">Bedrock</NavigationMenuLink>
            <NavigationMenuLink href="#babel">Babel</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>,
  );
  const trigger = screen.getByText("Products");
  fireEvent.click(trigger);
  fireEvent.keyDown(trigger, { key: "ArrowDown" });
  await waitFor(() =>
    expect(document.activeElement?.textContent).toBe("Bedrock"),
  );
  fireEvent.keyDown(screen.getByText("Bedrock"), { key: "Escape" });
  await waitFor(() =>
    expect(trigger.getAttribute("aria-expanded")).toBe("false"),
  );
});
