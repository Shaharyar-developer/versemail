"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Archive,
  Inbox,
  Megaphone,
  MessagesSquare,
  Package,
  Send,
  Settings,
  StickyNote,
  Trash2,
  Users,
} from "lucide-react";

import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";

import { useEffect } from "react";
import { useQueryState } from "nuqs";

import type { Box } from "@/lib/types";

export const Sidebar = ({ email }: { email: string }) => {
  const [box, setBox] = useQueryState<Box>("box", {
    defaultValue: "inbox",
    parse: (value: string) => value as Box,
  });
  useEffect(() => {
    setBox("inbox");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isMobile = useMediaQuery("(max-width: 640px)");
  return (
    <section className="flex flex-col min-h-[100svh] ">
      <div className="p-4 border-b h-16 flex  flex-row justify-between">
        <Select defaultValue={email}>
          <SelectTrigger className="max-w-max xl:w-[300px] xl:max-w-md ">
            <SelectValue placeholder="Email" className="capitalize p-2" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={email}>{email}</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex justify-end">
          <ModeToggle className="" />
        </div>
      </div>
      <div className="flex-grow grid grid-rows-2">
        <div className="p-2 flex flex-col gap-4 border-b">
          <Button
            active={box === "inbox"}
            onClick={() => setBox("inbox")}
            className="w-full gap-3 justify-start "
            variant={"ghost"}
          >
            <Inbox strokeWidth={1.4} /> {!isMobile && "Inbox"}
          </Button>
          <Button
            active={box === "drafts"}
            onClick={() => setBox("drafts")}
            className="w-full gap-3 justify-start "
            variant={"ghost"}
          >
            <StickyNote strokeWidth={1.4} /> {!isMobile && "Drafts"}
          </Button>
          <Button
            active={box === "sent"}
            onClick={() => setBox("sent")}
            className="w-full gap-3 justify-start "
            variant={"ghost"}
          >
            <Send strokeWidth={1.4} /> {!isMobile && "Sent"}
          </Button>

          <Button
            active={box === "trash"}
            onClick={() => setBox("trash")}
            className="w-full gap-3 justify-start "
            variant={"ghost"}
          >
            <Trash2 strokeWidth={1.4} /> {!isMobile && "Trash"}
          </Button>
          <Button
            active={box === "archive"}
            onClick={() => setBox("archive")}
            className="w-full gap-3 justify-start "
            variant={"ghost"}
          >
            <Archive strokeWidth={1.4} /> {!isMobile && "Archive"}
          </Button>
        </div>
        <div className="p-2 flex flex-col gap-4">
          <Button className="w-full gap-3 justify-start " variant={"ghost"}>
            <Users strokeWidth={1.4} /> {!isMobile && "Social"}
          </Button>
          <Button className="w-full gap-3 justify-start " variant={"ghost"}>
            <AlertCircle strokeWidth={1.4} /> {!isMobile && "Updates"}
          </Button>
          <Button className="w-full gap-3 justify-start " variant={"ghost"}>
            <MessagesSquare strokeWidth={1.4} /> {!isMobile && "Forums"}
          </Button>
          <Button className="w-full gap-3 justify-start " variant={"ghost"}>
            <Package strokeWidth={1.4} /> {!isMobile && "Shipping"}
          </Button>
          <Button className="w-full gap-3 justify-start " variant={"ghost"}>
            <Megaphone strokeWidth={1.4} /> {!isMobile && "Promotions"}
          </Button>
        </div>
      </div>
      <div className="border-t p-2 flex flex-col gap-4">
        <Button className="w-full gap-3 justify-start" variant={"ghost"}>
          <Settings /> Settings
        </Button>
      </div>
    </section>
  );
};
