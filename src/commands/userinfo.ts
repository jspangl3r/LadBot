import {
  Client,
  Message,
  GuildMember,
  User,
  MessageEmbed,
  Presence,
} from "discord.js";
import { daysAgoLabel } from "../utils";

export async function run(
  client: Client,
  message: Message,
  args: string[]
): Promise<Message> {
  let user: User = null;
  let gm: GuildMember = null;

  // Use message author if no args. Refetch to get up-to-date info.
  if (!args[0]) {
    user = message.author;
  } else {
    user = message.mentions.users.first();
  }
  gm = message.guild.member(user);
  await message.channel.fetch(true);
  await user.fetch(true).then((u) => (user = u));
  console.log(gm.lastMessageChannelID);

  if (!user) return message.channel.send("Couldn't find user!");

  // Date stuff
  const today = new Date();
  const discordDaysAgo = daysAgoLabel(user.createdAt, today);
  const guildDaysAgo = daysAgoLabel(gm.joinedAt, today);
  const lastMsgDaysAgo = gm.lastMessage
    ? daysAgoLabel(gm.lastMessage.createdAt, today)
    : null;
  const boostedDaysAgo = gm.premiumSince
    ? daysAgoLabel(gm.premiumSince, today)
    : null;
  // Status info
  const statusMsg = (prescence: Presence) => {
    switch (prescence.status) {
      case "online":
        return "Chillin in online status.";
      case "idle":
        return "KO'd in idle status.";
      case "dnd":
        return "Doesn't want to be bothered.";
      default:
        return "In another world.";
    }
  };

  // Roles info
  const roles = gm.roles.cache.array().filter((r) => r.name !== "@everyone");
  const rolesMsg = roles.length < 1 ? "None" : roles.join(" ");

  const embed = new MessageEmbed()
    .setTitle(gm.nickname ? `${user.tag} aka ${gm.nickname}` : `${user.tag}`)
    .setDescription(statusMsg(user.presence))
    .setThumbnail(user.avatarURL())
    .setColor(gm.displayColor)
    .setFooter(`User ID: ${user.id}`)
    .addField(
      "Joined this server on",
      `${gm.joinedAt.toDateString()} (${guildDaysAgo})`
    )
    .addField(
      "Joined Discord on",
      `${user.createdAt.toDateString()} (${discordDaysAgo})`
    )
    .addField(
      "Last seen",
      lastMsgDaysAgo
        ? `${gm.lastMessage.createdAt.toDateString()} (${lastMsgDaysAgo})`
        : "NA"
    )
    .addField("Roles", rolesMsg);

  return message.channel.send(embed);
}
