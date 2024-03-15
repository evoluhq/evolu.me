import { FC, useRef } from "react";
import { Temporal } from "temporal-polyfill";
import { Formatted } from "./Formatted";
import {
  PopoverButton,
  PopoverButtonProps,
  PopoverButtonRef,
} from "./PopoverButton";
import { YearMonthPopover } from "./YearMonthPopover";

export type YearMonthPopoverButtonProps = Omit<
  PopoverButtonProps,
  "title" | "renderPopover"
> & {
  value: Temporal.PlainYearMonth;
  onChange: (value: Temporal.PlainYearMonth) => void;
};

export const YearMonthPopoverButton: FC<YearMonthPopoverButtonProps> = ({
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
        <YearMonthPopover
          initialValue={value}
          onDone={(value: Temporal.PlainYearMonth) => {
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
