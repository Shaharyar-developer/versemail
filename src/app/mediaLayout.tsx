"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { Suspense } from "react";
import { useQueryState } from "nuqs";
import { Skeleton } from "@/components/ui/skeleton";
import { MobileSidebar, Sidebar } from "@/components/sections/sidebar";
import Inbox from "@/components/sections/inbox";
import { Drafts } from "@/components/sections/drafts";
import { Mail } from "@/components/sections/mail";
import { Sent } from "@/components/sections/sent";
import { Trash } from "@/components/sections/trash";
import { NewMessage } from "@/components/sections/newMessage";

export default function Media({ email }: { email: string }) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [box] = useQueryState("box");
  const [selectionId] = useQueryState("selectionId");
  if (!isMobile)
    return (
      <main className=" min-h-[90svh]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20}>
            <Suspense fallback={<Skeleton />}>
              <Sidebar email={email || "Unknown"} />
            </Suspense>
          </ResizablePanel>
          <ResizableHandle className="" />
          <ResizablePanel defaultSize={34} defaultChecked>
            {box === "inbox" && <Inbox />}
            {box === "drafts" && <Drafts />}
            {box === "sent" && <Sent />}
            {box === "trash" && <Trash />}
          </ResizablePanel>
          <ResizableHandle className="" />
          <ResizablePanel defaultSize={46} defaultChecked>
            <Suspense fallback={<Skeleton />}>
              {selectionId === "new" ? <NewMessage /> : <Mail />}
            </Suspense>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    );
  else {
    return (
      <main className=" min-h-[90svh]">
        <Suspense fallback={<Skeleton />}>
          <MobileSidebar email={email || "Unknown"} />
        </Suspense>
        <Inbox />
        <Suspense fallback={<Skeleton />}>
          <Mail />
        </Suspense>
      </main>
    );
  }
}
