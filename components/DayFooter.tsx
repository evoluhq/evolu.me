import { create, props } from "@stylexjs/stylex";
import { useRouter } from "next/router";
import { FC, memo, useContext } from "react";
import { Temporal } from "temporal-polyfill";
import { colors } from "../lib/Tokens.stylex";
import { NowContext } from "../lib/contexts/NowContext";
import { UiStateContext } from "../lib/contexts/UiStateContext";
import { Button } from "./Button";

export const DayFooter = memo<{
  date: Temporal.PlainDate;
}>(function DayFooter({ date }) {
  const now = useContext(NowContext);
  const isToday = date.equals(now.plainDateISO());

  return (
    <div {...props(styles.container)}>
      <TodayButton isToday={isToday} />
      {/* <SearchButton /> */}
    </div>
  );
});

const TodayButton: FC<{ isToday: boolean }> = ({ isToday }) => {
  const router = useRouter();
  const { dayWeek } = useContext(UiStateContext);

  const handlePress = () => {
    if (!isToday) {
      void router.push("/");
      return;
    }

    const { carouselRef, todayAttentionAnimation } = dayWeek;
    if (!carouselRef.current) return;

    if (carouselRef.current.isCentered()) {
      todayAttentionAnimation?.cancel();
      todayAttentionAnimation?.play();
    } else {
      carouselRef.current.scrollToCenter();
    }
  };

  return (
    <Button
      title="Today"
      variant="webBig"
      titleStyle={!isToday && styles.buttonTitleActive}
      onPress={handlePress}
    />
  );
};

// const SearchButton = memo(function SearchButton() {
//   return <Button title="Search" variant="webBig" />;
// });

const styles = create({
  container: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  buttonTitleActive: {
    color: colors.secondary,
  },
});
