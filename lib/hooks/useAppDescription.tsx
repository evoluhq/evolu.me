import { useIntl } from "react-intl";

export const useAppDescription = () => {
  const intl = useIntl();
  return intl.formatMessage({
    defaultMessage:
      "Yet another mind mapping app, but this one is local, private, mobile, and keyboard first.",
    id: "4mdDX2",
  });
};
