import { Function } from "effect";
import { Layout } from "../../components/Day";
import { NextPageWithLayout } from "../_app";

const Day: NextPageWithLayout = Function.constNull;

Day.getLayout = () => <Layout />;

export default Day;
