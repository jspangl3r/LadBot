exports.run = (client, message, args) => {
	const Discord = require("Discord.js");
	const quoteHelp = require("../quoteHelp.js");

	// Get quotes array
	let arr = client.config.quotes;

	// Get quote and break it up into relevant parts
	let quoteArr = arr[Math.floor(Math.random() * arr.length)].split("-");
	let quoteText = quoteArr[0].trim();
	let quoteAuth = quoteArr[1].trim();
	
	// Format text if needed
	let txt = "*" + quoteHelp.getParagraph(quoteText.split(" "), 25) + "*";

	// Build discord embed
	let color = Math.floor((Math.random()*16777214)+1);
	let embed = new Discord.RichEmbed()
		.setDescription(txt)
		.setColor(color)
		.setFooter("- " + quoteAuth)
	
	// Ship.
	return message.channel.send({embed});
}
