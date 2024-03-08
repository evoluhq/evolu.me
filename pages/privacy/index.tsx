import { PageWithTitle } from "../../components/PageWithTitle";
import { Text } from "../../components/Text";

export default function Privacy() {
  return (
    <PageWithTitle title="Privacy">
      <Text tag="p">
        Your privacy is not just a policy; it&apos;s built into every aspect of
        this app. As a local-first and end-to-end encrypted web application,
        Evolu.me is deeply committed to safeguarding your personal information
        and ensuring your use of this app is secure and private.
      </Text>
      <Text tag="h2">Local-First Approach </Text>
      <Text tag="p">
        Our app operates on a local-first principle, meaning that your data is
        primarily stored on your device rather than on remote servers. This
        approach lets you control your data, ensuring your information remains
        private and accessible only to you. By design, this minimizes the risk
        of data breaches and unauthorized access from external sources.
      </Text>
      <Text tag="h2">End-to-End Encryption </Text>
      <Text tag="p">
        Evolu.me uses end-to-end encryption for all data transmitted between
        your device and our services. This means your data is encrypted before
        it leaves your device and can only be decrypted by the intended
        recipient. Even where your data must interact with our servers, we
        cannot access or view your information. This encryption ensures that
        your data remains confidential and secure from prying eyes.
      </Text>
      <Text tag="h2">No Cookies, No Tracking </Text>
      <Text tag="p">
        We are committed to a no-cookie policy. We do not use cookies or
        tracking technologies to monitor your activity on our app. Your usage
        patterns, behavior, and data stay private to you. We believe in
        providing a seamless experience without the need to track or analyze
        your actions.
      </Text>
    </PageWithTitle>
  );
}
