import { NextResponse, NextRequest } from "next/server";
import { handleGmail } from "@/app/hooks/useGmail";
import { GoogleClient } from "@/lib/google-helpers";

export async function GET() {
  const client = await GoogleClient();
  const { getDrafts } = await handleGmail(client);
  const drafts = await getDrafts();

  return NextResponse.json(drafts);
}
