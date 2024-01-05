import { Transporter, createTransport } from "nodemailer";
import { IMailer, ISendEmailPayload } from "./types";

class Mailer {
  _transport: Transporter;

  constructor({ host, port, auth }: IMailer) {
    this._transport = createTransport({ host, port, auth });

  try {
      this._transport.verify();
  } catch(err) {
      console.error("ERROR:constructor:verify: ", { err });
  }
  }

  public async sendMail(payload: ISendEmailPayload) {
    try {
      return await this._transport.sendMail(payload);
    } catch (err) {
      console.error("err: ", err);
    }
  }
}

export default new Mailer({
  host: "in-v3.mailjet.com",
  port: 2525,
  auth: {
    user: process.env.MJ_APIKEY || "",
    pass: process.env.MJ_APIKEY_PRIVATE || "",
  },
});
