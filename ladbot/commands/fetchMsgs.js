/*
File used in populating the JSON database of old chat messages.
Using a semi-recent chat message ID, will loop backwards and fetch 100 messages
	at a time, until the specified counter is maxed.
Each message grabbed is merged into the text channel's specifc markov master chain.
*/

exports.run = (client, message, args) => {
	// We're going to need these
	const async = require("async");
	const fs = require("fs");
	const markov = require("../markov.js");
	const config = require("../config.json");

	if(message.author.id != config.ownerID) {
		return message.reply(" nice try, lol :sunglasses:");
	}

	// Setup the counter, some recent message ID, and the new database
	let counter = 0;	
	let msgID = 585972737915224067;
	let db = { };
	async.whilst(
		// We're going to grab the first 300k messages to start things off
		function test() {
			return counter < 3000;
		},
		// Grab the last 100 messages from the updating message ID
		function fetch(callback) {
			message.channel.fetchMessages({ limit: 100, before: msgID })
				.then(function(messages) {
					let msgText, msgAuthor, channelID;
					let msgArray = messages.array();
					// Update msgID with the last message in this block
					msgID = messages.last().id;
					// Now, we loop over each fetched message
					msgArray.forEach(function(msg) {
						msgText = msg.content;
						msgID = msg.id;
						msgAuthor = msg.author;
						channelID = msg.channel.id;
						// Only generate a chain from this message if its text only, 
						// we aren't looking at another bot's wacky message
						if(msgText && !msgAuthor.bot && msgText.charAt(0) !== '!')   {
							console.log(msgText);
							// Create new chain
							if(!db[channelID]) {
								db[channelID] = markov.createChain();
							}
							// Now merge this message into the chain
							markov.mergeSentence(db[channelID], msgText);
						}
					});
				})
				.catch(console.error);
			// Keep goin
			counter++;
			setTimeout(callback, 500);
		},
		// Call this on completion
		function callback(err) {
			if(err) {
				console.log(err);
				return;
			}
			// Save it all 
			let fileContents = JSON.stringify(db);
			fs.writeFileSync(config["database"], fileContents);
			console.log("And now, we're done.");
		}
	);
}
