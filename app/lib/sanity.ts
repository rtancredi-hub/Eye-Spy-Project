import { cache } from "react";
import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import { Image } from "sanity";

// ─── CLIENT ───────────────────────────────────────────────────────────────────
// This is the connection between Next.js and Sanity.
// Every fetch call to Sanity uses this client.
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
  // Pages are cached by Next.js and refreshed by the /api/revalidate webhook,
  // so reads must bypass Sanity's CDN — otherwise a revalidation that runs
  // right after publish can re-cache the stale CDN response.
  token: process.env.SANITY_API_TOKEN,
});

// ─── IMAGE BUILDER ────────────────────────────────────────────────────────────
// Sanity stores images in its own cloud storage.
// This builder generates optimized image URLs from Sanity image references.
// Usage: urlFor(image).width(800).url()
const builder = createImageUrlBuilder(client);

export function urlFor(source: Image) {
  return builder.image(source);
}

// ─── REQUEST-SCOPED DEDUPE ────────────────────────────────────────────────────
// Most pages fetch the same document twice per request — once in
// generateMetadata(), once in the page component. React's cache() gives each
// request its own Map here, keyed by query+params, so the second call reuses
// the first call's in-flight promise instead of round-tripping to Sanity again.
const getRequestCache = cache(() => new Map<string, Promise<unknown>>());

// ─── FETCH HELPER ─────────────────────────────────────────────────────────────
// A typed wrapper around client.fetch() so every query is consistent.
// T is a TypeScript generic — it types the return value of each query.
// Usage: await sanityFetch<BlogPost[]>(query)
export function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const store = getRequestCache();
  const key = query + JSON.stringify(params);

  let result = store.get(key) as Promise<T> | undefined;
  if (!result) {
    result = client.fetch<T>(query, params);
    store.set(key, result);
  }
  return result;
}
