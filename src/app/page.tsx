import { useGmail } from "./hooks/useGmail";
import { GoogleClient } from "@/lib/google-helpers";
import { Sidebar } from "@/components/sections/sidebar";
import { Inbox } from "@/components/sections/inbox";
import { Mail } from "@/components/sections/mail";
import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
export default async function Home() {
  const client = await GoogleClient();
  const { res, getRecentEmails, getUser, getAllEmailsLenght } = await useGmail(
    client
  );
  const user = await getUser();

  return (
    <main className=" min-h-[90svh]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20}>
          <Suspense fallback={<Skeleton />}>
            <Sidebar email={user.data.emailAddress || "Unknown"} />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle className="" />
        <ResizablePanel defaultSize={34} defaultChecked>
          <Suspense fallback={<Skeleton />}>
            <Inbox allMailLenght={await getAllEmailsLenght()} />
          </Suspense>
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
}
