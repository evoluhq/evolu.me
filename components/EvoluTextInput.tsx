import { clsx } from "clsx";
import { forwardRef, KeyboardEvent } from "react";
import { TextInput, TextInputProps } from "react-native";
import { TextInput as StyledTextInput } from "./styled";

export const EvoluTextInput = forwardRef<
  TextInput,
  Omit<
    TextInputProps,
    "maxLength" | "className" | "blurOnSubmit" | "onKeyPress"
  > & {
    hasUnsavedChange?: boolean;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  }
>(function EvoluTextInput({ hasUnsavedChange, onKeyDown, ...props }, ref) {
  return (
    <StyledTextInput
      {...props}
      autoComplete="off"
      ref={ref}
      maxLength={1000} // The same as NonEmptyString1000
      blurOnSubmit={false}
      className={clsx(
        "my-2 flex-1 border-b border-gray-300 text-lg text-gray-900 outline-none dark:border-gray-800 dark:text-gray-200",
        hasUnsavedChange && "border-gray-700 dark:border-gray-500"
      )}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onKeyPress={onKeyDown as any}
    />
  );
});
