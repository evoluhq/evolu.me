import { clsx } from "clsx";
import { forwardRef, KeyboardEvent } from "react";
import { TextInput as RnTextInput, TextInputProps } from "react-native";
import { TextInput, View } from "../components/styled";

export const EvoluTextInput = forwardRef<
  RnTextInput,
  Omit<
    TextInputProps,
    "maxLength" | "className" | "blurOnSubmit" | "onKeyPress"
  > & {
    hasUnsavedChange?: boolean;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  }
>(function EvoluTextInput({ hasUnsavedChange, onKeyDown, ...props }, ref) {
  return (
    <View className="flex-1">
      <View
        className={clsx(
          "absolute top-10 -z-10 h-[1px] w-full bg-gray-300 dark:bg-gray-800",
          hasUnsavedChange && "bg-gray-700 dark:bg-gray-500"
        )}
      />
      <TextInput
        {...props}
        autoComplete="off"
        ref={ref}
        maxLength={1000} // The same as NonEmptyString1000
        blurOnSubmit={false}
        className="py-2 text-lg text-gray-900 outline-none dark:text-gray-200 dark:antialiased"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onKeyPress={onKeyDown as any}
      />
    </View>
  );
});
