export interface IMailer {
  host: string;
  port: number;
  auth: { user: string; pass: string };
}

export type ISendEmailPayload = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
};
