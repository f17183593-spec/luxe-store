import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

const projectId = process.env.SANITY_PROJECT_ID ?? "";
const dataset = process.env.SANITY_DATASET ?? "production";

export default defineConfig({
  projectId,
  dataset,
  title: "LUXE CMS",
  basePath: "/studio",
  plugins: [structureTool()],
  schema: {
    types: [],
  },
});
