import { GaxiosResponse } from "gaxios";
import { gmail_v1 } from "googleapis";

export type Credentials = {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
  expiry_date: number;
};
export type Box = "inbox" | "sent" | "drafts" | "trash" | "archive";

export type GmailMessage = gmail_v1.Schema$Message & {
  labels?: (gmail_v1.Schema$Label | undefined)[] | undefined;
};
export type CombinedMails =
  | {
      emails: GmailMessage[];
      nextPageId: string | null | undefined;
      length: number | undefined;
    }
  | undefined;

export type DraftMessage = gmail_v1.Schema$Draft;