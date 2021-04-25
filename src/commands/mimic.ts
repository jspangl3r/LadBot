import { Client, Message, MessageEmbed, GuildMember } from "discord.js";
import config from "../../data/config.json";
import fs from "fs";
import { findLad, ladEmbed, ladEmbedOption, randomItemFromArr } from "../utils";

/**
 * Displays a random message from either a random or specified mimic.
 * @param args A specified mimic (optional).
 */
export function run(
  client: Client,
  message: Message,
  args: string[]
): Promise<Message> {
  const lads: Record<string, any> = JSON.parse(
    fs.readFileSync(config.lads).toString()
  );

  const ladImages: string[] = JSON.parse(
    fs.readFileSync(config.ladPics).toString()
  );

  let embed = new MessageEmbed();
  let mimic: string = null;

  // No args - random mimic and msg
  if (!args[0]) {
    mimic = randomItemFromArr(ladImages);
  }
  // Args
  else {
    if (args[0].toLowerCase() === "list") {
      const ladsKeys = Object.keys(lads);
      embed.setTitle("Mimics").setDescription(`${ladsKeys.join("\n")}`);
      return message.channel.send(embed);
    } else {
      mimic = args[0];
      // See if any saved mimics start with the input text
      const firstCharMimic = ladImages.find((savedMimic) =>
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
        const mimicDiffs: [string, number][] = ladImages.map((savedMimic) => [
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
  let path = `./data/train/datasets/${mimic}/${mimic}.json`;
  const dataset = JSON.parse(fs.readFileSync(path).toString());
  const msg = randomItemFromArr(dataset);
  const gm: GuildMember = findLad(message.guild, mimic);
  embed = ladEmbed(
    gm ? gm : message.guild.member(message.author),
    ladEmbedOption.MIMIC,
    mimic
  ).setDescription(msg);

  // Info. on mimic model.
  path = `./data/train/datasets/${mimic}/${mimic}.csv`;
  const datasetSize = fs.readFileSync(path, "utf8").split(/\r?\n/).length;
  path = `./data/train/models/${mimic}/checkpoint`;
  const numIterations = fs
    .readFileSync(path, "utf8")
    .split("\n")[0]
    .split("model_checkpoint_path:")[1]
    .split("model-")[1]
    .slice(0, -1);
  embed.setFooter(
    `Trained on ${datasetSize} messages with ${numIterations} iterations using GPT-2 124M model`
  );

  return message.channel.send(embed);
}
