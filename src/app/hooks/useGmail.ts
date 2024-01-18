import { GmailMessage } from "@/lib/types";
import { google, Auth } from "googleapis";

export async function handleGmail(client?: Auth.OAuth2Client) {
  const gmail = google.gmail({ version: "v1", auth: client });
  const emails = await gmail.users.messages.list({
    userId: "me",
    auth: client,
  });
  const labels = await gmail.users.labels.list({ userId: "me" });
  const getRecentEmails = async (amount: number) => {
    if (emails.data.messages) {
      const messages = emails.data.messages.slice(0, amount);
      const emailPromises = messages.map((message) =>
        gmail.users.messages.get({ userId: "me", id: message.id! })
      );
      const labelsResponse = await gmail.users.labels.list({ userId: "me" });
      const labels = labelsResponse.data.labels || [];

      const recentEmails = await Promise.all(emailPromises);
      return recentEmails.map((email) => {
        const emailLabels = email.data.labelIds?.map((labelId) =>
          labels.find((label) => label.id === labelId)
        );
        return { ...email.data, labels: emailLabels };
      });
    }
    return [];
  };

  const getAllEmails = async function* () {
    const labelsResponse = await gmail.users.labels.list({ userId: "me" });
    const labels = labelsResponse.data.labels || [];

    if (emails.data.messages) {
      for (let i = 0; i < emails.data.messages.length; i += 2) {
        const emailPromises = emails.data.messages
          .slice(i, i + 2)
          .map((message) =>
            gmail.users.messages.get({ userId: "me", id: message.id! })
          );

        const emailsBatch = await Promise.all(emailPromises);
        yield emailsBatch.map((email) => {
          const emailLabels = email.data.labelIds?.map((labelId) =>
            labels.find((label) => label.id === labelId)
          );
          return { ...email.data, labels: emailLabels } as GmailMessage;
        });
      }
    }
  };
  const getAllEmailIds = async () => {
    const list = await gmail.users.messages.list({ userId: "me" });
    return list.data.messages?.map((message) => message.id);
  };
  const getUser = async () => {
    return await gmail.users.getProfile({ userId: "me" });
  };
  const getAllEmailsLenght = async () => {
    const list = await gmail.users.messages.list({ userId: "me" });
    return list.data.resultSizeEstimate;
  };
  const setRead = async (id: string) => {
    await gmail.users.messages.modify({
      userId: "me",
      id,
      requestBody: {
        removeLabelIds: ["UNREAD"],
      },
    });
  };
  const deleteEmail = async (id: string) => {
    await gmail.users.messages.delete({
      userId: "me",
      id,
    });
  };
  const getEmail = async (id: string) => {
    return gmail.users.messages.get({ userId: "me", id, format: "full" });
  };
  const getDrafts = async () => {
    const list = await gmail.users.drafts.list({ userId: "me" });
    const drafts = list.data.drafts?.map(async (draft) => {
      const draftData = await gmail.users.drafts.get({
        userId: "me",
        id: draft.id!,
      });
      return draftData.data;
    });
    return drafts;
  };
  return {
    emails,
    getRecentEmails,
    getUser,
    getAllEmails,
    getAllEmailsLenght,
    setRead,
    deleteEmail,
    getAllEmailIds,
    getEmail,
    getDrafts,
  };
}
