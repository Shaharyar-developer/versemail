"use client";
import { DraftMessage } from "@/lib/types";
import { useEffect, useState } from "react";
export const Drafts = () => {
  const [drafts, setDrafts] = useState<DraftMessage[]>([]);
  const getDrafts = async () => {
    const res = await fetch("/api/google/gmail/drafts");
    const data = (await res.json()) as DraftMessage[];
    setDrafts(data);
    console.log(data);
  };
  useEffect(() => {
    getDrafts();
  }, []);
  return <></>;
};
