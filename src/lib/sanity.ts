import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-16",
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlForSource(source: any) {
  if (!builder || !source) return "";
  try {
    return builder.image(source).auto("format").quality(90).url() ?? "";
  } catch {
    return "";
  }
}

export async function sanityFetch<T = any>(query: string, params: Record<string, any> = {}) {
  return client.fetch<T>(query, params, {
    next: { revalidate: 60 },
  });
}
