import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import type { GmailMessage } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
export const InboxCard = ({
  message,
  mode,
  handleRead,
}: {
  message: GmailMessage;
  mode: "all" | "unread";
  handleRead: (id: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}) => {
  const [read, setRead] = useState(true);
  const [box] = useQueryState("box");
  const [category] = useQueryState("category");
  const [_, setSelectionId] = useQueryState("selectionId");

  const labels = message.labels?.map((label) => label?.name?.toLowerCase());
  useEffect(() => {
    if (labels?.includes("unread")) {
      setRead(false);
    } else {
      setRead(true);
    }
  }, [labels]);
  const from =
    message?.payload?.headers
      ?.find((header) => header.name === "From")
      ?.value?.replace(/<[^>]+>/g, "") ?? "";
  const date = message?.payload?.headers?.find(
    (header) => header.name === "Date"
  );
  const subject = message?.payload?.headers?.find(
    (header) => header.name === "Subject"
  );

  if (mode === "unread" && !message.labelIds?.includes("UNREAD")) {
    return null;
  }

  const categories = message.labels?.map((label) =>
    label?.name?.replace("CATEGORY_", "").toLowerCase()
  );

  if (box ? labels?.includes(box) : true) {
    if (category ? categories?.includes(category) : true) {
      return (
        <Card
          onClick={() => {
            message.id && handleRead(message.id);
            message.id && setSelectionId(message.id);
          }}
          className="hover:bg-accent relative transition-all  my-2 mx-2 rounded-md "
        >
          {!read && (
            <div className="flex justify-end absolute right-0 top-0">
              <span className="h-[0.3rem] w-[0.3rem] bg-blue-400 m-4 rounded-full" />
            </div>
          )}
          <CardHeader className=" justify-between">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">{from || ""}</h1>
              <h2 className="font-normal">
                {date?.value && format(date?.value, "PPP")}
              </h2>
            </div>
            <CardDescription>{subject?.value}</CardDescription>
          </CardHeader>
          <CardContent
            className="text-secondary-foreground"
            dangerouslySetInnerHTML={{
              __html:
                message && message?.snippet?.length! >= 150
                  ? message.snippet! + "..."
                  : message.snippet!,
            }}
          />
          <CardFooter className="flex gap-2">
            {message.labels?.map((label, idx) => {
              if (label?.name !== "INBOX")
                if (label?.name && label?.name !== "UNREAD") {
                  const formattedLabel = label.name.replace("CATEGORY_", "");
                  return (
                    <Badge key={idx} className="capitalize">
                      {formattedLabel.toLowerCase()}
                    </Badge>
                  );
                }
            })}
          </CardFooter>
        </Card>
      );
    }
  }
};