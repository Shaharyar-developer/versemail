import { google } from "googleapis";
import { redirect } from "next/navigation";
import { pageUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function GET(req: NextRequest, res: NextResponse) {
  const authClient = new google.auth.OAuth2({
    redirectUri: pageUrl + "/api/auth/google/",
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });
  const redirectUrl = authClient.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://mail.google.com/"],
  });
  const url = new URL(req.url);
  let code = url.searchParams.get("code");
  if (code) {
    try {
      const response = await authClient.getToken(code);
      const { tokens } = response;
      authClient.setCredentials(tokens);
      cookies().set("googleTokens", JSON.stringify(tokens), {
        maxAge: 60 * 60 * 24 * 2,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
    } catch (error) {}
  } else redirect(redirectUrl);
  return NextResponse.redirect(pageUrl);
}
