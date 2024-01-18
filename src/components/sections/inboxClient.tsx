"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useQueryState } from "nuqs";
import { GmailMessage } from "@/lib/types";
import { InboxCard } from "../inbox-card";
import { Input } from "../ui/input";
export const InboxClient = () => {
  const [mode, setMode] = useState<"all" | "unread">("all");
  const [box] = useQueryState("box");
  const [query, setQuery] = useQueryState("query");
  const [_, setRefreshKey] = useState(0);
  const [messagesState, setMessagesState] = useState<GmailMessage[]>([]);
  useEffect(() => {
    fetch("/api/google/gmail", { method: "GET" })
      .then((response) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let data = "";

        return reader
          ?.read()
          .then(function processText({
            done,
            value,
          }): Promise<unknown> | undefined {
            if (done) {
              return;
            }

            data += decoder.decode(value, { stream: true });
            let eventEnd = data.indexOf("\n\n");
            while (eventEnd !== -1) {
              const eventText = data.slice(0, eventEnd);
              try {
                const event: GmailMessage[] = JSON.parse(eventText);
                setMessagesState((prev) => [...prev, ...event]);
              } catch (e) {}
              data = data.slice(eventEnd + 2);
              eventEnd = data.indexOf("\n\n");
            }

            return reader.read().then(processText);
          });
      })
      .catch(console.error);
  }, []);
  const handleRead = async (id: string) => {
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
    } catch (e: unknown) {}
  };
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/google/gmail", {
        method: "DELETE",
        body: JSON.stringify(id),
      });
      setRefreshKey((prev) => prev + 1);
      setMessagesState((prev) => prev.filter((message) => message.id !== id));
    } catch (e: unknown) {}
  };
  return (
    <>
      <div className="p-4 border-b h-16 flex justify-between items-center">
        <h1 className="text-2xl capitalize">{box}</h1>
        <div className="w-[60%]">
          <Input
            value={query || ""}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Emails..."
          />
        </div>
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
        {messagesState.length > 0 &&
          messagesState.map((message, idx) => (
            <div key={idx}>
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
