import Link from "next/link";
import { FC } from "react";
import { Text } from "./styled";

export type TextLinkProps = {
  href: string;
  text: string;
};

export const TextLink: FC<TextLinkProps> = ({ href, text }) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <Text
        accessibilityRole="link"
        className="rounded p-2 text-lg text-gray-900 ring-inset focus:outline-none focus-visible:ring-2 dark:text-gray-200"
      >
        {text}
      </Text>
    </Link>
  );
};
