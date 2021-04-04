import { Client, Message, MessageEmbed } from "discord.js";
import config from "../../data/config.json";
import fs from "fs";

/**
 * Sends a kawaii ★,｡･::･ﾟ’☆ image.
 */
export function run(client: Client, message: Message): Promise<Message> {
  const animelinks = JSON.parse(fs.readFileSync(config.animelinks).toString());
  const randLink = animelinks[Math.floor(Math.random() * animelinks.length)];

  const embed = new MessageEmbed()
    .setTitle("So kawaii! (ﾉ>ω<)ﾉ :｡･::･ﾟ’★,｡･::･ﾟ’☆")
    .setColor(16761035)
    .setImage(randLink)
    .setFooter("kawaii!");

  return message.channel.send(embed);
}
