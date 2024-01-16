"use client";
import { GmailMessage } from "@/lib/types";
import { useQueryState } from "nuqs";
import { InboxCard } from "../inbox-card";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Inbox = ({ messages }: { messages: GmailMessage[] }) => {
  const [mode, setMode] = useState<"all" | "unread">("all");
  const [box] = useQueryState("box");

  return (
    <>
      <section className="flex flex-col min-h-[100svh]">
        <div className="p-4 border-b h-16 flex justify-between items-center">
          <h1 className="text-2xl capitalize">{box}</h1>
          <Tabs defaultValue="all" className="">
            <TabsList>
              <TabsTrigger onClick={() => setMode("all")} value="all">
                All
              </TabsTrigger>
              <TabsTrigger onClick={() => setMode("unread")} value="unread">
                Unread
              </TabsTrigger>
            </TabsList>
          </Tabs>{" "}
        </div>
        <div className="max-h-[90svh] overflow-y-auto">
          {messages.map((item) => (
            <div key={item.id}>
              <InboxCard mode={mode} message={item} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
