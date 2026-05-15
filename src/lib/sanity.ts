import "server-only";
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? "production";

export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2026-05-15",
      useCdn: true,
      perspective: "published",
      stega: { enabled: false },
    })
  : null;

let builder: ReturnType<typeof imageUrlBuilder> | null = null;
if (client) {
  builder = imageUrlBuilder(client);
}

export function urlFor(source: unknown): string {
  if (!builder) return "";
  try {
    return builder.image(source).auto("format").quality(90).url() ?? "";
  } catch {
    return "";
  }
}

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: { next?: { revalidate?: number } } = {},
): Promise<T | null> {
  if (!client) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Sanity not configured — returning null");
    }
    return null;
  }

  try {
    return await client.fetch<T>(query, params, options);
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return null;
  }
}
