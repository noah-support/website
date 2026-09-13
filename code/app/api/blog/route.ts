import { getPosts } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1") || 1;
  const search = url.searchParams.get("search") ?? "";
  const tags = url.searchParams.get("tags") ?? "";
  const tagIds = tags
    .split(",")
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);

  const result = await getPosts({ page, search, tagIds });
  return Response.json(result);
}
