import { Client, Message } from "discord.js";
import config from "../../data/config.json";
import fs from "fs";

/**
 * Returns a random sample text from any of the trained gpt-2 datasets in
 * {@dir data/train/datasets}.
 */
export function run(
  client: Client,
  message: Message,
  args: string[]
): Promise<Message> {
  // Get random mimic and text
  const mimics = JSON.parse(fs.readFileSync(config.mimics).toString());
  const randMimic = mimics[Math.floor(Math.random() * mimics.length)];
  const path = `./data/train/datasets/${randMimic}/${randMimic}.json`;
  const dataset = JSON.parse(fs.readFileSync(path).toString());
  const text = dataset[Math.floor(Math.random() * dataset.length)];

  return message.channel.send(`[${randMimic}] ${text}`);
}
