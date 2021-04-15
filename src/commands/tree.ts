import { Client, Message } from "discord.js";
import { randomItemFromArr } from "../utils";
import config from "../../data/config.json";
import fs from "fs";

/**
 * Tree.
 */
export function run(client: Client, message: Message): Promise<Message> {
  const trees: string[] = JSON.parse(fs.readFileSync(config.trees).toString());
  let msg = "";
  let i = 0;

  while (i < 7) {
    const tree = randomItemFromArr(trees);
    msg += `${tree}. `;
    i++;
  }

  return message.channel.send(msg);
}
