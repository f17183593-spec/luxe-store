export const HOME_PAGE_QUERY = `{
  "hero": *[_type == "hero"][0] {
    title,
    subtitle,
    ctaLabel,
    ctaLink,
    "backgroundImage": backgroundImage.asset->url,
    "backgroundAlt": backgroundImage.alt
  },
  "featured": *[_type == "product" && featured == true] | order(createdAt desc) [0..7] {
    _id,
    "slug": slug.current,
    title,
    price,
    "image": images[0].asset->url,
    "imageAlt": images[0].alt,
    category,
    material
  }
}`;

export function buildProductsQuery(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}) {
  const conditions = ['_type == "product"'];
  if (filters?.category) {
    conditions.push(`category == "${filters.category}"`);
  }
  if (filters?.minPrice != null) {
    conditions.push(`price >= ${filters.minPrice}`);
  }
  if (filters?.maxPrice != null) {
    conditions.push(`price <= ${filters.maxPrice}`);
  }

  const orderMap: Record<string, string> = {
    "price-asc": "price asc",
    "price-desc": "price desc",
    newest: "createdAt desc",
  };
  const order = orderMap[filters?.sort ?? "newest"] ?? "createdAt desc";

  return `*[${conditions.join(" && ")}] | order(${order}) {
    _id,
    "slug": slug.current,
    title,
    price,
    "image": images[0].asset->url,
    category,
    material,
    tags
  }`;
}

export const PRODUCTS_QUERY = `*[_type == "product"] | order(createdAt desc) {
  _id,
  "slug": slug.current,
  title,
  price,
  "image": images[0].asset->url,
  category,
  material,
  tags
}`;

export const PRODUCT_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  title,
  description,
  price,
  "images": images[].asset->url,
  category,
  material,
  tags,
  featured
}`;

export const PRODUCT_SLUGS_QUERY = `*[_type == "product" && defined(slug.current)] {
  "slug": slug.current
}`;
