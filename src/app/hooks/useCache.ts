"use client";
import { openDB } from "idb";
import type { GmailMessage } from "@/lib/types";

export const useCachedEmails = () => {
  const setEmails = async (mails: GmailMessage[]) => {
    if (typeof window === "undefined") return;
    let updatedEmails: GmailMessage[] = [];
    if (Array.isArray(mails)) {
      updatedEmails = [...mails];
    } else {
      updatedEmails = [mails];
    }
    const storedEmails = await getEmails();
    if (!storedEmails) {
      const db = await openDB("versemail", 2, {
        upgrade(db) {
          db.createObjectStore("emails");
        },
      });
      await db.put("emails", updatedEmails, "emails");
      return;
    }

    // Create new objects with date property
    updatedEmails = updatedEmails.map((mail) => {
      let date: Date | undefined;
      mail.payload?.headers?.forEach((header) => {
        if (header.name === "Date") {
          date = new Date(header.value!);
        }
      });
      return { ...mail, date };
    });

    // Create a set of the IDs of the stored emails
    const storedEmailIds = new Set(
      storedEmails.map((mail: GmailMessage) => mail.id)
    );

    // Filter the new emails to only include those not already stored
    const newEmails = updatedEmails.filter(
      (mail) => !storedEmailIds.has(mail.id)
    );

    // If there are no new emails, return without updating IndexedDB
    if (newEmails.length === 0) return;

    // Merge, sort, and trim emails
    const mergedEmails = [...storedEmails, ...newEmails];
    mergedEmails.sort(
      (a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)
    );
    if (mergedEmails.length > 20) {
      mergedEmails.length = 20;
    }

    // Update IndexedDB
    const db = await openDB("versemail", 2);
    await db.put("emails", mergedEmails, "emails");
  };

  const getEmails = async () => {
    if (typeof window === "undefined") return;
    try {
      const db = await openDB("versemail", 2, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("emails")) {
            db.createObjectStore("emails");
          }
        },
      });
      const emails = await db.get("emails", "emails");
      return (emails as GmailMessage[]) || [];
    } catch (error) {
      console.error("Error retrieving emails from IndexedDB:", error);
      return [];
    }
  };

  const setPageId = async (pageId: string) => {
    try {
      localStorage.setItem("pageId", pageId);
    } catch (error) {
      console.error("Error setting page ID in localStorage:", error);
    }
  };
  const getPageId = async () => {
    try {
      const pageId = localStorage.getItem("pageId");
      return pageId;
    } catch (error) {
      console.error("Error retrieving page ID from localStorage:", error);
      return undefined;
    }
  };
  return { setEmails, getEmails, setPageId, getPageId };
};
