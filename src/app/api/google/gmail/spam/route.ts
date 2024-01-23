import { GoogleClient } from "@/lib/google-helpers";
import { handleGmail } from "@/app/hooks/useGmail";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await GoogleClient();
  const { getSpam } = handleGmail(client);
  const spam = await getSpam();
  return NextResponse.json(spam);
}
