/*
Responsible for dealing with message events as well as some markov stuff.
*/

const markov = require("./markov.js");

// The bread and butter method
module.exports.onMessage = function onMessage(client, message, db) {

	// Ignore all bots
	if(message.author.bot)
		return;

	// Check to see if the bot was mentioned
	const prefixMention = message.content.slice(0, client.config.botID.length+1).trim();
	if(prefixMention === client.config.botID) {
		let msg = message.content.slice(client.config.botID.length+1);
		
		// Deal with empty message
		if(!msg)
			return message.reply("Why u be saying nothing to me, b?");

		// Invoke markov - generate and send an epic response
		let channelID = message.channel.id;
		if(db[channelID]) {
			let response = markov.generateSentence(db[channelID]);
			if(response === -1) {
				return message.channel.send("EMPTY CHAIN WARNING -- Let me listen for a little bit");
			}
			// Return good response!
		    return message.channel.send(response);
		}
		else {
			// Create chain on no data
			db[channelID] = markov.createChain();
		    return message.channel.send("NO CHAIN FOR THIS MESSAGE -- Let me listen for a little bit");
		}
	}

	// Check for offensive message
	let splits = message.content.toLowerCase().split(/ +/g);
	for(let i = 0; i < splits.length; i++) {
		let word = splits[i];
		
		// front of word
		if(word.slice(0, 3) === 'nig') {
			return message.reply("<:bruh:517226415725346827>");
		}
		// back of word
		else if(word.slice(word.length-3, word.length) === 'nig') {
			return message.reply("<:bruh:517226415725346827>");
		}
	}		

	// Check for Matt message hehe
	if(message.author.id === client.config.mattID) {
		let rand = Math.floor(Math.random() * 100) + 1;
		if(rand == 1) {
			return message.channel.send("Shut up, " + message.author);
		}
	}

    // Train some messages for the bot!
    let channelID = message.channel.id;
    let msgText = message.content;
    if(!db[channelID]) {
    	// Create new chain for new message
    	db[channelID] = markov.createChain();
    }
    // Now merge the message text into a possibly pre-existing chain
  	if(msgTxt) {
  		markov.mergeSentence(db[channelID], msgText);	
    }

	// At this point, ignore messages not starting with the prefix '!'
	if(message.content.indexOf(client.config.prefix) !== 0)
		return;

	// Separate message into args and command
	const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
	const command = args.shift();

	// Get command data from the commands Enmap in index.js
	const cmd = client.commands.get(command);
	
	// If command doesn't exist, silently exit and do nothing
	if(!cmd)
		return;
	
	// Otherwise, run the comand
	cmd.run(client, message, args);	
}
