import { Client, Message, GuildMember, MessageEmbed } from "discord.js";
import config from "../../data/config.json";
import fs from "fs";
import {
  randomItemFromArr,
  randomColor,
  getParagraph,
  gmEmbed,
  gmEmbedOption,
} from "../utils";

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
  const quoteAuthSplit = quoteSplit[1].split(",");
  const quoteAuth = quoteAuthSplit[0].trim();
  const quoteYear = quoteAuthSplit[1].trim();

  // Build embed. Get guild member from quoteAuth if possible.
  let embed: MessageEmbed = null;
  if (lads.includes(quoteAuth)) {
    embed = gmEmbed(
      message.guild.member(message.author),
      quoteAuth,
      quoteYear,
      gmEmbedOption.QUOTE
    );
  } else {
    embed = new MessageEmbed()
      .setColor(randomColor())
      .setFooter(`- ${quoteAuth}, ${quoteYear}`);
  }

  embed.setDescription(`*${quoteText}*`);

  return message.channel.send(embed);
}
