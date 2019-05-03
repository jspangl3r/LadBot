/*
Provides detailed information of the server from which the bot is
correspondingly residing on when invoked.
*/

exports.run = (client, message, args) => {
	const Discord = require("Discord.js");

	// Get relevant attributes
	let server = message.guild;
	let name = server.name;
	let dictator = server.owner.user.tag;
	
	// Calculate some interesting date stuff
	let createdDate = server.createdAt;
	let createdStr = server.createdAt.toDateString();
	const ONE_DAY = 1000*60*60*24;
	let createdMS = createdDate.getTime();
	let nowMS = Date.now();
	let diff = Math.abs(nowMS-createdMS);
	let days = Math.round(diff/ONE_DAY);
	
	// Get region info.
	let region = server.region;
	
	// Get number of types of channels
	let channels = server.channels.array();
	let voiceChannels = 0;
	let textChannels = 0;
	// Could probably do this in a cleaner way
	channels.forEach(function(c) {
		if(c.type === "voice") {
			voiceChannels++;
		}
		else if(c.type === "text") {
			textChannels++;
		}
	}); 
	
	let roles = server.roles.array().length;
	
	// Get number of online members
	let members = server.members.array();
	let totalMembers = server.memberCount;
	let onlineMembers = 0;
	// Could probably do this in a cleaner way
	members.forEach(function(m) {
		if(m.presence.status === "online") {
			onlineMembers++;
		}
	});
	
	// Get server ID and icon info.
	let id = server.id;
	let iconURL = server.iconURL;

	// Choose a pretty random color
	let color = Math.floor((Math.random()*16777214)+1);

	// Start building the embed
	let embed = new Discord.RichEmbed() 
		.setTitle(name)
		.setDescription("Around since " + createdStr + 
						" (" + days + " days ago!)")
		.setThumbnail(iconURL)
		.setColor(color)
		.setFooter("Server ID: " + id)
		.addField("Region", region, false)
		.addField("Users", onlineMembers + "/" + totalMembers, false)
		.addField("Text Channels", textChannels, false)
		.addField("Voice Channels", voiceChannels, false)
		.addField("Roles", roles, false)
		.addField("Owner", dictator, false)

	// Send that bad boy
	return message.channel.send({embed});
}