exports.run = (client, message, args) => {
	const Discord = require("Discord.js");
	const https = require("https");

	// Make sure a term is given
	if(!args[0]) {
		return message.reply("Please enter a term to search for and also a definition choice from 1 - 10.");
	}
	// Check for definition choice
	let num;
	if(args[1]) {
		num = args[1]-1;
	}
	else {
		num = 0;
	}

	/* 
	Due to the nature of the commands parser in ladbot.js, form the searched
	term from the entire message's content
	*/
	const cmdPart = "!urban";
	let search = message.content.split(' ')[1];

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
			/*
			The retrieved data object should be a JSON with an attached array to it
			containing a list of definition JSON objects. 
			*/
			let list = JSON.parse(data).list;

			/*
			Create array of 10 definitions, then grab the one the user requested.
			*/
			let defs = new Array(10);
			for(let i = 0; i < 10; i++) {
				defs[i] = list[i];
			}
			let d = list[num];
			
			// Using these JSONs, lets build something cool
			let embed = new Discord.RichEmbed()
				.setTitle("Defintion " + (num+1) + " of 10 - " + "\"" + d.word + "\":")
				.setDescription(d.definition.replace(/\[|\]/g, ''))
				.setColor(1975097)
				.setThumbnail(client.config.urbanPicURL)
				.addField("Author: ", d.author)
				.addField(":thumbsup: ", d.thumbs_up, true)
				.addField(":thumbsdown: ", d.thumbs_down, true)
				.addField("Example: ", d.example.replace(/\[|\]/g, ''), true)
				
			return message.channel.send({embed});
		});
	}
	// Call request
	let request = https.request(options, callback).end();
}