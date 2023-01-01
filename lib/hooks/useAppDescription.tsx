import { useIntl } from "react-intl";

export const useAppDescription = () => {
  const intl = useIntl();
  return intl.formatMessage({
    defaultMessage:
      "Evolu Me is a mind-mapping app focused on privacy to keep your thoughts organized.",
    id: "U9pnnW",
  });
};
