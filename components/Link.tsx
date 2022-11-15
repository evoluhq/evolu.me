import NextLink from "next/link";
import { FC, ReactNode } from "react";

export type LinkProps = {
  href: string;
  children: ReactNode;
};

export const Link: FC<LinkProps> = ({ href, children }) => {
  return (
    <NextLink href={href} passHref legacyBehavior>
      {children}
    </NextLink>
  );
};
