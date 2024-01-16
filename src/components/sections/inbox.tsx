"use client";
import { GmailMessage } from "@/lib/types";
import { useQueryState } from "nuqs";
import { InboxCard } from "../inbox-card";
export const Inbox = ({ messages }: { messages: GmailMessage[] }) => {
  const [box] = useQueryState("box");

  return (
    <>
      <section className="flex flex-col min-h-[100svh]">
        <div className="p-4 border-b h-16 flex justify-between items-center">
          <h1 className="text-2xl capitalize">{box} </h1>
        </div>
        <div className="max-h-[90svh] overflow-y-auto">
          {messages.map((item) => (
            <div key={item.id}>
              <InboxCard message={item} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
