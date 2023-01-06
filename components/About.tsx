import { useAppDescription } from "../lib/hooks/useAppDescription";
import Balancer from "react-wrap-balancer";
import { Text } from "./Text";

export const About = () => {
  const description = useAppDescription();

  return (
    <Text className="text-center">
      <Balancer>{description}</Balancer>
    </Text>
  );
};
