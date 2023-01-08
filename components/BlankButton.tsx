import clsx from "clsx";
import { forwardRef } from "react";
import { Button, ButtonProps } from "./Button";
import { View } from "./styled";

export interface BlankButtonProps extends ButtonProps {
  title: string;
  state?: "active";
}

export const BlankButton = forwardRef<View, BlankButtonProps>(
  function BlankButton({ title, state, ...props }, ref) {
    return (
      <Button
        accessibilityLabel={title}
        {...props}
        ref={ref}
        className="w-9 items-center"
      >
        <View
          className={clsx(
            "top-[17px] h-3 w-3 rounded-sm ring-current group-focus-visible:ring-1",
            "bg-gray-200 group-hover:bg-gray-300",
            "dark:bg-gray-800 dark:group-hover:bg-gray-900",
            state === "active" && "rotate-45"
          )}
        />
      </Button>
    );
  }
);
