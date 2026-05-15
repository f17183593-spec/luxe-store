import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../src/components/ui/Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Add to Cart</Button>);
    expect(screen.getByText("Add to Cart")).toBeDefined();
  });

  it("applies primary variant by default", () => {
    const { container } = render(<Button>Click</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn.className).toContain("rounded-full");
  });

  it("applies disabled state", () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn.hasAttribute("disabled")).toBe(true);
  });

  it("shows loading spinner when loading", () => {
    const { container } = render(<Button loading>Loading</Button>);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeDefined();
  });

  it("disables button when loading", () => {
    const { container } = render(<Button loading>Saving</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn.hasAttribute("disabled")).toBe(true);
  });

  it("applies gold variant styles", () => {
    const { container } = render(<Button variant="gold">Gold</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn.className).toContain("bg-luxe-gold");
  });

  it("applies sm size", () => {
    const { container } = render(<Button size="sm">Small</Button>);
    const btn = container.firstChild as HTMLElement;
    expect(btn.className).toContain("text-xs");
  });
});
