import { constTrue } from "fp-ts/function";
import { memo } from "react";
import { View } from "../components/styled";

// TODO: Styled.
export const Hr = memo(function Hr() {
  return <View className="my-4 h-[1px] w-full bg-gray-300 dark:bg-gray-800" />;
}, constTrue);
