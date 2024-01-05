import packageJson from "./../package.json";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { Command } from "commander";
import { render } from "mustache";
import { config } from "dotenv";
import { templates } from "./templates";
import Mailer from "./Mailer/Mailer";

config();

const program = new Command();

program.name("mailer").description("CLI to send email").version(packageJson.version);

program
  .command("send")
  .description("Send email using CLI options.")
  .argument("<to>", "Send email address")
  .option("--to <to>", "receiver email address.")
  .option("--from <from>", "sender email address")
  .option("--data <DATA>", "Data to inject")
  .option("--template <template>", "sender email address")
  .action(async (to, { template, from, data }) => {
    const templateConfig = templates.find(({ type }) => type === template)!;
    const templateFile = readFileSync(
      join(__dirname, `../templates/${templateConfig.filename}`)
    );
    const parsedData = JSON.parse(data);
    console.log(parsedData);
    
    const outputMailContent = render(templateFile.toLocaleString(), JSON.parse(data));
    
    Mailer.sendMail({
      from,
      to,
      subject: templateConfig.mailObject,
      html: outputMailContent,
      text: outputMailContent,
    })
    .then(() => console.log("DONE"))
    .catch(() => console.log("ERROR"))
    .finally(() => process.exit());
  });

program.parse();
