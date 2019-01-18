// Constants / imports
const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./config.json");
const customActivities = ["Finally shaving Flynn's stache", "This discord sucks",
						  "Asking if Jeremy is okay", "Let a nigga sleep, cuz", "Dreaming about Manny",
					      "Getting a Switch + Smash ultimate", "Fucking dying", "Travis is black",
						  "Bruh", "Manny has fucking died", "Getting pussy with Chris", "Snapchatting like Jackson",
						  "Posting excessive memes", "either Sicko Mode or Mo Bamba", "Going to McD",
						  "Crushing my greasy cock and balls with a rock", "Bumping to the goat, Carti"];

// Make sure config is attached to client so it is accessible everywhere
client.config = config;

// Load all event js files
fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		const event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, event.bind(null, client));
		});
});

// Load all command js files
client.commands = new Enmap();
fs.readdir("./commands/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith(".js")) return;
		let props = require(`./commands/${file}`);
		let commandName = file.split(".")[0];
		console.log(`Attempting to load command ${commandName}`);
		client.commands.set(commandName, props);
	});
});

// Start Musicbot stuff
client.music = require("discord.js-musicbot-addon");
client.music.start(client, {
	youtubeKey: config.youtubeKey, 
	anyoneCanSkip : true,
	musicPresence : true,
	clearPresence : true
});

// Login bot to discord
console.log("Logging into discord...");
client.login(config.token);

// On login
client.on("ready", () => {
	console.log("Logged into discord!");
	var randStatus = customActivities[Math.floor(Math.random() * customActivities.length)];
	client.user.setActivity(randStatus);
});
