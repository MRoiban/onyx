import * as React from "react";
import { afterEach, beforeEach, describe, it, expect, jest } from "bun:test";
import { cleanup, render, renderHook, fireEvent, act } from "@testing-library/react";
import { Count, formatCount } from "./badge";
import { Avatar, getAvatarInitials } from "./avatar";
import { Meter, useMeter } from "./meter";
import { Tag, TagGroup } from "./tag";
import { Breadcrumb } from "./breadcrumb";
import { Stack, Inline, Grid, Container } from "./layout";
import { Progress } from "./progress";
import { Link } from "./link";
import { Alert } from "./alert";
import { ToastProvider, ToastQueueViewport, useToastQueue } from "./toast";
const tick = (ms: number) => act(() => jest.advanceTimersByTime(ms));
afterEach(() => { cleanup(); jest.useRealTimers(); });
describe("W4 display", () => {
  beforeEach(() => jest.useFakeTimers());
  it("formats counts and keeps the full numeric accessible label", () => {
    expect(formatCount(100)).toBe("99+");
    expect(formatCount(9, 9)).toBe("9");
    expect(formatCount(-1)).toBe("0");
    const v = render(<Count value={140} />);
    expect(v.getByText("99+").getAttribute("aria-label")).toBe("140");
  });
  it("derives unicode initials from the first and last name with empty fallback", () => {
    expect(getAvatarInitials(" Marius  Roiban ")).toBe("MR");
    expect(getAvatarInitials("Élodie")).toBe("É");
    expect(getAvatarInitials("")).toBe("?");
    const v = render(<Avatar name="Ada Lovelace" />);
    expect(v.getByLabelText("Ada Lovelace").textContent).toBe("AL");
  });
  it("labels and clamps meters and provides understandable value text", () => {
    const v = render(
      <Meter label="Storage" value={7} max={5} valueText="5 / 5 GB" />,
    );
    const meter = v.getByRole("meter", { name: "Storage" });
    expect(meter.getAttribute("aria-valuemin")).toBe("0");
    expect(meter.getAttribute("aria-valuemax")).toBe("5");
    expect(meter.getAttribute("aria-valuenow")).toBe("5");
    expect(meter.getAttribute("aria-valuetext")).toBe("5 / 5 GB");
  });
  it("classifies meter thresholds according to the optimum region", () => {
    const { result } = renderHook(() =>
      useMeter({ value: 94, low: 50, high: 80, optimum: 20 }),
    );
    expect(result.current.tone).toBe("danger");
  });
  it("removes tags with Delete/Backspace and moves focus using arrows", () => {
    function Demo() {
      const [values, setValues] = React.useState(["fr", "de", "pt"]);
      return (
        <TagGroup aria-label="Tags">
          {values.map((v) => (
            <Tag
              key={v}
              onRemove={() => setValues((all) => all.filter((x) => x !== v))}
            >
              {v}
            </Tag>
          ))}
        </TagGroup>
      );
    }
    const v = render(<Demo />);
    const fr = v.getByRole("button", { name: "Remove fr" });
    const de = v.getByRole("button", { name: "Remove de" });
    act(() => fr.focus());
    expect(fr.tabIndex).toBe(0);
    expect(de.tabIndex).toBe(-1);
    fireEvent.keyDown(fr, { key: "ArrowRight" });
    expect(document.activeElement).toBe(de);
    fireEvent.keyDown(de, { key: "Delete" });
    expect(v.queryByRole("button", { name: "Remove de" })).toBeNull();
    const pt = v.getByRole("button", { name: "Remove pt" });
    expect(document.activeElement).toBe(pt);
    fireEvent.keyDown(pt, { key: "Backspace" });
    expect(v.queryByRole("button", { name: "Remove pt" })).toBeNull();
    expect(document.activeElement).toBe(fr);
  });
  it("provides breadcrumb navigation, current page, and real overflow menu", () => {
    const v = render(
      <Breadcrumb
        maxItems={3}
        items={[
          { label: "mods", href: "#mods" },
          { label: "Babel", href: "#babel" },
          { label: "i18n", href: "#i18n" },
          { label: "fr.json" },
        ]}
      />,
    );
    expect(v.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
    expect(v.getByText("fr.json").getAttribute("aria-current")).toBe("page");
    const trigger = v.getByRole("button", { name: "Show hidden breadcrumbs" });
    fireEvent.pointerDown(trigger, {
      button: 0,
      ctrlKey: false,
      pointerType: "mouse",
    });
    tick(10);
    expect(v.getByRole("menuitem", { name: "Babel" })).toBeTruthy();
  });
  it("maps all layout gaps to public spacing variables and allows overrides", () => {
    const v = render(
      <>
        <Stack gap="4" data-testid="stack" />
        <Inline gap="1-5" data-testid="inline" />
        <Grid gap="6" minChildWidth="var(--onyx-space-10)" data-testid="grid" />
        <Container size="sm" padding="3" data-testid="container" />
      </>,
    );
    expect(
      v.getByTestId("stack").style.getPropertyValue("--onyx-stack-gap"),
    ).toBe("var(--onyx-space-4)");
    expect(
      v.getByTestId("inline").style.getPropertyValue("--onyx-inline-gap"),
    ).toBe("var(--onyx-space-1-5)");
    expect(
      v.getByTestId("grid").style.getPropertyValue("--onyx-grid-gap"),
    ).toBe("var(--onyx-space-6)");
    expect(
      v
        .getByTestId("container")
        .style.getPropertyValue("--onyx-container-padding"),
    ).toBe("var(--onyx-space-3)");
  });
  it("keeps progress API and omits value now when indeterminate", () => {
    const v = render(<Progress value={25} aria-label="Task" />);
    expect(v.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("25");
    v.rerender(<Progress indeterminate aria-label="Task" />);
    expect(v.getByRole("progressbar").hasAttribute("aria-valuenow")).toBe(
      false,
    );
  });
  it("composes external router links and adds safe defaults", () => {
    const v = render(
      <Link asChild external>
        <a href="https://example.com">Docs</a>
      </Link>,
    );
    const link = v.getByRole("link", { name: "Docs" });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link.querySelector('[data-slot="link-external-icon"]')).toBeTruthy();
  });
  it("uses appropriate alert urgency and dismisses without moving focus", () => {
    const v = render(
      <Alert tone="danger" title="Lost connection" dismissible />,
    );
    expect(v.getByRole("alert")).toBeTruthy();
    fireEvent.click(v.getByRole("button", { name: "Dismiss alert" }));
    expect(v.queryByRole("alert")).toBeNull();
  });
});
describe("W4 toast queue", () => {
  beforeEach(() => jest.useFakeTimers());
  it("adds, updates, dismisses and limits visible notifications while retaining the queue", () => {
    const { result } = renderHook(() =>
      useToastQueue({ maxVisible: 2, duration: 0 }),
    );
    let first = "";
    act(() => {
      first = result.current.toast({ title: "First" });
      result.current.toast({ title: "Second" });
      result.current.toast({ title: "Third" });
    });
    expect(result.current.toasts.length).toBe(3);
    expect(result.current.visible.map((t) => t.title)).toEqual([
      "Second",
      "Third",
    ]);
    act(() =>
      result.current.update(first, { title: "Changed", tone: "success" }),
    );
    expect(result.current.toasts[0].title).toBe("Changed");
    act(() => result.current.dismiss(result.current.visible[1].id));
    expect(result.current.visible.map((t) => t.title)).toEqual([
      "Changed",
      "Second",
    ]);
    act(() => result.current.dismiss());
    expect(result.current.toasts.length).toBe(0);
  });
  it("pauses timers for hover, focus and window blur, resuming the remaining duration", () => {
    const { result } = renderHook(() => useToastQueue({ duration: 100 }));
    act(() => {
      result.current.toast({ title: "Timed" });
      result.current.setHovered(true);
    });
    tick(125);
    expect(result.current.toasts.length).toBe(1);
    act(() => {
      result.current.setFocused(true);
      result.current.setHovered(false);
    });
    tick(125);
    expect(result.current.toasts.length).toBe(1);
    act(() => {
      window.dispatchEvent(new Event("blur"));
      result.current.setFocused(false);
    });
    tick(125);
    expect(result.current.toasts.length).toBe(1);
    act(() => window.dispatchEvent(new Event("focus")));
    tick(125);
    expect(result.current.toasts.length).toBe(0);
  });
  it("starts queued item timers only after they become visible and can reset duration", () => {
    const { result } = renderHook(() =>
      useToastQueue({ maxVisible: 1, duration: 60 }),
    );
    let first = "";
    act(() => {
      first = result.current.toast({ title: "Queued" });
      result.current.toast({ title: "Persistent", duration: 0 });
    });
    tick(85);
    expect(result.current.toasts.length).toBe(2);
    act(() => result.current.dismiss(result.current.visible[0].id));
    act(() => result.current.update(first, { duration: 120 }));
    tick(65);
    expect(result.current.toasts.length).toBe(1);
    tick(85);
    expect(result.current.toasts.length).toBe(0);
  });
  it("dismisses the latest toast on Escape and exposes a polite live region", () => {
    const v = render(
      <ToastProvider
        viewport={false}
        initialToasts={[
          { title: "First", duration: 0 },
          { title: "Second", duration: 0 },
        ]}
      >
        <ToastQueueViewport />
      </ToastProvider>,
    );
    expect(v.getByRole("status").getAttribute("aria-live")).toBe("polite");
    fireEvent.keyDown(v.getByRole("region"), { key: "Escape" });
    expect(v.container.querySelectorAll('[data-slot="toast"]').length).toBe(1);
    tick(60);
    expect(v.getByRole("status").textContent).toBe("First");
  });
  it("pauses from viewport hover and dismisses swiped notifications", () => {
    const v = render(
      <ToastProvider duration={90} initialToasts={[{ title: "Hover pause" }]}>
        <span />
      </ToastProvider>,
    );
    const region = v.getByRole("region");
    fireEvent.mouseEnter(region);
    tick(120);
    expect(v.container.querySelectorAll('[data-slot="toast"]').length).toBe(1);
    fireEvent.mouseLeave(region);
    tick(120);
    expect(v.container.querySelectorAll('[data-slot="toast"]').length).toBe(0);
    v.unmount();
    const swipe = render(
      <ToastProvider duration={0} initialToasts={[{ title: "Swipe" }]}>
        <span />
      </ToastProvider>,
    );
    const card = swipe.container.querySelector('[data-slot="toast"]')!;
    fireEvent.pointerDown(card, { clientX: 0, clientY: 0, pointerId: 1 });
    fireEvent.pointerUp(card, { clientX: 100, clientY: 0, pointerId: 1 });
    expect(swipe.container.querySelector('[data-slot="toast"]')).toBeNull();
  });
});
