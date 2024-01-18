import { GoogleClient } from "@/lib/google-helpers";
import { handleGmail } from "./hooks/useGmail";
import { EmailOverlay } from "@/components/email-overlay";
import Media from "./mediaLayout";
export default async function Home() {
  const client = await GoogleClient();
  const { getUser } = await handleGmail(client);
  const user = await getUser();

  return (
    <>
      <EmailOverlay />
      <Media email={user?.data?.emailAddress!} />
    </>
  );
}
