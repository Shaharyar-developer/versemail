import { GmailMessage } from "@/lib/types";
import { google, Auth, gmail_v1 } from "googleapis";

function mapLabels(
  email: gmail_v1.Schema$Message,
  labels: gmail_v1.Schema$Label[]
): GmailMessage {
  const emailLabels = email.labelIds?.map((labelId) =>
    labels.find((label) => label.id === labelId)
  );
  return { ...email, labels: emailLabels } as GmailMessage;
}

async function getEmails(
  gmail: gmail_v1.Gmail,
  continueIndex?: number,
  nextPageId?: string
): Promise<gmail_v1.Schema$Message[]> {
  const list = await gmail.users.messages.list({
    userId: "me",
    pageToken: nextPageId ? nextPageId : undefined,
  });

  if (list.data.messages) {
    let emails = list.data.messages;
    if (continueIndex !== undefined) {
      emails = emails.slice(continueIndex);
    }

    const emailPromises = emails
      .slice(0, 10)
      .map((message) =>
        gmail.users.messages.get({ userId: "me", id: message.id! })
      );

    const emailsBatch = await Promise.all(emailPromises);
    return emailsBatch.map((email) => email.data);
  }
  return [];
}
export function handleGmail(client?: Auth.OAuth2Client) {
  const gmail = google.gmail({ version: "v1", auth: client });

  const getRecentEmails = async (amount: number) => {
    const emails = await getEmails(gmail);
    const labels = await gmail.users.labels.list({ userId: "me" });
    const labelsData = labels.data.labels || [];

    if (emails) {
      return emails.map((email) => mapLabels(email, labelsData));
    }
    return [];
  };

  const getMails = async (continueIndex?: number, nextPageId?: string) => {
    const emails = await getEmails(gmail, continueIndex, nextPageId);
    const labels = await gmail.users.labels.list({ userId: "me" });
    const labelsData = labels.data.labels || [];
    const data = await getEmailsPageLenght(nextPageId);
    if (emails) {
      return {
        emails: emails.map((email) => mapLabels(email, labelsData)),
        nextPageId: data.nextPageId,
        length: data.lenght,
      };
    }
  };
  const getEmailsPageLenght = async (pageIndex?: string) => {
    const list = await gmail.users.messages.list({
      userId: "me",
      pageToken: pageIndex ? pageIndex : undefined,
    });
    const lenght = list.data.messages?.length;
    const nextPageToken = list.data.nextPageToken;
    return { nextPageId: nextPageToken, lenght: lenght };
  };
  const getAllEmailIds = async () => {
    const list = await gmail.users.messages.list({ userId: "me" });
    return list.data.messages?.map((message) => message.id);
  };

  const getUser = () => gmail.users.getProfile({ userId: "me" });

  const getAllEmailsLenght = async () => {
    const list = await gmail.users.messages.list({ userId: "me" });
    return list.data.resultSizeEstimate;
  };

  const setRead = (id: string) => {
    return gmail.users.messages.modify({
      userId: "me",
      id,
      requestBody: {
        removeLabelIds: ["UNREAD"],
      },
    });
  };

  const deleteEmail = (id: string) => {
    return gmail.users.messages.delete({
      userId: "me",
      id,
    });
  };

  const getEmail = (id: string) => {
    return gmail.users.messages.get({ userId: "me", id, format: "full" });
  };

  const getDrafts = async () => {
    const list = await gmail.users.drafts.list({ userId: "me" });
    const drafts = list.data.drafts?.map((draft) => {
      return gmail.users.drafts.get({
        userId: "me",
        id: draft.id!,
      });
    });
    return drafts;
  };

  return {
    getRecentEmails,
    getUser,
    getAllEmailsLenght,
    setRead,
    deleteEmail,
    getAllEmailIds,
    getEmail,
    getDrafts,
    getMails,
  };
}