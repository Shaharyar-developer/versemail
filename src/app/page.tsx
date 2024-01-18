import { GoogleClient } from "@/lib/google-helpers";
import { handleGmail } from "./hooks/useGmail";
import Media from "./mediaLayout";
export default async function Home() {
  const client = await GoogleClient();
  const { getUser } = await handleGmail(client);
  const user = await getUser();

  return (
    <>
      <Media email={user?.data?.emailAddress!} />
    </>
  );
}
