"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useQueryState } from "nuqs";
import { GmailMessage } from "@/lib/types";
import { InboxCard } from "../inbox-card";

export const InboxClient = ({ messages }: { messages: GmailMessage[] }) => {
  const [mode, setMode] = useState<"all" | "unread">("all");
  const [box] = useQueryState("box");
  const [_, setRefreshKey] = useState(0);
  const [messagesState, setMessagesState] = useState(messages);
  const handleRead = async (id: string) => {
    console.log(id);

    try {
      fetch("/api/google/gmail", {
        method: "PUT",
        body: JSON.stringify(id),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setMessagesState((prev) =>
        prev.map((message) => {
          if (message.id === id) {
            return {
              ...message,
              labels: message.labels?.map((label) => {
                if (label?.id === "UNREAD") {
                  return {
                    ...label,
                    id: "",
                    name: "",
                  };
                }
                return label;
              }),
            };
          }
          return message;
        })
      );

      setRefreshKey((prev) => prev + 1);
    } catch (e: unknown) {
      console.log(e);
    }
  };
  const handleDelete = async (id: string) => {
    console.log(id);

    try {
      const res = await fetch("/api/google/gmail", {
        method: "DELETE",
        body: JSON.stringify(id),
      });
      const data = await res.json();
      setRefreshKey((prev) => prev + 1);
      setMessagesState((prev) => prev.filter((message) => message.id !== id));
    } catch (e: unknown) {
      console.log(e);
    }
  };
  return (
    <>
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
        </Tabs>
      </div>
      <div className="max-h-[90svh] overflow-y-auto">
        {messagesState.map((message) => (
          <div key={message.id}>
            <InboxCard
              handleDelete={handleDelete}
              handleRead={handleRead}
              mode={mode}
              message={message}
            />
          </div>
        ))}
      </div>
    </>
  );
};
