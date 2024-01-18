import { redirect } from "next/navigation";
import DevButton from "./dev-button";
import { cookies } from "next/headers";
export default function Page() {
  const creds = cookies().get("googleTokens");
  if (!creds) {
    return <DevButton />;
  } else redirect("/");
}
