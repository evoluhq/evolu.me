import NextLink from "next/link";
import { FC, ReactNode } from "react";

export type LinkProps = {
  href: string;
  children: ReactNode;
  scroll?: boolean;
};

export const Link: FC<LinkProps> = ({ href, children, scroll }) => {
  return (
    <NextLink href={href} scroll={scroll} passHref legacyBehavior>
      {children}
    </NextLink>
  );
};
