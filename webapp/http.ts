import path from "path";
import { config } from "dotenv";

const envPath = path.resolve(__dirname, "../.env");
config({ path: envPath });

export const WEBAPP_URL =
  process.env.NEXT_PUBLIC_NODE_ENV === "development"
    ? `http://${process.env.NEXT_PUBLIC_WEBAPP_API_URL}:${process.env.NEXT_PUBLIC_WEBAPP_PORT}`
    : `https://${process.env.NEXT_PUBLIC_WEBAPP_API_URL}`;
