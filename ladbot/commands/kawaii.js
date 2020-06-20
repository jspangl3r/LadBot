/**
 Will post a random anime-esque imgur/tenor link to the server.
 */

exports.run = (client, message, args) => {
	const fs = require("fs");

	// Get the animelinks array from the config file, then get a random link
	const animelinks = JSON.parse(fs.readFileSync(client.config.animelinks));
	let randLink = animelinks[Math.floor(Math.random() * animelinks.length)];
	
	// Create embed!
	let embed = {
    	"embed": {
	    "title": "So kawaii! (ﾉ>ω<)ﾉ :｡･::･ﾟ’★,｡･::･ﾟ’☆",
	    "color": 16761035,
	    "image": {
	      "url": randLink
	    },
	    "footer": {
	      "text": "Thank you Travis and Jackson (◠‿◠✿)"
	    },
	    
	  }
	};
	
	return message.channel.send(embed);
}
