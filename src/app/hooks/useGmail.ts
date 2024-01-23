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


export function handleGmail(client?: Auth.OAuth2Client) {
  const gmail = google.gmail({ version: "v1", auth: client });

  // User Profile
  const getUser = () => gmail.users.getProfile({ userId: "me" });

  // Email Retrieval
  const getRecentEmails = async (amount: number) => {
    const emails = await getEmails(gmail);
    const labels = await gmail.users.labels.list({ userId: "me" });
    const labelsData = labels.data.labels || [];

    if (emails) {
      return emails.map((email) => mapLabels(email, labelsData));
    }
    return [];
  };

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

  const getAllEmailsLenght = async () => {
    const list = await gmail.users.messages.list({ userId: "me" });
    return list.data.resultSizeEstimate;
  };
  const getNextPageId = async (pageId: string) => {
    const list = await gmail.users.messages.list({
      userId: "me",
      pageToken: pageId,
    });
    return list.data.nextPageToken;
  };
  const getEmail = (id: string) => {
    return gmail.users.messages.get({ userId: "me", id, format: "full" });
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

  // Email Manipulation

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
  // One Timers
  const sendMessage = async (message: gmail_v1.Schema$Message) => {
    return gmail.users.messages.send({
      userId: "me",
      requestBody: message,
    });
  };

  // Drafts

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
  const newDraft = async (draft: gmail_v1.Schema$Draft) => {
    return gmail.users.drafts.create({
      userId: "me",
      requestBody: draft,
    });
  };
  const deleteDraft = async (id: string) => {
    return gmail.users.drafts.delete({
      userId: "me",
      id,
    });
  };
  const updateDraft = async (id: string, draft: gmail_v1.Schema$Draft) => {
    return gmail.users.drafts.update({
      userId: "me",
      id,
      requestBody: draft,
    });
  };
  const sendDraft = async (id: string) => {
    return gmail.users.drafts.send({
      userId: "me",
      requestBody: {
        id,
      },
    });
  };

  // Special Categories (Trash, Spam, Sent, ...)

  const getTrash = async () => {
    const list = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["TRASH"],
    });
    const emails = list.data.messages;
    const emailPromises = emails?.map((message) =>
      gmail.users.messages.get({ userId: "me", id: message.id! })
    );
    const emailsBatch = await Promise.all(emailPromises!);
    return emailsBatch.map((email) => email.data);
  };
  const getSpam = async () => {
    const list = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["SPAM"],
    });
    const emails = list.data.messages;
    const emailPromises = emails?.map((message) =>
      gmail.users.messages.get({ userId: "me", id: message.id! })
    );
    const emailsBatch = await Promise.all(emailPromises!);
    return emailsBatch.map((email) => email.data);
  };
  const getSent = async () => {
    const list = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["SENT"],
    });
    const emails = list.data.messages;
    const emailPromises = emails?.map((message) =>
      gmail.users.messages.get({ userId: "me", id: message.id! })
    );
    const emailsBatch = await Promise.all(emailPromises!);
    return emailsBatch.map((email) => email.data);
  };
  return {
    getUser,
    getRecentEmails,
    getEmails,
    getEmailsPageLenght,
    getAllEmailIds,
    getAllEmailsLenght,
    getNextPageId,
    getEmail,
    getMails,
    setRead,
    deleteEmail,
    getDrafts,
    newDraft,
    deleteDraft,
    updateDraft,
    getTrash,
    getSpam,
    getSent,
    sendDraft,
    sendMessage,
  };
}
