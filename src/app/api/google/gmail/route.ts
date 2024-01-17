import { NextResponse, NextRequest } from "next/server";
import { handleGmail } from "@/app/hooks/useGmail";
import { GoogleClient } from "@/lib/google-helpers";
export async function PUT(req: Request) {
  const client = await GoogleClient();
  const { setRead } = await handleGmail(client);
  try {
    const body = await new Response(req.body).text();
    const id = JSON.parse(body);
    setRead(id);
  } catch (error) {
    return NextResponse.json({ error: "No id provided" });
  }
  return NextResponse.json({
    success: true,
  });
}
export async function DELETE(req: NextRequest) {
  return NextResponse.json({});
}
