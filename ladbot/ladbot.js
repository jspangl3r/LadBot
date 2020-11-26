/**
 Responsible for dealing with message events as well as some markov stuff.
 */

// We're gonna use this to handle markov chaining stuffs
const markov = require("./markov.js");
const fs = require("fs");

// ladboi gpt-2 model.
const ladboiDataset = JSON.parse(fs.readFileSync("./data/train/datasets/LadBoi/ladboi.json"));

/**
 The bread and butter method of this bot.
 Each time a message in a text channel is sent, the bot will read it, where
 this function decides what to do with that message.

 Current features:
  1) Load a command.
  2) If mentioned, reply with a generated gpt-2 model response 
      (or with a markov chain generated sentence)
  3) Possibly say shut up to our boy Matthew.

 */
module.exports.onMessage = function onMessage(client, message, db) {
  // Ignore all bots
  if (message.author.bot) return;

  // Upon being mentioned
  if (message.content.includes(client.config.ids.botID)) {

    // Invoke markov - generate and send an epic response - Disabled for now.
    // const channelID = message.channel.id;
    // if (db[channelID]) {
    //   const response = markov.generateSentence(db[channelID]);
    //   if (response === -1) {
    //     return message.channel.send("EMPTY CHAIN WARNING -- Let me listen for a little bit");
    //   }
    //   // Return good response!@
    //   return message.channel.send(response);
    // }

    // Send back gpt-2 generated response.
    const msg = ladboiDataset[Math.floor(Math.random() * ladboiDataset.length)];
    return message.channel.send(msg);
  }

  // Check for Matt message hehe
  if (message.author.id === client.config.ids.mattID) {
    if ((Math.floor(Math.random() * 100) + 1) === 1) {
      return message.channel.send(`Shut up, ${message.author}`);
    }
  }

  // 1% chance to reply to message with ladboiDataset.
  if ((Math.floor(Math.random() * 100) + 1) === 1) {
    // Send back gpt-2 generated response.
    const msg = ladboiDataset[Math.floor(Math.random() * ladboiDataset.length)];
    message.channel.reply(msg);

    // Get a little spicy - possibly tell Matthew, out of Ladboi's own volition,
    // to shutup (with another chance of 1%)
    if ((Math.floor(Math.random() * 100) + 1) === 1) {
      message.channel.send("ULTA OMEGA SHUTUP Mr. Matthew! :mattGASM:");
    }

    return;
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

  // At this point, ignore messages not starting with the prefix '.'
  if (message.content.indexOf(client.config.prefix) !== 0) return;

  // Separate message into args and command
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift();

  // Get command data from the commands Enmap in index.js
  const cmd = client.commands.get(command);

  // If command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  // Otherwise, try to run the comand
  try {
    cmd.run(client, message, args);
  }
  catch(e) {
    console.error(e);
    return message.channel.send("Caught error dawg :gFlush:");
  }
};