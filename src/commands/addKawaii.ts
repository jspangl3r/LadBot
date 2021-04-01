import { Client, Message } from "discord.js";
import config from "../../data/config.json";
import fs from "fs";

/**
 * Adds a new anime-esque image to one of the bot's databases.
 * @params args Expected to be a link that ends in .gif, .jpg, .jpeg,.png
 */
export default function run(
  client: Client,
  message: Message,
  args: string[]
): Promise<Message> {
  const ERROR =
    "Make sure to provide a link that ends in .gif, .jpg, .jpeg, .png";
  if (!args[0]) {
    return message.reply(ERROR);
  }
  const link = args[0];

  // Make sure link ends in either .gif, .jpg, or .png
  const end = link.slice(link.length - 4, link.length).trim();
  if (
    !(end === ".gif" || end === ".jpg" || end === ".png" || end === ".jpeg")
  ) {
    return message.reply(ERROR);
  }

  // Make sure only Travis and Jackson can add
  const authorID = message.author.id;
  const trav = config.ids.travID;
  const jack = config.ids.jackID;
  if (!(authorID === trav || authorID === jack)) {
    return message.reply("You are not Travis or possibly Jackson :rage:");
  }

  // See if this bitch has already been added
  const arr = JSON.parse(fs.readFileSync(config.animelinks).toString());
  for (let i = 0; i < arr.length; i++) {
    if (link === arr[i]) {
      return message.reply(
        "It appears this kawaii babe has already been added."
      );
    }
  }

  // Now update the animeLink json array in config file
  arr.push(link);
  fs.writeFileSync(config.animelinks, JSON.stringify(arr));
  message.reply("Your kawaii babe has been added, the bot will now restart.");

  // Now restart the bot to get updated file
  client.destroy();
  client.login(config.token);
  console.log("Bot has been restarted.\n");

  return;
}
