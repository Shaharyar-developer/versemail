import { cookies } from "next/headers";
import { Credentials } from "./types";
import { google } from "googleapis";
import { redirect } from "next/navigation";
import { pageUrl } from "./utils";
export async function GoogleClient() {
  const access_tokens = cookies().get("googleTokens");
  if (!access_tokens) {
    redirect(pageUrl + "/api/auth/google");
  }
  const credentials = JSON.parse(access_tokens?.value!) as Credentials;
  const expiry = credentials.expiry_date;
  const now = new Date().getTime();
  const diff = expiry - now;

  const authClient = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  });

  authClient.setCredentials(credentials);

  if (diff < 0) {
    await authClient.refreshAccessToken();
  }
  return authClient;
}
