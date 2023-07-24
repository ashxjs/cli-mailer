import { join } from "node:path";
import { readFileSync, mkdirSync } from "node:fs";
import { Command } from "commander";
import { render } from "mustache";
import { createTransport } from "nodemailer";
import { config } from "dotenv";
import { templates } from "./templates";

config();

const program = new Command();
const transport = createTransport({
  host: process.env.SMTP_HOST || "",
  port: +(process.env.SMTP_PORT || 0),
  auth: {
    user: process.env.SMTP_USER_ID || "",
    pass: process.env.SMTP_USER_PWD || "",
  },
});

program.name("mailer").description("CLI to send email").version("0.0.0");

program
  .command("send")
  .description("Send email using CLI options.")
  .argument("<to>", "Send email address")
  .option("--to <to>", "receiver email address.")
  .option("--from <from>", "sender email address")
  .option("--template <template>", "sender email address")
  .action(async (to, { template, from }) => {
    const templateConfig = templates.find(({ type }) => type === template)!;
    const templateFile = readFileSync(
      join(__dirname, `./templates/${templateConfig.filename}`)
    );
    const outputMailContent = render(templateFile.toLocaleString(), {
      lastname: "Hurunghee",
      companyName: "Hurunghee Consulting",
    });

    const sentMessage = await transport.sendMail({
      from,
      to,
      subject: templateConfig.mailObject,
      html: outputMailContent,
      text: outputMailContent,
    });
    console.log(sentMessage.response);
    process.exit();
  });

program.parse();
