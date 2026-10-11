import * as React from "react";
import { afterEach, describe, expect, it, jest } from "bun:test";
import { act, cleanup, fireEvent, render, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Stack, Inline, Grid, Container } from "../src/components/layout";
import { Count, formatCount, badgeVariants, badgeAttributes, displayAttributes } from "../src/components/badge";
import { getAvatarInitials, avatarVariants, avatarAttributes } from "../src/components/avatar";
import { Tag, TagGroup } from "../src/components/tag";
import { ToastProvider, ToastQueueViewport, useToast, useToastQueue, type ToastQueue } from "../src/components/toast";
import { readFileSync } from "node:fs";
afterEach(() => { cleanup(); jest.useRealTimers(); });
const tick = (ms: number) => act(() => jest.advanceTimersByTime(ms));

describe("F display regressions", () => {
  it("#11 leaves layout default style attributes absent and writes only supplied decisions", () => {
    const v = render(<><Stack data-testid="s"/><Inline data-testid="i"/><Container data-testid="c"/><Grid data-testid="g"/></>);
    for (const id of ["s", "i", "c", "g"]) expect(v.getByTestId(id).hasAttribute("style")).toBe(false);
    v.rerender(<Stack gap="4" data-testid="s"/>);
    expect(v.getByTestId("s").getAttribute("style")).toBe("--onyx-stack-gap: var(--onyx-space-4);");
  });
  it("#51 normalizes Count value and max for text and accessible label", () => {
    for (const max of [-1, 0, NaN, Infinity, .9]) expect(formatCount(10.9, max)).toBe("10");
    expect(formatCount(10.9, 3.8)).toBe("3+");
    const v = render(<Count value={-1.4}/>);
    expect(v.getByLabelText("0").textContent).toBe("0");
    v.rerender(<Count value={NaN}/>);
    expect(v.getByLabelText("0").textContent).toBe("0");
    v.rerender(<Count value={7.9} max={3.9}/>);
    expect(v.getByLabelText("7").textContent).toBe("3+");
  });
  it("#52 initials preserve NFC and emoji graphemes with and without Segmenter", () => {
    const check = () => {
      expect(getAvatarInitials("🇧🇪 User")).toBe("🇧🇪U");
      expect(getAvatarInitials("E\u0301lodie")).toBe("É");
      expect(getAvatarInitials("👩🏽‍💻 Developer")).toBe("👩🏽‍💻D");
      expect(getAvatarInitials("Ada")).toBe("A");
      expect(getAvatarInitials("   ")).toBe("?");
    };
    check();
    const segmenter = Intl.Segmenter;
    try { Object.defineProperty(Intl, "Segmenter", { value: undefined, configurable: true }); check(); }
    finally { Object.defineProperty(Intl, "Segmenter", { value: segmenter, configurable: true }); }
  });
  it("#58 companion attributes render custom Badge and Avatar variants", () => {
    const v = render(<><span className={badgeVariants({ tone: "danger", variant: "outline" })} {...badgeAttributes({ tone: "danger", variant: "outline" })} data-testid="badge"/><span className={avatarVariants({ size: "lg", variant: "square" })} {...avatarAttributes({ size: "lg", variant: "square" })} data-testid="avatar"/></>);
    expect(v.getByTestId("badge").dataset.tone).toBe("danger");
    expect(v.getByTestId("badge").dataset.variant).toBe("outline");
    expect(v.getByTestId("avatar").dataset.size).toBe("lg");
    expect(v.getByTestId("avatar").dataset.variant).toBe("square");
    expect(displayAttributes({ orientation: "vertical", pulse: true })["data-pulse"]).toBe(true);
  });
  it("#59 Count CSS honors subtle and outline variants", () => {
    const css = readFileSync("src/styles/display.css", "utf8");
    expect(css).toContain('.onyx-count[data-variant="subtle"]');
    expect(css).toContain('.onyx-count[data-variant="outline"]');
    const v = render(<Count variant="outline" value={4}/>);
    expect(v.getByLabelText("4").dataset.variant).toBe("outline");
  });
});

function Tags({ fallback = false, onEmpty }: { fallback?: boolean; onEmpty?: () => void }) {
  const [values, setValues] = React.useState(["a", "b", "c"]);
  const ref = React.useRef<HTMLButtonElement>(null);
  return <><button ref={ref}>Fallback</button><TagGroup aria-label="Tags" fallbackRef={fallback ? ref : undefined} onEmpty={onEmpty}>{values.map(value => <Tag key={value} onRemove={() => setValues(all => all.filter(x => x !== value))}>{value}</Tag>)}</TagGroup></>;
}
describe("F tag removal focus", () => {
  for (const key of ["click", "Enter", " ", "Delete", "Backspace"]) it(`#23 ${key} restores next, previous, then empty group focus`, async () => {
    const user = userEvent.setup();
    const v = render(<Tags/>);
    const remove = async (name: string) => {
      const button = v.getByRole("button", { name: `Remove ${name}` });
      act(() => button.focus());
      if (key === "click") fireEvent.click(button);
      else if (key === "Delete" || key === "Backspace") fireEvent.keyDown(button, { key });
      else await user.keyboard(key === " " ? " " : "{Enter}");
    };
    await remove("b"); expect(document.activeElement).toBe(v.getByRole("button", { name: "Remove c" }));
    await remove("c"); expect(document.activeElement).toBe(v.getByRole("button", { name: "Remove a" }));
    await remove("a"); expect(document.activeElement).toBe(v.getByRole("group"));
  });
  it("#23 controlled asynchronous removal restores focus after DOM commit", async () => {
    let remove: (() => void) | undefined;
    function AsyncTags() {
      const [visible, setVisible] = React.useState(true);
      return <TagGroup aria-label="Async tags">{visible && <Tag onRemove={() => { remove = () => setVisible(false); }}>a</Tag>}<Tag onRemove={() => {}}>b</Tag></TagGroup>;
    }
    const v = render(<AsyncTags/>);
    const a = v.getByRole("button", { name: "Remove a" });
    act(() => a.focus()); fireEvent.click(a);
    expect(document.activeElement).toBe(a);
    await act(async () => { remove?.(); await Promise.resolve(); });
    expect(document.activeElement).toBe(v.getByRole("button", { name: "Remove b" }));
  });
  it("#23 last removal honors fallback ref and consumer onEmpty", () => {
    let empty = 0;
    const v = render(<Tags fallback onEmpty={() => empty++}/>);
    for (const name of ["a", "b", "c"]) { const b = v.getByRole("button", { name: `Remove ${name}` }); act(() => b.focus()); fireEvent.click(b); }
    expect(empty).toBe(1);
    expect(document.activeElement).toBe(v.getByRole("button", { name: "Fallback" }));
  });
});

let queue: ToastQueue;
function QueueAccess() { queue = useToast(); return null; }
function ToastDemo({ maxVisible = 3, two = false }: { maxVisible?: number; two?: boolean }) {
  return <><button>Origin</button><ToastProvider viewport={false} maxVisible={maxVisible} duration={0}><QueueAccess/><ToastQueueViewport/>{two && <ToastQueueViewport label="Other notifications"/>}</ToastProvider></>;
}
describe("F toast regressions", () => {
  it("#22 restores equivalent action then previous outside focus when dismissing", () => {
    const v = render(<ToastDemo/>);
    let a = "", b = "";
    act(() => { a = queue.toast({ title: "A", action: <button>Action A</button> }); b = queue.toast({ title: "B", action: <button>Action B</button> }); });
    act(() => v.getByRole("button", { name: "Origin" }).focus());
    act(() => v.getByRole("button", { name: "Action B", hidden: true }).focus());
    act(() => queue.dismiss(b));
    expect(document.activeElement).toBe(v.getByRole("button", { name: "Action A" }));
    act(() => queue.dismiss(a));
    expect(document.activeElement).toBe(v.getByRole("button", { name: "Origin" }));
  });
  it("#22 close and Escape dismissal use survivor then viewport fallback", () => {
    const v = render(<ToastDemo/>);
    act(() => { queue.toast({ title: "A" }); queue.toast({ title: "B" }); });
    const close = v.getAllByRole("button", { name: "Dismiss notification", hidden: true }).at(-1)!;
    act(() => close.focus()); fireEvent.click(close);
    expect(document.activeElement?.getAttribute("data-slot")).toBe("toast-close");
    fireEvent.keyDown(v.getByRole("region"), { key: "Escape" });
    expect(document.activeElement).toBe(v.getByRole("region"));
  });
  it("#22 overflow pins focused toast until focus leaves", () => {
    const v = render(<ToastDemo maxVisible={1}/>);
    let id = "";
    act(() => { id = queue.toast({ title: "Focused" }); });
    act(() => v.getByRole("button", { name: "Dismiss notification" }).focus());
    act(() => queue.toast({ title: "New" }));
    expect(queue.visible.map(t => t.id)).toEqual([id]);
    expect(document.activeElement?.isConnected).toBe(true);
    act(() => v.getByRole("button", { name: "Origin" }).focus());
    expect(queue.visible[0].title).toBe("New");
  });
  it("#22 expiry races restore focus using the same removal path", () => {
    jest.useFakeTimers();
    const v = render(<ToastDemo/>);
    act(() => queue.toast({ title: "Expires", duration: 100 }));
    act(() => v.getByRole("button", { name: "Origin" }).focus());
    act(() => v.getByRole("button", { name: "Dismiss notification" }).focus());
    act(() => queue.setFocused(false)); // Timer resumption/expiry race while DOM still holds focus.
    tick(100);
    expect(document.activeElement).toBe(v.getByRole("button", { name: "Origin" }));
  });
  it("#49 one provider announcer serializes enqueue/update repeats and dismisses silently", () => {
    jest.useFakeTimers();
    const v = render(<ToastDemo two/>);
    let id = "";
    act(() => { id = queue.toast({ title: "Same" }); queue.toast({ title: "Same" }); });
    expect(v.getAllByRole("status").length).toBe(1);
    const live = v.getByRole("status");
    tick(50); expect(live.textContent).toBe("Same");
    tick(650); expect(live.textContent).toBe("");
    tick(50); expect(live.textContent).toBe("Same");
    tick(650);
    act(() => queue.update(id, { title: "Updated" }));
    tick(50); expect(live.textContent).toBe("Updated");
    act(() => queue.dismiss(id));
    expect(live.textContent).toBe("Updated");
  });
  it("#49 enqueue followed by update in one batch announces both events", () => {
    jest.useFakeTimers();
    const v = render(<ToastDemo/>);
    act(() => { const id = queue.toast({ title: "Before" }); queue.update(id, { title: "After" }); });
    tick(50); expect(v.getByRole("status").textContent).toBe("Before");
    tick(650); tick(50); expect(v.getByRole("status").textContent).toBe("After");
  });
  it("#50 hidden document mounts paused before scheduling initial queue", () => {
    jest.useFakeTimers();
    const descriptor = Object.getOwnPropertyDescriptor(document, "hidden");
    Object.defineProperty(document, "hidden", { value: true, configurable: true });
    try {
      const { result } = renderHook(() => useToastQueue({ duration: 100, initialToasts: [{ title: "Hidden" }] }));
      expect(result.current.paused).toBe(true); tick(1000); expect(result.current.toasts.length).toBe(1);
      Object.defineProperty(document, "hidden", { value: false, configurable: true });
      act(() => document.dispatchEvent(new Event("visibilitychange"))); tick(100); expect(result.current.toasts.length).toBe(0);
    } finally { if (descriptor) Object.defineProperty(document, "hidden", descriptor); else delete (document as unknown as { hidden?: boolean }).hidden; }
  });
  it("#53 long durations use bounded chunks and preserve elapsed time across pauses", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useToastQueue({ duration: 0x7fffffff + 1000 }));
    let id = "";
    act(() => { id = result.current.toast({ title: "Long" }); });
    tick(500); act(() => result.current.setHovered(true));
    tick(5000); expect(result.current.remaining(id)).toBe(0x7fffffff + 500);
    act(() => result.current.setHovered(false));
    tick(0x7fffffff); expect(result.current.toasts.length).toBe(1);
    tick(499); expect(result.current.toasts.length).toBe(1);
    tick(1); expect(result.current.toasts.length).toBe(0);
    act(() => result.current.toast({ title: "Persistent", duration: Infinity }));
    tick(0x7fffffff + 1000); expect(result.current.toasts.length).toBe(1);
  });
});
