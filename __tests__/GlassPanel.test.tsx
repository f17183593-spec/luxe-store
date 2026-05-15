import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlassPanel } from "../src/components/ui/GlassPanel";

describe("GlassPanel", () => {
  it("renders children", () => {
    render(<GlassPanel>Hello</GlassPanel>);
    expect(screen.getByText("Hello")).toBeDefined();
  });

  it("applies glass class by default", () => {
    const { container } = render(<GlassPanel>Content</GlassPanel>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("glass");
  });

  it("applies glass-dark for dark variant", () => {
    const { container } = render(
      <GlassPanel variant="dark">Dark</GlassPanel>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("glass-dark");
  });

  it("applies glass-gold for gold variant", () => {
    const { container } = render(
      <GlassPanel variant="gold">Gold</GlassPanel>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("glass-gold");
  });

  it("renders without animation when animate is false", () => {
    const { container } = render(
      <GlassPanel animate={false}>Static</GlassPanel>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("rounded-2xl");
    expect(el.className).toContain("p-8");
  });

  it("accepts custom className", () => {
    const { container } = render(
      <GlassPanel className="custom-class">Custom</GlassPanel>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("custom-class");
  });
});
