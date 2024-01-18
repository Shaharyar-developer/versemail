"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MobileSidebar, Sidebar } from "@/components/sections/sidebar";
import Inbox from "@/components/sections/inbox";
import { Mail } from "@/components/sections/mail";

export default function Media({ email }: { email: string }) {
  const isMobile = useMediaQuery("(max-width: 640px)");
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
            <Inbox />
          </ResizablePanel>
          <ResizableHandle className="" />
          <ResizablePanel defaultSize={46} defaultChecked>
            <Suspense fallback={<Skeleton />}>
              <Mail />
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
