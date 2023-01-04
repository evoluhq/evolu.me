import { useIntl } from "react-intl";

export const useAppDescription = () => {
  const intl = useIntl();
  return intl.formatMessage({
    defaultMessage: `EvoluMe is a local-first and open-source personal knowledge graph focused on privacy. It's like mind mapping but better. To keep your thoughts organized.`,
    id: "y6SPZw",
  });
};
