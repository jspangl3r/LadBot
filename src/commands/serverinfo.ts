import { Client, Message, MessageEmbed } from "discord.js";
import { daysAgoLabel, rgbToHex } from "../utils";
import { getColor } from "colorthief";

/**
 * Some stats regarding the channel the method is invoked from.
 */
export async function run(client: Client, message: Message): Promise<Message> {
  // Guild - represents the discord server
  const guild = message.guild;
  const iconURL = guild.iconURL({ format: "png", dynamic: true });

  // Calculate date stuff
  const createdDaysAgo = daysAgoLabel(guild.createdAt, new Date());

  // Channels info. Not counting category, news, or store channels
  const channels = guild.channels.cache.array();
  const textChannels = channels.filter((channel) => channel.type === "text");
  const voiceChannels = channels.filter((channel) => channel.type === "voice");
  const afkChannel = guild.afkChannel ? guild.afkChannel.name : null;

  // Emoji info
  const numEmojis = guild.emojis.cache.array().length;

  // Member/Role info. Fetch from the API for up-to-date presences. Not sure
  // how frequently this stuff is cached...
  const numRoles = guild.roles.cache.array().length;
  let onlineMembers = 0;
  await guild.members.fetch({ force: true }).then((members) => {
    onlineMembers = members
      .array()
      .filter((member) => member.presence.status !== "offline").length;
  });

  // Color info
  let iconColor: string = null;
  try {
    await getColor(iconURL).then(
      (color: number[]) => (iconColor = rgbToHex(color[0], color[1], color[2]))
    );
  } catch (err) {}

  const embed = new MessageEmbed()
    .setTitle(guild.name)
    .setDescription(
      `Around since ${guild.createdAt.toDateString()} (${createdDaysAgo})`
    )
    .setThumbnail(iconURL)
    .setColor(iconColor)
    .setFooter(`Server ID: ${guild.id}`)
    .addField("Region", guild.region)
    .addField("Members", `${onlineMembers}/${guild.memberCount} online`)
    .addField("Emojis", numEmojis)
    .addField("Text Channels: ", textChannels.length, true)
    .addField("Voice Channels: ", voiceChannels.length, true)
    .addField("AFK Channel: ", afkChannel ? afkChannel : "NA", true)
    .addField("Roles", numRoles)
    .addField("Owner", guild.owner);

  return message.channel.send(embed);
}
