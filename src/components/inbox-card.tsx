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
export const InboxCard = ({
  message,
  mode,
  handleRead,
}: {
  message: GmailMessage;
  mode: "all" | "unread";
  handleRead: (id: string) => Promise<void>;
}) => {
  const [box] = useQueryState("box");
  const [category] = useQueryState("category");
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
  const labels = message.labels?.map((label) => label?.name?.toLowerCase());
  const categories = message.labels?.map((label) =>
    label?.name?.replace("CATEGORY_", "").toLowerCase()
  );
  console.log(categories);

  if (box ? labels?.includes(box) : true) {
    if (category ? categories?.includes(category) : true) {
      return (
        <Card
          onClick={() => (message.id ? handleRead(message.id) : null)}
          className="hover:bg-accent transition-all  my-2 mx-2 rounded-md "
        >
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
              __html: message && message.snippet!.substring(0, 150) + "...",
            }}
          />
          <CardFooter className="flex gap-2">
            {message.labels?.map((label) => {
              if (label?.name) {
                const formattedLabel = label.name.replace("CATEGORY_", "");
                return (
                  <Badge key={label && label.id} className="capitalize">
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