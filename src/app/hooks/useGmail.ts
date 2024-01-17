import { google, Auth, gmail_v1 } from "googleapis";

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

  const getUser = async () => {
    return await gmail.users.getProfile({ userId: "me" });
  };
  const getAllEmails = async () => {
    const messages = emails.data.messages!;
    const emailPromises = messages.map((message) =>
      gmail.users.messages.get({ userId: "me", id: message.id! })
    );
    // yield emails one by one
    const labelPromise = labels.data.labels || [];
    return { ...emailPromises, ...labelPromise };
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
  return {
    emails,
    getRecentEmails,
    getUser,
    getAllEmails,
    getAllEmailsLenght,
    setRead,
    deleteEmail,
  };
}
