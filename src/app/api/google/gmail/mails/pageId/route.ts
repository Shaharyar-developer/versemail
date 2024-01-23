import { handleGmail } from "@/app/hooks/useGmail";
import { GoogleClient } from "@/lib/google-helpers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const client = await GoogleClient();
  const { getNextPageId } = await handleGmail(client);
  const body = await req.json();
  return NextResponse.json(await getNextPageId(body));
}
