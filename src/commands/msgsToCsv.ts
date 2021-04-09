/** Records, across all saved channel databases, the messages from a user. */

import { Client, Message } from "discord.js";
import config from "../../data/config.json";
import fs from "fs";

export function run(client: Client, message: Message, args: string[]): void {
  if (message.author.id !== config.ids.ownerID) return;

  if (!args[0]) return;

  const userID = args[0].replace("<@!", "").replace(">", "");

  let csv = "";

  const db: Record<string, any> = JSON.parse(
    fs.readFileSync(config.database).toString()
  );

  Object.keys(db).forEach((channelID: string) => {
    const channelDB: Record<string, string[]> = db[channelID];
    for (const [key, value] of Object.entries(channelDB)) {
      if (userID !== key) continue;
      value.forEach((msg) => (csv += `${msg}\n`));
    }
  });

  // Manually edit cuz bad coder
  fs.writeFileSync("./data/train/datasets/Josh/Josh2.csv", csv);
}
