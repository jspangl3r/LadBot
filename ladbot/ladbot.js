/**
 Responsible for dealing with message events as well as some markov stuff.
 */

// We're gonna use this to handle markov chaining stuffs
const markov = require("./markov.js");

/**
 The bread and butter method of this bot.
 Each time a message in a text channel is sent, the bot will read it, where
 this function decides what to do with that message.

 Current features:

 1) Reply with a unique markov chain message upon being mentioned
 2) Possibly reply (???!) when Matt says something\
 3) Load a command

 */
module.exports.onMessage = function onMessage(client, message, db) {
  // Ignore all bots
  if (message.author.bot) return;

  // Check to see if the bot was mentioned
  if (message.content.includes(client.config.botMentionID)) {
    // Currently this is never actually used to generate a more relevant message!
    // Just say anything to any type of mention now (add AI in future??)

    // Invoke markov - generate and send an epic response
    const channelID = message.channel.id;
    if (db[channelID]) {
      const response = markov.generateSentence(db[channelID]);
      if (response === -1) {
        return message.channel.send("EMPTY CHAIN WARNING -- Let me listen for a little bit");
      }
      // Return good response!@
      return message.channel.send(response);
    }

    // Create chain on no data
    db[channelID] = markov.createChain();
    return message.channel.send("NO CHAIN FOR THIS MESSAGE -- Let me listen for a little bit");
  }

  // Check for Matt message hehe
  if (message.author.id === client.config.mattID) {
    const rand = Math.floor(Math.random() * 100) + 1;
    if (rand === 1) {
      return message.channel.send(`Shut up, ${message.author}`);
    }
  }

  // Train some messages for the bot!
  const channelID = message.channel.id;
  const msgText = message.content;
  if (!db[channelID]) {
    // Create new chain for new message
    db[channelID] = markov.createChain();
  }
  /**
   Now merge the message text into a possibly pre-existing chain
	 Note: for now, only look at messages that aren't blank and aren't commands
	 */
  if (msgText && msgText.indexOf(client.config.prefix) !== 0) {
    markov.mergeSentence(db[channelID], msgText);
  }

  // At this point, ignore messages not starting with the prefix '!'
  if (message.content.indexOf(client.config.prefix) !== 0) return;

  // Separate message into args and command
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift();

  // Get command data from the commands Enmap in index.js
  const cmd = client.commands.get(command);

  // If command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  // Otherwise, run the comand
  cmd.run(client, message, args);
};
