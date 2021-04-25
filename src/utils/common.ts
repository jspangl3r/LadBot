/** Common utilities. */

import {
  Client,
  Message,
  GuildMember,
  MessageEmbed,
  MessageAttachment,
  Guild,
} from "discord.js";
import { wordsEmojis } from "./wordsEmojisRegex";
import config from "../../data/config.json";
import fs from "fs";

/**
 * Enum used in {@code #ladEmbed} to specify the type of embed.
 */
export enum ladEmbedOption {
  USER_INFO = 1,
  MIMIC = 2,
  QUOTE = 3,
}

/**
 * Returns a template {@code MessageEmbed} for the specified lad {@code GuildMember}
 * with title, thumbnail, and color information. Used for {@link userInfo.ts},
 * {@link mimic.ts}, and {@link quote.ts}.
 * @param gm The specified {@code GuildMember} to create the embed for.
 * @param option Indicates what the user embed is for.
 * @param lad The name of the lad to get image data for. Optional.
 * @param quoteYear The year from a quote. Optional.
 * @returns A template {@code MessageEmbed} with re-used info.
 */
export function ladEmbed(
  gm: GuildMember,
  option: ladEmbedOption,
  lad: string = null,
  quoteYear: number = null
): MessageEmbed {
  const embed = new MessageEmbed();

  // Set title
  let title: string = null;
  if (option > 1) {
    title = option === 3 ? lad : `"${lad}"`;
  } else {
    title = gm.nickname ? `${gm.user.tag} aka ${gm.nickname}` : gm.user.tag;
  }
  switch (option) {
    case ladEmbedOption.USER_INFO:
      title = gm.nickname ? `${gm.user.tag} aka ${gm.nickname}` : gm.user.tag;
      break;
    case ladEmbedOption.MIMIC:
      title = `"${lad}"`;
      break;
    case ladEmbedOption.QUOTE:
      title = `${lad} - ${quoteYear}`;
      break;
  }
  embed.setTitle(title);

  // Set thumbnail
  if (option > 1) {
    const attachment = new MessageAttachment(`./data/images/Lads/${lad}.png`);
    embed.attachFiles([attachment]).setThumbnail(`attachment://${lad}.png`);
  } else {
    embed.setThumbnail(gm.user.avatarURL());
  }

  // Set color
  embed.setColor(gm.displayColor);

  return embed;
}

/**
 * Attemps to find a lad {@code GuildMember} from an input {@code #lad} string.
 * @param guild Assumed to be the YungLads {@code Guild}.
 * @param lad The lad string to look for.
 * @returns The lad's {@code GuildMember} object if found, or {@code null}.
 */
export function findLad(guild: Guild, lad: string): GuildMember | null {
  const lads: Record<string, any> = JSON.parse(
    fs.readFileSync(config.lads).toString()
  );

  let gm: GuildMember = null;
  if (lads[lad]) {
    gm = guild.members.cache
      .array()
      .find((member) => member.user.id === lads[lad].id);
  }

  return gm;
}

/**
 * Returns a random item from the input {@code #arr} array.
 * @param arr The array to get a random item from
 * @returns A random item from {@code #arr} or {@code undefined} if empty
 */
export function randomItemFromArr(arr: any[]): any {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Checks if the input {@code #msg} is a valid message to add to the database.
 * Validity is determined by if the message contains normal letters/symbols and
 * emojis and starts with no bot prefixes and contains no mentions or links.
 * @param msg The {@code Message} to check the validity of.
 * @returns {@code true} if {@code #msg} is a valid message,
 *          {@code false} otherwise.
 */
export function validMessage(msg: Message): boolean {
  const regex = new RegExp(wordsEmojis);
  return (
    !msg.author.bot &&
    msg.content.match(regex) !== null &&
    !msg.content.startsWith("!") &&
    !msg.content.startsWith(config.prefix) &&
    !msg.content.includes("<@") &&
    !msg.content.includes("http:") &&
    !msg.content.includes("https:")
  );
}

/**
 * Restarts the bot linked to the input {@code #client} object.
 * @param client The {@code Client} object to restart.
 */
export function restart(client: Client): void {
  client.destroy();
  client.login(config.token).then(() => setActivity(client));
  console.log("Bot has been restarted.");
}

/**
 * Sets the input {@code #client.user}'s status with a random custom activity.
 * @param client The {@code Client} object to set the activity of.
 */
export function setActivity(client: Client): void {
  const customActivities = JSON.parse(
    fs.readFileSync((config as any).customActivities).toString()
  );
  const randStatus = randomItemFromArr(customActivities);
  if (client.user) {
    client.user.setActivity(randStatus);
  } else {
    console.log("BLAH!");
  }
}

/**
 * Returns a random color.
 * @returns a random color.
 */
export function randomColor(): number {
  return Math.floor(Math.random() * 16777214 + 1);
}

/**
 * Converts input r, g, b {@code number}s to a hex {@code string}.
 * @param r The red rgb value
 * @param g The green rgb value
 * @param b The blue rgb value
 * @returns A color hex {@code string}.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}
