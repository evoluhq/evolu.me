import { useIntl } from "react-intl";

export const useAppDescription = () => {
  const intl = useIntl();
  return intl.formatMessage({
    defaultMessage:
      "Evolu Me is a mind-mapping app focused on privacy that works offline to keep your thoughts organized.",
    id: "TRNu84",
  });
};
