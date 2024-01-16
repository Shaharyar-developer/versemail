"use client";
import { useQueryState } from "nuqs";
export const Inbox = ({
  allMailLenght,
}: {
  allMailLenght: number | string | undefined | null;
}) => {
  const [box] = useQueryState("box");
  return (
    <>
      <section className="flex flex-col min-h-[100svh]">
        <div className="p-4 border-b h-16 flex justify-between items-center">
          <h1 className="text-2xl capitalize">{box} </h1>
          <span className="text-foreground/50 text-lg">
            {box === "inbox" ? allMailLenght : ""}
          </span>
        </div>
        <div></div>
      </section>
    </>
  );
};
