// Constants / imports
const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./config.json");

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
	youtubeKey: config.youtubeKey 
});

console.log("Logging into discord...");

// Login bot to discord
client.login(config.token);
