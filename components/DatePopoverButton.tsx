import { FC, useRef } from "react";
import { Temporal } from "temporal-polyfill";
import { DatePopover } from "./DatePopover";
import { Formatted } from "./Formatted";
import {
  PopoverButton,
  PopoverButtonProps,
  PopoverButtonRef,
} from "./PopoverButton";

export type DatePopoverButtonProps = Omit<
  PopoverButtonProps,
  "title" | "renderPopover"
> & {
  value: Temporal.PlainDate;
  onChange: (value: Temporal.PlainDate) => void;
};

export const DatePopoverButton: FC<DatePopoverButtonProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const popoverButtonRef = useRef<PopoverButtonRef>(null);

  const handleDone = (value: Temporal.PlainDate) => {
    popoverButtonRef.current?.close();
    onChange(value);
  };

  // Temporal.PlainYearMonth

  return (
    <PopoverButton
      ref={popoverButtonRef}
      title={<Formatted value={value} />}
      anchorOrigin={{ block: "end", inline: "center" }}
      transformOrigin={{ block: "start", inline: "center" }}
      renderPopover={() => (
        <DatePopover initialValue={value} onDone={handleDone} />
      )}
      {...rest}
    />
  );
};
