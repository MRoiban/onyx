import * as React from "react";
import { describe, expect, it } from "bun:test";
import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { Badge, Count, StatusDot, badgeVariants, countVariants, statusDotVariants, badgeAttributes, displayAttributes } from "../src/components/badge";
import { Avatar, avatarVariants, avatarAttributes } from "../src/components/avatar";
import { Alert, alertVariants } from "../src/components/alert";
import { skeletonVariants } from "../src/components/skeleton";
import { cardVariants } from "../src/components/card";
import { separatorVariants } from "../src/components/separator";
import { linkVariants } from "../src/components/link";
import { emptyStateVariants } from "../src/components/empty-state";
import { containerVariants } from "../src/components/layout";
import { meterVariants } from "../src/components/meter";
import { progressVariants } from "../src/components/progress";
import { tagVariants } from "../src/components/tag";
import { toastVariants, toastViewportVariants } from "../src/components/toast";

const css = readFileSync("src/styles/display.css", "utf8");
const tones = ["neutral", "info", "success", "warning", "danger"] as const;

describe("F round 2 display variants", () => {
  it("R16 variant options produce different standalone class strings", () => {
    expect(badgeVariants()).not.toBe(badgeVariants({ tone: "danger", variant: "outline" }));
    expect(avatarVariants()).not.toBe(avatarVariants({ size: "lg", variant: "square" }));
    expect(cardVariants()).not.toBe(cardVariants({ interactive: true }));
    expect(linkVariants()).not.toBe(linkVariants({ variant: "muted" }));
    expect(skeletonVariants()).not.toBe(skeletonVariants({ shape: "circle" }));
    expect(containerVariants()).not.toBe(containerVariants({ size: "full" }));
  });

  it("R16 CSS covers every emitted display modifier on markup without attributes", () => {
    const classes = [
      ...tones.flatMap(tone => [
        ...(["subtle", "solid", "outline"] as const).flatMap(variant => [badgeVariants({ tone, variant }), countVariants({ tone, variant })]),
        statusDotVariants({ tone, pulse: true }), statusDotVariants({ tone, pulse: false }),
        alertVariants({ tone, variant: "inline" }), alertVariants({ tone, variant: "banner" }),
        emptyStateVariants({ tone }), meterVariants({ tone }), progressVariants({ tone }), tagVariants({ tone }), toastVariants({ tone }),
      ]),
      ...(["sm", "md", "lg"] as const).flatMap(size => [avatarVariants({ size, variant: "circle" }), avatarVariants({ size, variant: "square" }), emptyStateVariants({ size })]),
      ...(["text", "text-line", "circle", "rect"] as const).map(shape => skeletonVariants({ shape })),
      cardVariants({ interactive: true }), cardVariants({ interactive: false }),
      ...(["horizontal", "vertical"] as const).flatMap(orientation => [separatorVariants({ orientation, variant: "line" }), separatorVariants({ orientation, variant: "label" })]),
      linkVariants({ variant: "default" }), linkVariants({ variant: "muted" }),
      ...(["sm", "md", "lg", "full"] as const).map(size => containerVariants({ size })),
      progressVariants({ indeterminate: true }),
      ...(["inline", "fixed"] as const).flatMap(variant => [toastViewportVariants({ variant, state: "expanded" }), toastViewportVariants({ variant, state: "stacked" })]),
    ];
    const v = render(<>{classes.map((className, index) => <span key={index} className={className} />)}</>);
    const modifiers = new Set<string>();
    for (const element of v.container.querySelectorAll("span")) {
      expect(element.getAttributeNames()).toEqual(["class"]);
      for (const name of element.classList) if (name.includes("--")) modifiers.add(name);
    }
    expect(modifiers.size).toBeGreaterThan(35);
    for (const name of modifiers) expect(css).toMatch(new RegExp(`\\.${name}(?=[\\s,):{])`));
    // Each non-default modifier must share its declaration block with its attribute.
    for (const [attribute, modifier] of [
      ['.onyx-display-tone[data-tone="danger"]', '.onyx-display--tone-danger'],
      ['.onyx-badge[data-variant="outline"]', '.onyx-badge--variant-outline'],
      ['.onyx-avatar[data-size="lg"]', '.onyx-avatar--size-lg'],
      ['.onyx-avatar[data-variant="square"]', '.onyx-avatar--variant-square'],
    ]) {
      expect(css.split("}").some(rule => rule.slice(0, rule.indexOf("{")).includes(attribute) && rule.slice(0, rule.indexOf("{")).includes(modifier))).toBe(true);
    }
  });

  it("R16 components retain data attributes and companion helpers remain supported", () => {
    const v = render(<><Badge tone="danger" variant="outline" /><Avatar size="lg" variant="square" /><Count value={1} tone="warning" variant="subtle" /><StatusDot tone="success" pulse /><Alert tone="danger" variant="banner" /></>);
    for (const [slot, attrs] of [
      ["badge", badgeAttributes({ tone: "danger", variant: "outline" })],
      ["avatar", avatarAttributes({ size: "lg", variant: "square" })],
      ["count", displayAttributes({ tone: "warning", variant: "subtle" })],
      ["status-dot", displayAttributes({ tone: "success", pulse: true })],
      ["alert", displayAttributes({ tone: "danger", variant: "banner" })],
    ] as const) {
      const element = v.container.querySelector(`[data-slot="${slot}"]`)!;
      for (const [name, value] of Object.entries(attrs)) if (value !== undefined) expect(element.getAttribute(name)).toBe(String(value));
    }
  });
});
