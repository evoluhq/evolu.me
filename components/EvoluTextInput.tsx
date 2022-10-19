import { forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";

export const EvoluTextInput = forwardRef<
  TextInput,
  Omit<TextInputProps, "maxLength" | "className">
>((props, ref) => {
  return (
    <TextInput
      {...props}
      ref={ref}
      maxLength={1000} // The same as NonEmptyString1000
      className="
        my-2
        border-b
        border-gray-300
        text-lg
        text-gray-900
        outline-none
        dark:border-gray-700
        dark:text-gray-200
      "
    />
  );
});

EvoluTextInput.displayName = "EvoluTextInput";
