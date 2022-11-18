import { useIntl } from "react-intl";

export const useAppDescription = () => {
  const intl = useIntl();
  return intl.formatMessage({
    defaultMessage:
      "Yet another mind mapping app, but this one is local, mobile, keyboard, and private first.",
    id: "uHd6uK",
  });
};
