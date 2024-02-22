import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { Temporal } from "temporal-polyfill";

type Now = typeof Temporal.Now;

type NowContextValue = Now;

export const NowContext = createContext<NowContextValue>(Temporal.Now);

export const NowProvider: FC<{
  children: ReactNode;
  now?: Now;
}> = ({ children, now = Temporal.Now }) => {
  const [key, setKey] = useState(0);

  // Force all components using useNow to rerender at midnight.
  useEffect(() => {
    const now = Temporal.Now.zonedDateTimeISO();
    const ms = now
      .add({ days: 1 })
      .startOfDay()
      .since(now)
      .total({ unit: "milliseconds" });
    const timeoutId = window.setTimeout(() => {
      setKey(key + 1);
    }, ms);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [key]);

  return (
    <NowContext.Provider key={key} value={now}>
      {children}
    </NowContext.Provider>
  );
};
