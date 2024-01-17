import { GmailMessage } from "@/lib/types";
import { InboxClient } from "./inboxClient";
import { GoogleClient } from "@/lib/google-helpers";
export const Inbox = async ({ messages }: { messages: GmailMessage[] }) => {
  return (
    <>
      <section className="flex flex-col min-h-[100svh]">
        <InboxClient messages={messages} />
      </section>
    </>
  );
};
