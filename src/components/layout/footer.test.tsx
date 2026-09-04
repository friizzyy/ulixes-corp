import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Footer } from "./footer";

const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: mockUsePathname,
}));

describe("Footer", () => {
  beforeEach(() => {
    mockUsePathname.mockReset();
    mockUsePathname.mockReturnValue("/");
  });

  it("continues the editorial canvas through essential navigation", () => {
    const { container } = render(<Footer />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "ULIXES CORPORATION" }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByText("ULIXES")).toBeInTheDocument();

    expect(
      screen.getByRole("navigation", { name: "Footer navigation" }),
    ).toHaveAttribute("data-mobile-layout", "route-grid");
    // Four: Services, Experience, Nasdaq Calypso and the mandate action.
    expect(container.querySelectorAll("[data-footer-index]")).toHaveLength(4);

    const destinations = [
      ["Services", "/services"],
      ["Experience", "/institutional-experience"],
      ["Nasdaq Calypso", "/nasdaq-calypso"],
      ["Discuss a mandate", "/contact"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ] as const;

    for (const [name, href] of destinations) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }

    // Approach landed on the practitioner bio and was dropped with it.
    for (const retired of ["Approach", "Philosophy"]) {
      expect(
        screen.queryByRole("link", { name: retired }),
      ).not.toBeInTheDocument();
    }
  });

  it("groups the compact phone footer into brand, routes, and legal rows", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(
      within(footer).getByRole("group", { name: "Footer brand and contact" }),
    ).toContainElement(screen.getByRole("link", { name: "ULIXES CORPORATION" }));
    expect(
      within(footer).getByRole("navigation", { name: "Footer navigation" }),
    ).toHaveAttribute("data-mobile-layout", "route-grid");
    expect(
      within(footer).getByRole("group", { name: "Footer legal" }),
    ).toContainElement(screen.getByRole("link", { name: "Privacy" }));
  });

  it.each(["/", "/privacy", "/this-does-not-exist"])(
    "renders the one editorial footer on %s",
    (pathname) => {
      mockUsePathname.mockReturnValue(pathname);
      const { container } = render(<Footer />);

      /*
       * The interior footer (bracket wordmark, content.ts link order) retired
       * with the dark theme, and the pathname check went with it: the footer
       * no longer consults the route at all, so every path, known or not,
       * gets the same directory and the same action.
       */
      expect(mockUsePathname).not.toHaveBeenCalled();
      expect(screen.getByText("ULIXES")).toBeInTheDocument();
      expect(container.textContent).not.toContain("[");
      expect(
        screen.queryByRole("link", { name: "Contact" }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Discuss a mandate" }),
      ).toHaveAttribute("href", "/contact");
      expect(
        screen.getByRole("navigation", { name: "Footer navigation" }),
      ).toHaveAttribute("data-mobile-layout", "route-grid");
      expect(
        container.querySelectorAll("[data-footer-index]"),
      ).toHaveLength(4);
    },
  );
});
