import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET() {
  const products = await client!.fetch(
    `*[_type == "product"]{ _id, title, "slug": slug.current, price, "image": images[0].asset->url, category }`,
  );
  return NextResponse.json(products, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
