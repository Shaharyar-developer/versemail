import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export const pageUrl =
  process.env.NODE_ENV === "production"
    ? "https://versemail.vercel.app"
    : "http://localhost:3000";
