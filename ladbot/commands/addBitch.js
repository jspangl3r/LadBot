/*
Adds a new anime-esque image to one of the bot's databases
*/

exports.run = (client, message, args) => {
	const fs = require("fs");

	// Snag the link, do some defensive programming!
	const ERROR = "Make sure to provide a link that ends in .gif, .jpg, or .png"
	let link = args[0];
	if(!link) {
		return message.reply(ERROR);
	}

	// Make sure link ends in either .gif, .jpg, or .png
	let end = link.slice(link.length-4, link.length).trim();
	if( !(end === ".gif" || end === ".jpg" || end === ".png") ) {
		return message.reply(ERROR);
	}

	// Make sure only Travis is adding 
	let authorID = message.author.id;
	let travID = client.config.travID;
	let jackID = client.config.jackID;
	if( !(authorID == travID || authorID == jackID) ) {
		return message.reply("You are not Travis or possibly Jackson :rage:");
	}

	// See if this bitch has already been added
	let arr = JSON.parse(fs.readFileSync(client.config.animelinks));
	for(let i = 0; i < arr.length; i++) {
		if(link === arr[i]) {
			return message.reply("It appears this bitch has already been added.");
		}
	}

	// Now update the animeLink json array in config file
	arr.push(link);
	fs.writeFileSync(client.config["animelinks"], JSON.stringify(arr));

	// Now restart the bot to get updated file
	client.destroy();
	client.login(client.config.token);
	console.log("Bot has been restarted.\n");

	return message.reply("Your bitch has been added, the bot will now restart.");
}