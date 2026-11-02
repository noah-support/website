import { notFound, redirect } from "next/navigation";
import { tshirtsDestination } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const destination = await tshirtsDestination();
  if (!destination) notFound();
  const search = new URL(request.url).search;
  redirect(`${destination}${search}`);
}
