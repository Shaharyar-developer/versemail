"use client";
import { useQueryState } from "nuqs";
import React, { useEffect, useRef, useState } from "react";
import type { GmailMessage } from "@/lib/types";
import { toast } from "sonner";
export const Mail = () => {
  const [selectionId] = useQueryState("selectionId");
  const [mail, setMail] = useState<GmailMessage>();
  useEffect(() => {
    const getMail = async () => {
      const load = toast("Loading...");
      const res = await fetch("/api/google/gmail", {
        method: "POST",
        body: JSON.stringify(selectionId),
      });
      const data = (await res.json()) as GmailMessage;
      setMail(data);
      toast.dismiss(load);
    };
    getMail();
  }, [selectionId]);
  const from =
    mail?.payload?.headers
      ?.find((header) => header.name === "From")
      ?.value?.match(/(.*) <(.*)>/)
      ?.slice(1, 3) || [];
  const shadowRootRef = useRef<HTMLDivElement>(null);
  const main = mail?.payload?.parts?.map((part) => {
    if (part.body?.data && part.mimeType === "text/html") {
      const decodedData = Buffer.from(part.body.data, "base64").toString(
        "utf-8"
      );
      return decodedData;
    }
  });
  const styles = `
  .root {
    font-family: 'Inter', sans-serif;
  }
  
`;
  useEffect(() => {
    if (shadowRootRef.current) {
      let shadowRoot = shadowRootRef.current.shadowRoot;
      if (!shadowRoot) {
        shadowRoot = shadowRootRef.current.attachShadow({ mode: "open" });
      }
      shadowRoot.innerHTML =
        `<style>${styles}</style>` +
        '<div class="root">' +
        (main?.join("") || "") +
        "</div>";
    }
  }, [main]);
  return (
    <section className="flex flex-col">
      <div className="p-4 border-b h-16 flex justify-between items-center">
        <h1 className="text-2xl">{from[0]}</h1>
        <h1 className="text-md text-foreground/50">{from[1]}</h1>
      </div>
      <div
        className="m-2 rounded border bg-white max-h-[95svh] overflow-scroll"
        ref={shadowRootRef}
      ></div>
    </section>
  );
};
