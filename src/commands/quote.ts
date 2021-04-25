import { Client, GuildMember, Message, MessageEmbed } from "discord.js";
import config from "../../data/config.json";
import fs from "fs";
import {
  randomItemFromArr,
  randomColor,
  ladEmbed,
  ladEmbedOption,
  findLad,
} from "../utils";

/**
 * Quotes a lad. Slightly outdated.
 */
export function run(client: Client, message: Message): Promise<Message> {
  // Get lad pics
  const ladPics = JSON.parse(fs.readFileSync(config.ladPics).toString());

  // Get random quote
  const quotes = JSON.parse(fs.readFileSync(config.quotes).toString());
  const quoteSplit = randomItemFromArr(quotes).split("-");
  const quoteText = quoteSplit[0].trim();
  const quoteAuthSplit = quoteSplit[1].split(",");
  const quoteAuth = quoteAuthSplit[0].trim();
  const quoteYear = quoteAuthSplit[1].trim();

  // Build embed. Get guild member from quoteAuth if possible.
  let embed: MessageEmbed = null;
  if (ladPics.includes(quoteAuth)) {
    const gm: GuildMember = findLad(message.guild, quoteAuth);
    embed = ladEmbed(
      gm ? gm : message.guild.member(message.author),
      ladEmbedOption.QUOTE,
      quoteAuth,
      quoteYear
    );
  } else {
    embed = new MessageEmbed()
      .setColor(randomColor())
      .setFooter(`- ${quoteAuth}, ${quoteYear}`);
  }

  embed.setDescription(`*${quoteText}*`);

  return message.channel.send(embed);
}
