import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Navigation } from "./navigation";

const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: mockUsePathname,
}));

describe("Navigation", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  it("publishes the editorial navigation and direct action", () => {
    render(<Navigation />);

    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "ULIXES CORPORATION" }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByText("ULIXES")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute(
      "href",
      "/services",
    );
    expect(
      screen.getByRole("link", { name: "Discuss a mandate" }),
    ).toHaveAttribute("href", "/contact");
    expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute(
      "href",
      "/institutional-experience",
    );
    expect(
      screen.getByRole("link", { name: "Nasdaq Calypso" }),
    ).toHaveAttribute("href", "/nasdaq-calypso");
    /*
     * Expertise became Services when the page was rebuilt around the four
     * capabilities. Approach was dropped because it pointed at the
     * practitioner bio rather than any methodology.
     */
    for (const retired of ["Approach", "Philosophy"]) {
      expect(
        screen.queryByRole("link", { name: retired }),
      ).not.toBeInTheDocument();
    }
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("link", { name: "Mandate" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("keeps the concise mandate action and menu available through 895px", () => {
    render(<Navigation />);

    const navigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });
    const mobileAction = screen.getByRole("link", { name: "Mandate" });
    expect(mobileAction).toHaveAttribute("href", "/contact");
    expect(mobileAction).toHaveClass("min-[896px]:hidden");
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveClass(
      "min-[896px]:hidden",
    );
    expect(navigation).toHaveClass(
      "pl-[calc(var(--mobile-gutter)+var(--safe-area-left))]",
      "pr-[calc(var(--mobile-gutter)+var(--safe-area-right))]",
      "min-[896px]:pl-[max(2.5rem,var(--safe-area-left))]",
      "min-[896px]:pr-[max(2.5rem,var(--safe-area-right))]",
    );
    expect(navigation).not.toHaveClass(
      "pl-[max(1.25rem,var(--safe-area-left))]",
      "sm:pl-[max(1.5rem,var(--safe-area-left))]",
    );
  });

  it.each(["/", "/privacy", "/this-does-not-exist"])(
    "renders the one editorial chrome on %s",
    (pathname) => {
      mockUsePathname.mockReturnValue(pathname);
      const { container } = render(<Navigation />);

      /*
       * There is no interior variant left to fall back to. Privacy and terms
       * were the last routes on the dark theme, and unknown paths render the
       * editorial not-found page, so every pathname gets the same brand, the
       * same link order and the same action. The bracket wordmark, the Get
       * Started pill and the content.ts link order went with the theme.
       */
      expect(screen.getByText("ULIXES")).toBeInTheDocument();
      expect(container.textContent).not.toContain("[");
      expect(screen.queryByText("Get Started")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "Contact" }),
      ).not.toBeInTheDocument();
      expect(
        screen.getAllByRole("link").map((link) => link.getAttribute("href")),
      ).toEqual([
        "/",
        "/services",
        "/institutional-experience",
        "/nasdaq-calypso",
        "/contact",
        "/contact",
      ]);
      expect(
        screen.getByRole("link", { name: "Discuss a mandate" }),
      ).toHaveAttribute("href", "/contact");
    },
  );

  it("marks the current page on the services and experience pages", () => {
    mockUsePathname.mockReturnValue("/services");
    const services = render(<Navigation />);

    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "Experience" }),
    ).not.toHaveAttribute("aria-current");
    services.unmount();

    mockUsePathname.mockReturnValue("/institutional-experience");
    render(<Navigation />);

    expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "Services" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("gives the active route a visible marker in the mobile menu", async () => {
    const user = userEvent.setup();
    mockUsePathname.mockReturnValue("/services");
    render(<Navigation />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const activeLink = within(
      screen.getByRole("dialog", { name: "Navigation menu" }),
    ).getByRole("link", { name: "Services" });
    expect(activeLink).toHaveAttribute("aria-current", "page");
    expect(activeLink).toHaveAttribute("data-current-route", "true");
    expect(
      within(activeLink).getByText("Current", { selector: "span" }),
    ).toBeInTheDocument();
  });

  it("keeps the navigation on a legible surface over the mobile Calypso masthead", () => {
    mockUsePathname.mockReturnValue("/nasdaq-calypso");
    render(<Navigation />);

    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toHaveClass(
      "max-[895px]:bg-[#f3f1ec]/95",
      "max-[895px]:backdrop-blur-xl",
    );
  });

  it("closes the mobile dialog on Escape and restores trigger focus", async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);

    const firstLink = screen.getAllByRole("link", { name: "Services" }).at(-1);
    await waitFor(() => expect(firstLink).toHaveFocus());

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("dialog", { name: "Navigation menu" }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    // Instant: html carries scroll-behavior: smooth, and a smooth restore
    // swept the page back to where the reader was.
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
  });

  it("closes the mobile sheet and restores body scrolling at the desktop breakpoint", async () => {
    const user = userEvent.setup();
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    let desktop = false;
    const originalMatchMedia = window.matchMedia;
    const mediaQuery = {
      get matches() {
        return desktop;
      },
      media: "(min-width: 896px)",
      onchange: null,
      addEventListener: (_: "change", listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener);
      },
      removeEventListener: (_: "change", listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener);
      },
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: () => mediaQuery,
    });

    try {
      render(<Navigation />);
      await user.click(screen.getByRole("button", { name: "Open menu" }));

      expect(document.body.style.overflow).toBe("hidden");
      expect(document.body.style.position).toBe("fixed");

      desktop = true;
      listeners.forEach((listener) =>
        listener({ matches: desktop, media: mediaQuery.media } as MediaQueryListEvent),
      );

      await waitFor(() =>
        expect(
          screen.queryByRole("dialog", { name: "Navigation menu" }),
        ).not.toBeInTheDocument(),
      );
      expect(document.body.style.overflow).toBe("");
      expect(document.body.style.position).toBe("");
    } finally {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        value: originalMatchMedia,
      });
    }
  });

  it("keeps Tab inside the dialog without stopping on the backdrop", async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    const trigger = screen.getByRole("button", { name: "Open menu" });
    // Nothing to control until the dialog exists.
    expect(trigger).not.toHaveAttribute("aria-controls");

    await user.click(trigger);

    const toggle = screen.getByRole("button", { name: "Close menu" });
    expect(toggle).toHaveAttribute("aria-controls", "mobile-navigation-dialog");
    const dialog = screen.getByRole("dialog", { name: "Navigation menu" });
    const lastLink = within(dialog).getByRole("link", {
      name: "Discuss a mandate",
    });

    /*
     * The toggle leads the cycle even though it sits outside the overlay:
     * left out, Tab from the last link ran back to the logo and Escape was
     * the only keyboard way to close.
     */
    lastLink.focus();
    await user.tab();
    expect(toggle).toHaveFocus();

    await user.tab({ shift: true });
    expect(lastLink).toHaveFocus();

    const dismiss = screen.getByRole("button", {
      name: "Dismiss navigation",
    });
    expect(dismiss).toHaveAttribute("tabindex", "-1");

    toggle.focus();
    await user.tab();
    expect(within(dialog).getByRole("link", { name: "Services" })).toHaveFocus();
    expect(dismiss).not.toHaveFocus();
  });

  it("presents mobile navigation as a dismissible full-height sheet", async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    expect(
      screen.getByRole("dialog", { name: "Navigation menu" }),
    ).toHaveAttribute("data-presentation", "sheet");

    await user.click(
      screen.getByRole("button", { name: "Dismiss navigation" }),
    );

    expect(
      screen.queryByRole("dialog", { name: "Navigation menu" }),
    ).not.toBeInTheDocument();
  });

  it("keeps the mandate action in the mobile sheet action region", async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const actionRegion = screen.getByRole("region", {
      name: "Navigation action",
    });
    expect(actionRegion).toHaveClass(
      "pl-[calc(var(--mobile-gutter)+var(--safe-area-left))]",
      "pr-[calc(var(--mobile-gutter)+var(--safe-area-right))]",
    );
    expect(
      within(actionRegion).getByRole("link", { name: "Discuss a mandate" }),
    ).toHaveAttribute("href", "/contact");
  });
});
