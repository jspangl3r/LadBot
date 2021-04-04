import { Client, MessageEmbed, Message } from "discord.js";
import { commands } from "../index";
import { randomColor } from "../utils";

/**
 * Sends a list of all available commands.
 */
export function run(client: Client, message: Message): Promise<Message> {
  const keys = Array.from(commands.keys());
  let msg = "";
  let i = 1;
  keys.forEach((key) => {
    msg += `${i}. ${key}\n`;
    i++;
  });

  const embed = new MessageEmbed()
    .setTitle("**LadBoi Commands**")
    .setDescription(`\`\`\`${msg}\`\`\``)
    .setColor(randomColor());

  return message.channel.send(embed);
}
