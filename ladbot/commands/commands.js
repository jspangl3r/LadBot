/**
 Returns a message to the channel containing all the commands
 currently present.
 */

const Discord = require("discord.js");

exports.run = (client, message) => {
  const keys = Array.from(client.commands.keys());
  let msg = "";
  let i = 1;
  keys.forEach((key) => {
    msg += `${i}. ${key}\n`;
    i++;
  });

  const color = Math.floor((Math.random() * 16777214) + 1);
  const embed = new Discord.MessageEmbed()
      .setTitle("**LadBot Commands:**")
      .setDescription(`\`\`\`${msg}\`\`\``)
      .setColor(color);

  return message.channel.send({embed});
};
