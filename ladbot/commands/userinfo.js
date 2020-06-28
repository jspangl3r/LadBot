/**
 Fetches userdata/server-member data regarding a certain user (if specified), or
 by default the author of the method call.
 */

const Discord = require("discord.js");

exports.run = (client, message, args) => {
  let user; let gm;

  // If no arg is provided, just use the author
  if (!args[0]) {
    user = message.author;
    gm = message.guild.member(user);
  } else {
    // Otherwise, get the user mentined
    user = message.mentions.users.first();
    gm = message.guild.member(user);
  }

  if (!(user && user.tag)) {
    return message.channel.send("Could not find user!");
  }

  // Get relevant attributes, first get some name info.
  const usertag = user.tag;
  const {nickname} = gm;

  // Get status stuff
  const {status} = user.presence;
  let statusText = "";
  switch (status) {
    case "online":
      statusText = "Chilling in online status.";
      break;
    case "offline":
      statusText = "MIA in offline status.";
      break;
    case "idle":
      statusText = "KO'd in away status.";
      break;
    case "dnd":
      statusText = "Do not message this person!";
      break;
    default:
      statusText = "In another world.";
  }

  // Calculate some interesting date stuff
  const joinedDiscordDate = user.createdAt;
  const joinedDiscordStr = user.createdAt.toDateString();
  const joinedServerDate = gm.joinedAt;
  const joinedServerStr = gm.joinedAt.toDateString();
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const nowMS = Date.now();
  const createdMS = joinedDiscordDate.getTime();
  const joinedMS = joinedServerDate.getTime();
  const createdDiff = Math.abs(nowMS - createdMS);
  const joinedDiff = Math.abs(nowMS - joinedMS);
  const createdDays = Math.round(createdDiff / ONE_DAY);
  const joinedDays = Math.round(joinedDiff / ONE_DAY);

  // Get role information
  const roles = gm.roles.array().slice(1);	// Avoid @everyone role
  let rolesText = "";
  if (roles.length < 1) {
    rolesText = "None";
  } else {
    let role;
    for (let i = 0; i < roles.length; i++) {
      role = roles[i].name;
      if (i !== roles.length - 1) {
        rolesText += `${role}, `;
      } else {
        rolesText += role;
      }
    }
  }

  // Get ID, avatar, and color information
  const {id} = user;
  const {avatarURL} = user;
  const color = gm.displayColor;

  // Start building an the embed
  const embed = new Discord.RichEmbed()
      .setDescription(statusText)
      .setThumbnail(avatarURL)
      .setColor(color)
      .setFooter(`User ID: ${id}`)
      .addField("Joined Discord on", `${joinedDiscordStr}\n(${createdDays} days ago!)`, false)
      .addField("Joined this server on", `${joinedServerStr}\n(${joinedDays} days ago!)`, false)
      .addField("Roles", rolesText, false);

  // Set nickname if it exists
  if (nickname) {
    embed.setTitle(`${usertag} aka ${nickname}`);
  } else {
    embed.setTitle(usertag);
  }

  // I ship it.
  return message.channel.send({embed});
};
