import { Transporter, createTransport } from "nodemailer";
import { IMailer, ISendEmailPayload } from "./types";

class Mailer {
  _transport: Transporter;

  constructor({ host, port, auth }: IMailer) {
    this._transport = createTransport({ host, port, auth });
  }

  public async sendMail(payload: ISendEmailPayload) {
    return await this._transport.sendMail(payload, (err) => {
      if (err) {
        console.error("could not send email", payload);
      }
      console.log("mail have been sent");
    });
  }
}

export default new Mailer({
  host: process.env.SMTP_HOST || "",
  port: +(process.env.SMTP_PORT || 0),
  auth: {
    user: process.env.SMTP_USER_ID || "",
    pass: process.env.SMTP_USER_PWD || "",
  },
});
