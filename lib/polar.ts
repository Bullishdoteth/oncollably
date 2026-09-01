import { Polar } from "@polar-sh/sdk";

const apiKey =
  process.env.POLAR_TEST_API_KEY ||
  process.env.POLAR_API_KEY ||
  "";

const isSandbox = Boolean(
  process.env.POLAR_TEST_API_KEY || process.env.POLAR_SERVER === "sandbox"
);

export const polar = new Polar({
  accessToken: apiKey,
  server: isSandbox ? "sandbox" : "production",
});

export const POLAR_PRODUCT_ID =
  process.env.POLAR_TEST_PRODUCT_ID ||
  process.env.POLAR_PRODUCT_ID ||
  "";

export const POLAR_WEBHOOK_SECRET =
  process.env.POLAR_TEST_WEBHOOK_SECRET ||
  process.env.POLAR_WEBHOOK_SECRET ||
  "";
