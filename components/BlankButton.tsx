import clsx from "clsx";
import { forwardRef } from "react";
import { Button, ButtonProps } from "./Button";
import { View } from "./styled";

export interface BlankButtonProps extends ButtonProps {
  title: string;
  type: "square" | "circle";
  state?: "active";
}

export const BlankButton = forwardRef<View, BlankButtonProps>(
  function BlankButton({ title, type, state, ...props }, ref) {
    return (
      <Button accessibilityLabel={title} {...props} ref={ref}>
        <View
          className={clsx(
            "top-[1px] mx-3 my-4 h-3 w-3 bg-gray-200 ring-current group-hover:bg-gray-300 group-focus-visible:ring-1 dark:bg-gray-800 dark:group-hover:bg-gray-900",
            type === "square" ? "rounded-sm" : "rounded-md",
            state === "active" && "scale-90"
          )}
        />
      </Button>
    );
  }
);
