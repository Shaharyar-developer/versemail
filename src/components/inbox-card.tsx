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

export const InboxCard = ({
  message,
  mode,
  handleRead,
}: {
  message: GmailMessage;
  mode: "all" | "unread";
  handleRead: (id: string) => Promise<void>;
}) => {
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

  return (
    <Card
      onClick={() => (message.id ? handleRead(message.id) : null)}
      className="hover:bg-accent transition-all  my-2 mx-2 rounded-md "
    >
      <CardHeader className="flex justify-between">
        <h1 className="text-2xl">{from || ""}</h1>
        <h2 className="">{date?.value && format(date?.value, "PPP")}</h2>
        <CardDescription>{subject?.value}</CardDescription>
      </CardHeader>
      <CardContent
        className="text-secondary-foreground"
        dangerouslySetInnerHTML={{ __html: message && message.snippet! }}
      />
      <CardFooter>
        {message.labels?.map((label) => {
          if (label?.name)
            return <Badge key={label && label.id}>{label?.name}</Badge>;
        })}
      </CardFooter>
    </Card>
  );
};