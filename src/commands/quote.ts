import { Client, Message, GuildMember, MessageEmbed } from "discord.js";
import config from "../../data/config.json";
import fs from "fs";
import { randomItemFromArr, randomColor, getParagraph } from "../utils";

/**
 * Quotes a lad. Slightly outdated.
 */
export function run(client: Client, message: Message): Promise<Message> {
  // Get lads info
  const lads = Object.keys(fs.readFileSync(config.lads).toString());

  // Get random quote
  const quotes = JSON.parse(fs.readFileSync(config.quotes).toString());
  const quoteSplit = randomItemFromArr(quotes).split("-");
  const quoteText = quoteSplit[0].trim();
  const quoteAuth = quoteSplit[1].trim();

  // Build embed. Get guild member from quoteAuth if possible.
  let embed: MessageEmbed = null;
  if (lads.includes(quoteAuth)) {
    // embed = gmEmbed(message.guild.member(message.author));
  } else {
    // Justify text
    const txt = `*${getParagraph(quoteText.split(" "), 40)}*`;

    embed = new MessageEmbed()
      .setDescription(txt)
      .setColor(randomColor())
      .setFooter(`- ${quoteAuth}`);
  }

  return message.channel.send(embed);
}
