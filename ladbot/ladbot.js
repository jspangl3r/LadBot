// Handles message reading and markov stuff

const markov = require("./markov.js");

// The bread and butter method
module.exports.onMessage = function onMessage(client, message, db) {
	
	// Cleverbot stuff
	let Cleverbot = require("cleverbot-node");
	cleverbot = new Cleverbot;
	cleverbot.configure({botapi: client.config.cleverbotKey});

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

		// Invoke Cleverbot with message text
		message.channel.startTyping();
		cleverbot.write(msg, function (response) {
			message.reply(response.output);
		});
		message.channel.stopTyping();

		return;
	}
	
	// Train some messages for the bot!
    	let chatID = message.id;
    	if(!db[chatID]) {
    		// Create new chain for new message
    		db[chatID] = markov.createChain();
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
