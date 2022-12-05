import { styled } from "nativewind";
import { View } from "react-native";

export const Container = styled(View, "mx-auto w-full max-w-[500px] p-3", {
  variants: {
    backdrop: {
      true: "bg-white/[.85] backdrop-blur-md dark:bg-black/[.65] dark:backdrop-blur-md",
    },
  },
});
