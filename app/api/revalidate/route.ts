import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.SANITY_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { message: "Server misconfiguration" },
      { status: 500 },
    );
  }

  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Revalidate every route under the root layout. Site settings feed the
  // shared layout and most docs appear on several pages (services, blog
  // slugs, landing pages, sitemap), so per-path revalidation misses pages.
  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, timestamp: Date.now() });
}
