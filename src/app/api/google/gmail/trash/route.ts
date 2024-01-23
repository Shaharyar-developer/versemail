import { GoogleClient } from "@/lib/google-helpers";
import { handleGmail } from "@/app/hooks/useGmail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const client = await GoogleClient();
  const { getTrash } = handleGmail(client);
  const trash = await getTrash();
  return NextResponse.json(trash);
}
