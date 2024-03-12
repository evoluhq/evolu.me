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
      {/* <Text tag="h2">Links:</Text> */}
      <Link href="https://github.com/evoluhq/evolu.me/blob/main/CHANGELOG.md">
        Changelog
      </Link>
      <Link href="https://github.com/evoluhq/evolu.me/issues">Issues</Link>
      <Link href="https://github.com/evoluhq/evolu.me">GitHub repository</Link>
    </PageWithTitle>
  );
}
