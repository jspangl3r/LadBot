// Will change the bot's status to a random one from the array in index.js

exports.run = (client, message, args) => {
	const customActivities = ["Finally shaving Flynn's stache", "This discord sucks",
						  "Asking if Jeremy is okay", "Let a nigga sleep, cuz", "Dreaming about Manny",
					      "Getting a Switch + Smash ultimate", "Fucking dying", "Travis is black",
						  "Bruh", "Manny has fucking died", "Getting pussy with Chris", "Snapchatting like Jackson",
						  "Posting excessive memes", "Playing either Sicko Mode or Mo Bamba", "Going to McD"];

	var randStatus = customActivities[Math.floor(Math.random() * customActivities.length)];
	client.user.setActivity(randStatus);	

	return message.channel.send("New activity set <:bruh:517226415725346827>");
}
