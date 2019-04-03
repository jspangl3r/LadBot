// Goal: fetch all past messages into a Discord.js Collection object

exports.run = (client, message, args) => {
	// We're going to need these
	const async = require("async");
	const fs = require("fs");
	const config = require("../config.json");

	// Setup the counter, some recent message ID, and the new database
	let counter = 0;	
	let msgID = 562996444517367818;
	let db = { };
	async.whilst(
		// We're going to grab the first 10k messages to start things off
		function test() {
			return counter < 10000;
		},
		// Grab the last message from the updating message ID
		function fetch(callback) {
			message.channel.fetchMessages({ limit: 1, before: msgID })
				.then(function(messages) {
					msgText = messages.first().content;
					msgID = messages.first().id;
					// Only store this message if it isn't blank (a picture?)
					if(msgText) {
						console.log(msgText);
						db[msgID] = msgText;
					}
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
