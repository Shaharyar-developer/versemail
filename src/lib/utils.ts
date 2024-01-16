import { type ClassValue, clsx } from "clsx";
import { cookies } from "next/headers";
import { twMerge } from "tailwind-merge";
import { Credentials } from "./types";
import { google } from "googleapis";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const pageUrl =
  process.env.NODE_ENV === "production"
    ? "https://www.versemail.vercel.app"
    : "http://localhost:3000";
