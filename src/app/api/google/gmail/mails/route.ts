import { GoogleClient } from "@/lib/google-helpers";
import { handleGmail } from "@/app/hooks/useGmail";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const client = await GoogleClient();
  const { getMails } = handleGmail(client);
  const body = await req.json();
  let { continueIndex, nextPageId } = body;

  const emails = await getMails(continueIndex, nextPageId);

  return NextResponse.json(emails);
}
