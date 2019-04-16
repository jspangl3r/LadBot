/*
Will post a random anime-esque imgur/tenor link to the server.
*/

exports.run = (client, message, args) => {
	const animeLinks = client.config.animeLinks;
	let randLink = animeLinks[Math.floor(Math.random() * animeLinks.length)];
	let embed = {
    	"embed": {
	    "title": "A bitch:",
	    "color": 16761035,
	    "image": {
	      "url": randLink
	    },
	    "footer": {
	      "text": "Thank you Travis"
	    },
	    
	  }
	};
	
	return message.channel.send(embed);
}
