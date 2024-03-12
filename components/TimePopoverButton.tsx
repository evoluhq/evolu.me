import { FC, useRef } from "react";
import { Temporal } from "temporal-polyfill";
import { Formatted } from "./Formatted";
import {
  PopoverButton,
  PopoverButtonProps,
  PopoverButtonRef,
} from "./PopoverButton";
import { TimePopover } from "./TimePopover";

export type TimePopoverButtonProps = Omit<
  PopoverButtonProps,
  "title" | "renderPopover"
> & {
  value: Temporal.PlainTime;
  onChange: (value: Temporal.PlainTime) => void;
};

export const TimePopoverButton: FC<TimePopoverButtonProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const popoverButtonRef = useRef<PopoverButtonRef>(null);

  return (
    <PopoverButton
      ref={popoverButtonRef}
      title={<Formatted value={value} />}
      anchorOrigin={{ block: "end", inline: "center" }}
      transformOrigin={{ block: "start", inline: "center" }}
      renderPopover={() => (
        <TimePopover
          initialValue={value}
          onDone={(value: Temporal.PlainTime) => {
            popoverButtonRef.current?.close();
            onChange(value);
          }}
          onCancel={() => {
            popoverButtonRef.current?.close();
          }}
        />
      )}
      {...rest}
    />
  );
};
