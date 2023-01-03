import clsx from "clsx";
import { styled } from "nativewind";
import { View } from "react-native";
import { appBg } from "../lib/appBg";

export const Ring = styled(
  View,
  clsx("rounded ring-1 ring-gray-300 dark:ring-gray-800", appBg)
);
