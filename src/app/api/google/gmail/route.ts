import { NextResponse, NextRequest } from "next/server";
import { handleGmail } from "@/app/hooks/useGmail";
import { GoogleClient } from "@/lib/google-helpers";
import { Readable } from "stream";
import { NextApiResponse } from "next";
import { GmailMessage } from "@/lib/types";
import EventSource from "eventsource";

export const dynamic = "force-dynamic";

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
  const client = await GoogleClient();
  const { deleteEmail } = await handleGmail(client);
  try {
    const body = await new Response(req.body).text();
    const id = JSON.parse(body);
    deleteEmail(id);
  } catch (error) {
    return NextResponse.json({ error: "No id provided" });
  }
  return NextResponse.json({
    success: true,
  });
}
export async function GET(req: Request, res: Response) {
  const client = await GoogleClient();
  const { getAllEmails } = await handleGmail(client);

  const generator = getAllEmails();
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const email of generator) {
        const chunk = encoder.encode(JSON.stringify(email) + "\n\n");
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
export async function POST(req: Request) {
  const client = await GoogleClient();
  const { getEmail } = await handleGmail(client);
  const body = await new Response(req.body).text();
  const id = JSON.parse(body);
  const email = await getEmail(id);
  return NextResponse.json(email.data);
}