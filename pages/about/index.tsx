import { Link } from "../../components/Link";
import { PageWithTitle } from "../../components/PageWithTitle";
import { Text } from "../../components/Text";

export default function About() {
  return (
    <PageWithTitle title="About">
      <Text tag="p">
        I want all my apps to be open-sourced and local-first, so I started with
        a calendar and notes. I often use a calendar for notes and notes as a
        calendar, so I suppose it should be just one app.
      </Text>
      <Text tag="p">
        Apps are just artificial and arbitrary boundaries within data.
      </Text>
      <Text tag="p">
        I often switch between desktop and mobile, so my apps must support
        multiple input modes (touch, mouse, keyboard). I don&apos;t have a
        preferred device screen, so my apps must have a fluid UI.
      </Text>
      <Link href="https://github.com/evoluhq/evolu.me">
        github.com/evoluhq/evolu.me
      </Link>
      {/* <Text tag="p">TODO: Explain how this app is secure, etc.</Text> */}
    </PageWithTitle>
  );
}
