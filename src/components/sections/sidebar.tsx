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
  MenuIcon,
  MessagesSquare,
  Package,
  Send,
  Settings,
  StickyNote,
  Trash2,
  Users,
} from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";

import { useEffect, useRef, useState } from "react";
import { useQueryState } from "nuqs";

import type { Box } from "@/lib/types";
type categories =
  | "shipping"
  | "social"
  | "promotions"
  | "updates"
  | "forums"
  | undefined;
export const MobileSidebar = ({ email }: { email: string }) => {
  const [box, setBox] = useQueryState<Box>("box", {
    parse: (value: string) => value as Box,
  });
  const [category, setCategory] = useQueryState<categories>("category", {
    parse: (value: string) => value as categories,
  });
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBox("inbox");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (ref.current) {
        setIsMobile(ref.current.offsetWidth <= 200);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Sheet>
      <SheetTrigger className="fixed" asChild>
        <Button variant={"ghost"}>
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        ref={ref}
        className="flex flex-col min-h-[100svh]"
      >
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
            <Button
              active={category === "social"}
              onClick={() => setCategory("social")}
              className="w-full gap-3 justify-start "
              variant={"ghost"}
            >
              <Users strokeWidth={1.4} /> {!isMobile && "Social"}
            </Button>
            <Button
              active={category === "updates"}
              onClick={() => setCategory("updates")}
              className="w-full gap-3 justify-start "
              variant={"ghost"}
            >
              <AlertCircle strokeWidth={1.4} /> {!isMobile && "Updates"}
            </Button>
            <Button
              active={category === "forums"}
              onClick={() => setCategory("forums")}
              className="w-full gap-3 justify-start "
              variant={"ghost"}
            >
              <MessagesSquare strokeWidth={1.4} /> {!isMobile && "Forums"}
            </Button>
            <Button
              active={category === "shipping"}
              onClick={() => setCategory("shipping")}
              className="w-full gap-3 justify-start "
              variant={"ghost"}
            >
              <Package strokeWidth={1.4} /> {!isMobile && "Shipping"}
            </Button>
            <Button
              active={category === "promotions"}
              onClick={() => setCategory("promotions")}
              className="w-full gap-3 justify-start "
              variant={"ghost"}
            >
              <Megaphone strokeWidth={1.4} /> {!isMobile && "Promotions"}
            </Button>
            <div
              className={`flex-grow justify-end flex-col transition-all flex ${
                category ? " opacity-100" : "opacity-0"
              }`}
            >
              <Button onClick={() => setCategory(null)} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
        {/* <div className="border-t p-2 flex flex-col gap-4">
        <Button className="w-full gap-3 justify-start" variant={"ghost"}>
          <Settings /> Settings
        </Button>
      </div> */}
      </SheetContent>
    </Sheet>
  );
};
export const Sidebar = ({ email }: { email: string }) => {
  const [box, setBox] = useQueryState<Box>("box", {
    parse: (value: string) => value as Box,
  });
  const [category, setCategory] = useQueryState<categories>("category", {
    parse: (value: string) => value as categories,
  });
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBox("inbox");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (ref.current) {
        setIsMobile(ref.current.offsetWidth <= 200);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={ref} className="flex flex-col min-h-[100svh] ">
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
          <Button
            active={category === "social"}
            onClick={() => setCategory("social")}
            className="w-full gap-3 justify-start "
            variant={"ghost"}
          >
            <Users strokeWidth={1.4} /> {!isMobile && "Social"}
          </Button>
          <Button
            active={category === "updates"}
            onClick={() => setCategory("updates")}
            className="w-full gap-3 justify-start "
            variant={"ghost"}
          >
            <AlertCircle strokeWidth={1.4} /> {!isMobile && "Updates"}
          </Button>
          <Button
            active={category === "forums"}
            onClick={() => setCategory("forums")}
            className="w-full gap-3 justify-start "
            variant={"ghost"}
          >
            <MessagesSquare strokeWidth={1.4} /> {!isMobile && "Forums"}
          </Button>
          <Button
            active={category === "shipping"}
            onClick={() => setCategory("shipping")}
            className="w-full gap-3 justify-start "
            variant={"ghost"}
          >
            <Package strokeWidth={1.4} /> {!isMobile && "Shipping"}
          </Button>
          <Button
            active={category === "promotions"}
            onClick={() => setCategory("promotions")}
            className="w-full gap-3 justify-start "
            variant={"ghost"}
          >
            <Megaphone strokeWidth={1.4} /> {!isMobile && "Promotions"}
          </Button>
          <div
            className={`flex-grow justify-end flex-col transition-all flex ${
              category ? " opacity-100" : "opacity-0"
            }`}
          >
            <Button onClick={() => setCategory(null)} className="w-full">
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
      {/* <div className="border-t p-2 flex flex-col gap-4">
        <Button className="w-full gap-3 justify-start" variant={"ghost"}>
          <Settings /> Settings
        </Button>
      </div> */}
    </section>
  );
};