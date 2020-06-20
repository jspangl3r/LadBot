/**
 Returns a message to the channel containing all the commands
 currently present.
 */

exports.run = (client, message, args) => {
    const Discord = require("discord.js");
    let keys = Array.from(client.commands.keys());
    let msg = "";
    let i = 1;
    keys.forEach( (key) => {
        msg += i + ". " + key + "\n";
        i++;
    });

    let color = Math.floor((Math.random()*16777214)+1);
    let embed = new Discord.RichEmbed() 
        .setTitle("**LadBot Commands:**")
        .setDescription("```" + msg + "```")
        .setColor(color)    

    return message.channel.send({embed});
}