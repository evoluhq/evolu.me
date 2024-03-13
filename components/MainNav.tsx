import { create, props } from "@stylexjs/stylex";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect, useRef } from "react";
import { appSpacing } from "../lib/Themes";
import { colors, spacing } from "../lib/Tokens.stylex";
import { useIsActiveLink } from "../lib/hooks/useIsActiveLink";
import { Link } from "./Link";
import { PopoverButton, PopoverButtonRef } from "./PopoverButton";

/**
 * TODO:
 *
 * - Show/hide animation
 * - Position the popover under the button
 * - Delayed hiding
 */
export const MainNav: FC = () => {
  const router = useRouter();
  const popoverButtonRef = useRef<PopoverButtonRef>(null);

  useEffect(() => {
    const handleRouteChange = () => {
      popoverButtonRef.current?.close();
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return (
    <nav {...props([appSpacing, styles.nav])}>
      <PopoverButton
        ref={popoverButtonRef}
        title="⋯"
        titleStyle={styles.menuButton}
        anchorOrigin={{ block: "end", inline: "start" }}
        offsetStyle={styles.popoverOffset}
        renderPopover={() => <Links />}
      />
      {/* SEO */}
      <div hidden>
        <Links />
      </div>
    </nav>
  );
};

const Links: FC = () => {
  return (
    <div {...props(styles.links)}>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/settings">Settings</NavLink>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/changelog">Changelog</NavLink>
      <NavLink href="/privacy">Privacy</NavLink>
    </div>
  );
};

const NavLink: FC<{
  href: string;
  children: ReactNode;
}> = ({ href, children }) => {
  const isActive = useIsActiveLink(href);

  return (
    <Link href={href} style={[styles.link, isActive && styles.linkActive]}>
      {children}
    </Link>
  );
};

const styles = create({
  nav: {
    display: "flex",
    justifyContent: "end",
    /** It can't be bigger because seven buttons wouldn't fit on a 320px screen. */
    paddingInline: spacing.xxxs,
  },
  popoverOffset: {
    translate: `calc(-1 * ${spacing.xxs}) 0`,
  },
  menuButton: {
    fontWeight: "bold",
  },
  links: {
    paddingBlock: spacing.xxxs,
  },
  link: {
    paddingInline: spacing.s,
    paddingBlock: spacing.xxs,
    color: colors.secondary,
    backgroundColor: "none",
    lineHeight: spacing.s as unknown as number,
  },
  linkActive: {
    color: colors.primary,
  },
});
