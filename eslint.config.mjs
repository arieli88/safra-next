import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [".next/**", ".next-old/**", ".vercel/output/**", "node_modules/**", "public/nagishli/**", "nagishli_v3.0_beta_rev170120200211/**", "nagishli_v3.0_beta_rev170120200211-OLD/**"],
  },
  ...nextVitals,
  ...nextTypescript,
];

export default config;
