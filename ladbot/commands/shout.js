/**
 Shouts to a very specific channel, given a message.
 */

exports.run = (client, message,args) => {
    const Discord = require("discord.js");

    if(!args[0]) 
        return message.channel.send("Usage: !shout [message]");

    let msg = "";
    args.forEach(a => msg += a + " ");
    message.channel.send("Shouting to the channel...");
    return client.channels.get(client.config.youngladsID).send(msg);
}