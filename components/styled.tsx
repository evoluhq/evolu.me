import { styled } from "nativewind";
import {
  Pressable as RnPressable,
  ScrollView as RnScrollView,
  Text as RnText,
  TextInput as RnTextInput,
  View as RnView,
} from "react-native";

export const Pressable = styled(RnPressable);
export const ScrollView = styled(RnScrollView);
export const Text = styled(RnText);
export const TextInput = styled(RnTextInput);
export const View = styled(RnView);

// To test build without Nativewind, use this code:

// import {
//   Pressable as RnPressable,
//   ScrollView as RnScrollView,
//   Text as RnText,
//   TextInput as RnTextInput,
//   View as RnView,
// } from "react-native";

// export const Pressable = RnPressable;
// export const ScrollView = RnScrollView;
// export const Text = RnText;
// export const TextInput = RnTextInput;
// export const View = RnView;
