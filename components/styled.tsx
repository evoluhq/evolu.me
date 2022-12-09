import { styled } from "nativewind";
import {
  Pressable as RnPressable,
  ScrollView as RnScrollView,
  Text as RnText,
  TextInput as RnTextInput,
  View as RnView,
} from "react-native";

export const Pressable = styled(RnPressable);
// export type Pressable = RnPressable;

export const ScrollView = styled(RnScrollView);
export type ScrollView = RnScrollView;

export const Text = styled(RnText);
export type Text = RnText;

export const TextInput = styled(RnTextInput);
export type TextInput = RnTextInput;

export const View = styled(RnView);
export type View = RnView;
