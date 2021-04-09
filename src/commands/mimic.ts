import { Client, Message, MessageEmbed, MessageAttachment } from "discord.js";
import config from "../../data/config.json";
import fs from "fs";
import { randomColor, randomItemFromArr } from "../utils";

/**
 * Displays a random message from either a random or specified mimic.
 * @param args A specified mimic (optional).
 */
export function run(
  client: Client,
  message: Message,
  args: string[]
): Promise<Message> {
  const mimics: string[] = JSON.parse(
    fs.readFileSync(config.mimics).toString()
  );
  const ladImages: string[] = JSON.parse(
    fs.readFileSync(config.ladPics).toString()
  );

  const embed = new MessageEmbed();
  const color = randomColor();
  let attachment: MessageAttachment;
  let mimic: string = null;

  // No args - random mimic and msg
  if (!args[0]) {
    mimic = randomItemFromArr(mimics);
  }
  // Args
  else {
    if (args[0].toLowerCase() === "list") {
      embed.setTitle("Mimics").setDescription(`${mimics.join("\n")}`);
      return message.channel.send(embed);
    } else {
      mimic = args[0];
      // See if any saved mimics start with the input text
      const firstCharMimic = mimics.find((savedMimic) =>
        savedMimic.toLowerCase().startsWith(mimic.toLowerCase())
      );
      if (firstCharMimic) {
        mimic = firstCharMimic;
      }
      // Otherwise find the saved mimic that differs the least from the input
      // text. //TODO just use largest substring instead
      else {
        const diff = (diffMe: string, diffBy: string): number =>
          diffMe.split(diffMe.split(diffBy).join("")).join("").length;
        const mimicDiffs: [string, number][] = mimics.map((savedMimic) => [
          savedMimic,
          diff(savedMimic.toLowerCase(), mimic.toLowerCase()),
        ]);
        const maxDiff = Math.max(...mimicDiffs.map((arr) => arr[1]));
        const closestMimic = mimicDiffs.find((item) => item[1] === maxDiff)[0];
        if (closestMimic) {
          mimic = closestMimic;
        }
      }
    }
  }

  // Build embed
  if (!mimic) return message.reply("Mimic not found.");
  const path = `./data/train/datasets/${mimic}/${mimic}.json`;
  const dataset = JSON.parse(fs.readFileSync(path).toString());
  const msg = randomItemFromArr(dataset);
  if (ladImages.includes(mimic)) {
    attachment = new MessageAttachment(`./data/images/Lads/${mimic}.png`);
    embed.attachFiles([attachment]).setThumbnail(`attachment://${mimic}.png`);
  }
  embed.setTitle(mimic).setDescription(msg).setColor(color);

  return message.channel.send(embed);
}
