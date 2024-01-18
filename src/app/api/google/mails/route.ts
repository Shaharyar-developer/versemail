import { GoogleClient } from "@/lib/google-helpers";
import { handleGmail } from "@/app/hooks/useGmail";
export async function POST(req: Request) {
  const client = await GoogleClient();
  const { getAllEmails } = await handleGmail(client);
}
