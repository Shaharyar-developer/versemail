"use client";
import { useQueryState } from "nuqs";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { GmailMessage } from "@/lib/types";
import { toast } from "sonner";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
interface ShadowDOMProps {
  main: (string | undefined)[] | undefined;
  styles: string;
  className?: string;
}
const ShadowDOM: React.FC<ShadowDOMProps> = ({ main, styles, className }) => {
  const shadowRootRef = useRef<HTMLDivElement>(null);

  const shadowDOM = useMemo(() => {
    if (typeof window === "undefined") return;
    const div = document.createElement("div");
    const shadowRoot = div.attachShadow({ mode: "open" });
    shadowRoot.innerHTML =
      `<style>${styles}</style>` +
      '<div class="root">' +
      (main?.join("") || "") +
      "</div>";
    return div;
  }, [main, styles]);

  useLayoutEffect(() => {
    if (shadowRootRef.current) {
      shadowRootRef.current.innerHTML = "";
      shadowDOM && shadowRootRef.current.appendChild(shadowDOM);
    }
  }, [shadowDOM]);

  return <div className={className} ref={shadowRootRef} />;
};
export const Mail = () => {
  const [open, setOpen] = useState(true);
  const [selectionId] = useQueryState("selectionId");
  const [mail, setMail] = useState<GmailMessage>();
  const isMobile = useMediaQuery("(max-width: 640px)");
  useEffect(() => {
    const getMail = async () => {
      const load = toast.info("Loading...");
      setMail(undefined);
      const res = await fetch("/api/google/gmail", {
        method: "POST",
        body: JSON.stringify(selectionId),
      });
      const data = (await res.json()) as GmailMessage;

      setMail(() => {
        return data;
      });
      console.log(data);
      toast.dismiss(load);
      setOpen(() => true);
    };

    getMail();
  }, [selectionId]);
  const from =
    mail?.payload?.headers
      ?.find((header) => header.name === "From")
      ?.value?.match(/(.*) <(.*)>/)
      ?.slice(1, 3) || [];
  let main: (string | undefined)[] | undefined;
  if (mail?.payload?.parts) {
    main = mail?.payload?.parts?.map((part) => {
      if (part.body?.data && part.mimeType === "text/html") {
        const decodedData = Buffer.from(part.body.data, "base64").toString(
          "utf-8"
        );
        return decodedData;
      }
    });
  }
  if (mail?.payload?.body?.data && mail?.payload?.mimeType === "text/html") {
    const decodedData = Buffer.from(
      mail?.payload?.body.data,
      "base64"
    ).toString("utf-8");
    main = [decodedData];
  }
  const styles = `
  * {
    color-scheme: dark;
  }
  .root {
    font-family: 'Inter', sans-serif !important;
  }
 
 
`;

  // ...
  if (!isMobile)
    return (
      <section className="flex flex-col" hidden={mail ? false : true}>
        <div className="p-4 border-b h-16 flex justify-between items-center">
          <h1 className="text-2xl">{from[0]}</h1>
          <h1 className="text-md text-foreground/50">{from[1]}</h1>
        </div>
        <ShadowDOM
          main={main}
          styles={styles}
          className="m-2 rounded bg-white max-h-[95svh] overflow-auto"
        />
      </section>
    );
  else {
    return (
      <>
        <Dialog open={open}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{from[0]}</DialogTitle>
            </DialogHeader>
            <ShadowDOM
              main={main}
              styles={styles}
              className="m-2 rounded bg-white max-h-[75svh] overflow-auto"
            />
            <DialogFooter>
              <Button
                className="w-full"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Cross2Icon />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }
};
