import { FC } from "react";
import { TextInput, TextInputProps } from "react-native";

export const EvoluTextInput: FC<
  Omit<TextInputProps, "maxLength" | "className">
> = (props) => {
  return (
    <TextInput
      {...props}
      maxLength={1000} // The same as NonEmptyString1000
      className="
        border-b
      border-gray-300
        text-lg
      text-gray-900
        outline-none
      dark:border-gray-700
      dark:text-gray-200"
    />
  );
};
