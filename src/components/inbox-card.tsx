import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import type { GmailMessage } from "@/lib/types";
import { format } from "date-fns";
import { useGmail } from "@/app/hooks/useGmail";
export const InboxCard = async ({
  message,
  mode,
}: {
  message: GmailMessage;
  mode: "all" | "unread";
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
  if (mode === "unread" && message.labelIds?.includes("UNREAD")) {
    return (
      <Card className="hover:bg-accent transition-all  my-2 mx-2 rounded-md ">
        <CardHeader className="flex justify-between">
          <h1 className="text-2xl">{from || ""}</h1>
          <h2 className="">{date?.value && format(date?.value, "PPP")}</h2>
          <CardDescription>{subject?.value}</CardDescription>
        </CardHeader>
        <CardContent className="text-secondary-foreground">
          {message.snippet}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    );
  } else if (mode === "all") {
    return (
      <Card className="hover:bg-accent transition-all  my-2 mx-2 rounded-md ">
        <CardHeader className="flex justify-between">
          <h1 className="text-2xl">{from || ""}</h1>
          <h2 className="">{date?.value && format(date?.value, "PPP")}</h2>
          <CardDescription>{subject?.value}</CardDescription>
        </CardHeader>
        <CardContent className="text-secondary-foreground">
          {message.snippet}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    );
  }
};
