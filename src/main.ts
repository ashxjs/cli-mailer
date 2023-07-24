import { join } from "node:path";
import { readFileSync } from "node:fs";
import { Command } from "commander";
import { render } from "mustache";
import { config } from "dotenv";
import { templates } from "./templates";
import Mailer from "./Mailer/Mailer";

config();

const program = new Command();

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
      join(__dirname, `../templates/${templateConfig.filename}`)
    );
    const outputMailContent = render(templateFile.toLocaleString(), {
      lastname: "Hurunghee",
      companyName: "Hurunghee Consulting",
    });

    Mailer.sendMail({
      from,
      to,
      subject: templateConfig.mailObject,
      html: outputMailContent,
      text: outputMailContent,
    }).finally(() => process.exit());
  });

program.parse();
