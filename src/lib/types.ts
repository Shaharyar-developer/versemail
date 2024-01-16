export type Credentials = {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
  expiry_date: number;
};
export type Box = "inbox" | "sent" | "drafts" | "trash" | "archive";
