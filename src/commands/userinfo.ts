import { Client, Message, GuildMember, User, Presence } from "discord.js";
import { daysAgoLabel, ladEmbed, ladEmbedOption } from "../utils";

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

  if (!user) return message.channel.send("Couldn't find user!");

  // Date stuff
  const today = new Date();
  const discordDaysAgo = daysAgoLabel(user.createdAt, today);
  const guildDaysAgo = daysAgoLabel(gm.joinedAt, today);
  // TODO this only seems to be non-null when the last message was today...
  // not being cached? look into this.
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
      case "offline":
        return "MIA in offline status.";
      default:
        return "In another world.";
    }
  };

  // Roles info
  const roles = gm.roles.cache.array().filter((r) => r.name !== "@everyone");
  const rolesMsg = roles.length < 1 ? "None" : roles.join(" ");

  // Get base embed
  const embed = ladEmbed(gm, ladEmbedOption.USER_INFO);

  embed
    .setDescription(statusMsg(user.presence))
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
