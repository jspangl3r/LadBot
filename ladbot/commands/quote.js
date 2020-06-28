/**
 * Sends one of the lads quotes to #yunglads text channel
 */

const Discord = require("discord.js");
const fs = require("fs");
const quoteHelp = require("./quoteHelp.js");

exports.run = (client, message) => {
  // Get quotes array
  const arr = JSON.parse(fs.readFileSync(client.config.quotes));

  // Get quote and break it up into relevant parts
  const quoteArr = arr[Math.floor(Math.random() * arr.length)].split("-");
  const quoteText = quoteArr[0].trim();
  const quoteAuth = quoteArr[1].trim();

  // Format text if needed
  const txt = `*${quoteHelp.getParagraph(quoteText.split(" "), 25)}*`;

  // Build discord embed
  const color = Math.floor((Math.random() * 16777214) + 1);
  const embed = new Discord.RichEmbed()
      .setDescription(txt)
      .setColor(color)
      .setFooter(`- ${quoteAuth}`);

  // Ship.
  return message.channel.send({embed});
};
