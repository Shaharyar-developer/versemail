import { google, Auth, gmail_v1 } from "googleapis";

export async function useGmail(client: Auth.OAuth2Client) {
  const gmail = google.gmail({ version: "v1", auth: client });
  const res = await gmail.users.messages.list({
    userId: "me",
    auth: client,
  });
  const getRecentEmails = async (amount: number) => {
    if (res.data.messages) {
      const messages = res.data.messages.slice(0, amount);
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
    const list = await gmail.users.messages.list({ userId: "me" });
    const messages = list.data.messages;
    // Probably use array of promises and dynamic logic here.
  };
  const getAllEmailsLenght = async () => {
    const list = await gmail.users.messages.list({ userId: "me" });
    return list.data.resultSizeEstimate;
  };
  return {
    res,
    getRecentEmails,
    getUser,
    getAllEmails,
    getAllEmailsLenght,
  };
}
