import { Function } from "effect";
import { Layout } from "../components/Day";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = Function.constNull;

Home.getLayout = () => <Layout />;

export default Home;
