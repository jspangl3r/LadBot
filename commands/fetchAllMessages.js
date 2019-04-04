// Goal: fetch a certain number of past messages and compile it into a json "database"

exports.run = (client, message, args) => {
	// We're going to need these
	const async = require("async");
	const fs = require("fs");
	const config = require("../config.json");

	// Setup the counter, some recent message ID, and the new database
	let counter = 0;	
	let msgID = 563140663764582451;
	let db = { };
	async.whilst(
		// We're going to grab the first 10k messages to start things off
		function test() {
			return counter < 100;
		},
		// Grab the last 100 messages from the updating message ID
		function fetch(callback) {
			message.channel.fetchMessages({ limit: 100, before: msgID })
				.then(function(messages) {
					// Update msgID with the last message in this block
					msgID = messages.last().id;
					// Now, we loop over each fetched message
					let msgText, author;
					let msgArray = messages.array();
					msgArray.forEach(function(msg) {
						msgText = msg.content;
						msgID = msg.id;
						author = msg.author;
						// Only store this message if it isn't blank (a picture?) and
						// we aren't looking at another bot's wacky message
						if(msgText && !author.bot)   {
							console.log(msgText);
							db[msgID] = msgText;
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
