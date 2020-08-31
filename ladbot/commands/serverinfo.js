/**
 Provides detailed information of the server from which the bot is
 correspondingly residing on when invoked.
 */

const Discord = require("discord.js");

exports.run = (client, message) => {
  // Get relevant attributes
  const server = message.guild;
  const {name} = server;
  const dictator = server.owner.user.tag;

  // Calculate some interesting date stuff
  const createdDate = server.createdAt;
  const createdStr = server.createdAt.toDateString();
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const createdMS = createdDate.getTime();
  const nowMS = Date.now();
  const diff = Math.abs(nowMS - createdMS);
  const days = Math.round(diff / ONE_DAY);

  // Get region info.
  const {region} = server;

  // Get number of types of channels
  const channels = server.channels.cache.array();
  let voiceChannels = 0;
  let textChannels = 0;
  // Could probably do this in a cleaner way
  channels.forEach((c) => {
    if (c.type === "voice") {
      voiceChannels++;
    } else if (c.type === "text") {
      textChannels++;
    }
  });

  const roles = server.roles.cache.array().length;

  // Get number of online members
  const members = server.members.cache.array();
  const totalMembers = server.memberCount;
  let onlineMembers = 0;
  // Could probably do this in a cleaner way
  members.forEach((m) => {
    if (m.presence.status === "online") {
      onlineMembers++;
    }
  });

  // Get server ID and icon info.
  const {id} = server;
  const iconURL = server.iconURL();

  // Choose a pretty random color
  const color = Math.floor((Math.random() * 16777214) + 1);

  // Start building the embed
  const embed = new Discord.MessageEmbed()
      .setTitle(name)
      .setDescription(`Around since ${createdStr} (${days} days ago!)`)
      .setThumbnail(iconURL)
      .setColor(color)
      .setFooter(`Server ID: ${id}`)
      .addField("Region", region, false)
      .addField("Users", `${onlineMembers}/${totalMembers}`, false)
      .addField("Text Channels", textChannels, false)
      .addField("Voice Channels", voiceChannels, false)
      .addField("Roles", roles, false)
      .addField("Owner", dictator, false);

  // Send that bad boy
  return message.channel.send({embed});
};
