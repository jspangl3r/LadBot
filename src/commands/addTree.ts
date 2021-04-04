import { Client, Message } from "discord.js";
import config from "../../data/config.json";
import fs from "fs";

/**
 * Add tree.
 * @params args Expected to be a new epic tree message.
 */
export function run(
  client: Client,
  message: Message,
  args: string[]
): Promise<Message> {
  if (!args[0]) return message.reply("```.addTree [tree message]```");
  const msg = message.content.split(".addTree ")[1].trim();

  const arr = JSON.parse(fs.readFileSync(config.trees).toString());
  for (let i = 0; i < arr.length; i++) {
    if (msg === arr[i]) {
      return message.reply("Bro this weed message is already in here");
    }
  }

  arr.push(msg);
  fs.writeFileSync(config.trees, JSON.stringify(arr));
  message.reply("Added weed message, bot will now restart");

  // Now restart the bot to get updated file
  client.destroy();
  client.login(config.token);
  console.log("Bot has been restarted.\n");

  return;
}
