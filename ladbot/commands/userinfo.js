/*
Fetches userdata/server-member data regarding a certain user (if specified), or
by default the author of the method call.
*/

exports.run = (client, message, args) => {
	const Discord = require("Discord.js");
	var user, gm;

	// If no arg is provided, just use the author
	if(!args[0]) {
		user = message.author;
		gm = message.guild.member(user);
	}
	else {
		// Otherwise, get the user mentined
		user = message.mentions.users.first();
		gm = message.guild.member(user);
	}
	
	// Get relevant attributes, first get some name info.
	let usertag = user.tag;
	let nickname = gm.nickname;
	
	// Get status stuff
	let status = user.presence.status;
	let statusText = "";
	switch(status) {
		case "online":
			statusText = "Chilling in online status.";
			break;
		case "offline":
			statusText = "MIA in offline status.";
			break;
		case "idle":
			statusText = "Passed out in idle status.";
			break;
		case "dnd":
			statusText = "Do not message this person!";
			break;
	}	
	
	// Calculate some interesting date stuff
	let joinedDiscordDate = user.createdAt;
	let joinedDiscordStr = user.createdAt.toDateString();
	let joinedServerDate = gm.joinedAt;
	let joinedServerStr = gm.joinedAt.toDateString();
	let createdDays, joinedDays;
	const ONE_DAY = 1000*60*60*24;
	let nowMS = Date.now();
	let createdMS = joinedDiscordDate.getTime();
	let joinedMS = joinedServerDate.getTime();
	let createdDiff = Math.abs(nowMS-createdMS);
	let joinedDiff = Math.abs(nowMS-joinedMS);
	createdDays = Math.round(createdDiff/ONE_DAY);
	joinedDays = Math.round(joinedDiff/ONE_DAY);
	
	// Get role information
	let roles = gm.roles.array().slice(1);	// Avoid @everyone role
	let rolesText = "";
	if(roles.length < 1) {
		rolesText = "None";
	}
	else {
		let role;
		for(let i = 0; i < roles.length; i++) {
			role = roles[i].name;
			if(i != roles.length-1) {
				rolesText += role + ", ";
			}
			else {
				rolesText += role;
			}
		}
	}

	// Get ID, avatar, and color information
	let id = user.id;
	let avatarURL = user.avatarURL;
	let color = gm.displayColor;

	// Start building an the embed
	let embed = new Discord.RichEmbed()
		.setDescription(statusText)
		.setThumbnail(avatarURL)
		.setColor(color)
		.setFooter("User ID: " + id)
		.addField("Joined Discord on", joinedDiscordStr
				  + "\n(" + createdDays + " days ago!)", false)
		.addField("Joined this server on", joinedServerStr
			      + "\n(" + joinedDays + " days ago!)", false)
		.addField("Roles", rolesText, false);

	// Set nickname if it exists
	if(nickname){
		embed.setTitle(usertag + " aka " + nickname);
	}
	else {
		embed.setTitle(usertag);
	}

	// I ship it.
	return message.channel.send({embed});
}