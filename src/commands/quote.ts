import { Client, Message, MessageEmbed } from "discord.js";
import config from "../../data/config.json";
import fs from "fs";
import { randomItemFromArr, randomColor, getParagraph } from "../utils";

export default function run(
  client: Client,
  message: Message,
  args: string[]
): Promise<Message> {
  // Get random quote
  const quotes = JSON.parse(fs.readFileSync(config.quotes).toString());
  const quoteSplit = randomItemFromArr(quotes).split("-");
  const quoteText = quoteSplit[0].trim();
  const quoteAuth = quoteSplit[1].trim();

  // Justify text
  const txt = `*${getParagraph(quoteText.split(" "), 30)}*`;

  const embed = new MessageEmbed()
    .setDescription(txt)
    .setColor(randomColor())
    .setFooter(`- ${quoteAuth}`);

  return message.channel.send({ embed });
}
