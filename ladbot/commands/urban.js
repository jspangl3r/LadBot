/**
 Fetches an urban dictionary definition for a given word.
 User can select from 1-10 different definitions for that word.
 */
exports.run = (client, message, args) => {
	const Discord = require("discord.js");
	const https = require("https");
	const fs = require("fs");

	// Make sure a term is given
	if(!args[0]) {
		return message.reply("Please enter a term to search for and also a definition choice from 1 - 10.");
	}

	/*
	 Due to the nature of the commands parser in ladbot.js, form the searched
	 term from the entire message's content.
	 Concurrently, check for the definition # (default to 0).
	 */
	const cmdPart = "!urban";
	let search = "";
	let num = 0;
	let loopAll = args.length+1;
	let splitMsg = message.content.split(' ');
	if(Number.isInteger(parseInt(args[args.length-1]))) {
		loopAll -= 1;
		num = args[args.length-1]-1;
	
		// Check num
		if(num < 0 || (num+1) > 10) {
			return message.channel.send("Send only a number 1-10.");
		}
	}

	// Build up search terms.
	for(let i = 1; i < loopAll; i++) {
		search += splitMsg[i] + "%20";
	}
	search = search.slice(0, search.length-3);

	// Using the search term, we can now do an HTTP request
	let options = {
		host: 'api.urbandictionary.com',
		path: '/v0/define?term=' + search,
		method: 'GET'
	};
	let callback = (response) => {
		let data = '';
		// Compile data as we get it
		response.on('data', (chunk) => {
			data += chunk;
		});
		// Get data we want and then build the embed
		response.on('end', () => {
			/**
			 The retrieved data object should be a JSON with an attached array to it
			 containing a list of definition JSON objects.
			 */
			let list = JSON.parse(data).list;

			/**
			 Create array of 10 definitions, then grab the one the user requested.
			 */
			let defs = new Array(10);
			for(let i = 0; i < 10; i++) {
				defs[i] = list[i];
			}
			let d;
			try {
				d = list[num];
			}
			catch(e) {
				return message.channel.send("Unable to find a definition for that " +
				                            "number.");
			}

			// Make sure stuff exists before creating embed
			if (!d.author || !d.thumbs_up || !d.thumbs_down) {
				return message.channel.send("Unable to find parameters for that definition, " +
				                            "please try a different word.");
			}

			// Using these JSONs, lets build something cool
			let embed = new Discord.RichEmbed()
				.setTitle("Defintion " + (num+1) + " of 10 - " + "\"" + d.word + "\":")
				.setDescription(d.definition.replace(/\[|\]/g, '').substring(0, 2048))
				.setColor(1975097)
				.setThumbnail(JSON.parse(fs.readFileSync(client.config.projectpics))["urbanPicURL"])
				.addField("Author: ", d.author)
				.addField(":thumbsup: ", d.thumbs_up, true)
				.addField(":thumbsdown: ", d.thumbs_down, true)
				.addField("Example: ", d.example.replace(/\[|\]/g, '').substring(0, 256), true)

			return message.channel.send({embed});
		});
	}
	let request = https.request(options, callback).end();
}
