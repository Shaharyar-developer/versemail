"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useQueryState } from "nuqs";
import { GmailMessage, CombinedMails } from "@/lib/types";
import { useCachedEmails } from "@/app/hooks/useCache";
import { InboxCard } from "../inbox-card";
import { Input } from "../ui/input";
import { useScroll } from "framer-motion";

export const InboxClient = () => {
  const [mode, setMode] = useState<"all" | "unread">("all");
  const [box] = useQueryState("box");
  const [query, setQuery] = useQueryState("query");
  const [messagesState, setMessagesState] = useState<GmailMessage[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });
  const { getEmails, setEmails, getPageId, setPageId } = useCachedEmails();
  const length = useRef(0);
  const pageId = useRef<string | undefined>();
  const loading = useRef(false);
  const nextPage = useRef(false);

  // const setCachedMailsState = async () => {
  //   const pageID = await getPageId();
  //   pageId.current = pageID?.toString();
  //   const cachedMails = await getEmails();
  //   if (!cachedMails) {
  //     fetchMessages();
  //   } else {
  //     setMessagesState(cachedMails || []);
  //     length.current = cachedMails?.length;
  //   }
  // };
  useEffect(() => {
    fetchMessages();
  }, []);

  scrollYProgress.on("change", () => {
    if (scrollYProgress.get() > 0.45) {
      fetchMessages();
    }
  });

  // Helper function to handle response
  const handleResponse = async (res: Response) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = (await res.json()) as CombinedMails;
    if (nextPage.current) {
      pageId.current = data?.nextPageId!;
    }
    length.current = data?.emails?.length! + length.current;
    if (data?.emails?.length) {
      setMessagesState((prevMessages) => {
        setEmails([...prevMessages, ...data.emails]);

        return [...prevMessages, ...data.emails];
      });
    }
  };

  const fetchMessages = async () => {
    if (loading.current) return;
    loading.current = true;
    length.current === 100 && (length.current = 0);
    if (length.current === 90) {
      nextPage.current = true;
    } else {
      nextPage.current = false;
    }
    try {
      const res = await fetch("/api/google/mails", {
        method: "POST",
        body: JSON.stringify({
          continueIndex: length.current,
          nextPageId: pageId.current,
        }),
      });

      await handleResponse(res);
    } catch (error) {
      // Handle error
    } finally {
      loading.current = false;
    }
  };

  const handleRead = async (id: string) => {
    try {
      await markMessageAsRead(id);
      updateMessageInState(id, removeUnreadLabel);
    } catch (error) {}
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id);
      removeMessageFromState(id);
    } catch (error) {}
  };

  const markMessageAsRead = async (id: string) => {
    return fetch("/api/google/gmail", {
      method: "PUT",
      body: JSON.stringify(id),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const deleteMessage = async (id: string) => {
    return fetch("/api/google/gmail", {
      method: "DELETE",
      body: JSON.stringify(id),
    });
  };

  const updateMessageInState = (
    id: string,
    updateFunction: (message: GmailMessage) => GmailMessage
  ) => {
    setMessagesState((prev) =>
      prev.map((message) =>
        message.id === id ? updateFunction(message) : message
      )
    );
  };

  const removeMessageFromState = (id: string) => {
    setMessagesState((prev) => prev.filter((message) => message.id !== id));
  };

  const removeUnreadLabel = (message: GmailMessage): GmailMessage => {
    return {
      ...message,
      labels: message.labels?.map((label) =>
        label?.id === "UNREAD" ? { ...label, id: "", name: "" } : label
      ),
    };
  };

  return (
    <>
      <div className="p-4 border-b lg:h-16 flex flex-col lg:flex-row justify-between items-center gap-2 lg:gap-0">
        <h1 className="text-2xl capitalize">{box}</h1>
        <div className="flex gap-4">
          <Input
            value={query || ""}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Emails..."
          />

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
      </div>
      <div ref={ref} className="max-h-[90svh] overflow-y-auto">
        {messagesState.length > 0 &&
          messagesState.map((message, idx) => (
            <div key={idx}>
              <InboxCard
                fetchMessages={fetchMessages}
                handleDelete={handleDelete}
                handleRead={handleRead}
                mode={mode}
                message={message}
              />
            </div>
          ))}
        <div />
      </div>
    </>
  );
};
