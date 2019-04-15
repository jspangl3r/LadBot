/*
Infrastructure file that sets up the bot.
*/

// Stuff we're gonna need
const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const config = require("./config.json");
const ladbot = require("./ladbot.js");
const client = new Discord.Client();

// Make sure config is attached to client so it is accessible everywhere
client.config = config;

// Load up markov database
let db = { };
try {
	let fileContents = fs.readFileSync(config.database);
	db = JSON.parse(fileContents);
	console.log("Database loaded.");
}
catch(err) {
	console.log(err);
}

/*
Setup functions to manage the JSON database saving
These functions can be modified to setup auto-save intervals to your liking
*/
function save() {
	let fileContents = JSON.stringify(db);
	fs.writeFileSync(config["database"], fileContents);
	console.log("Database has been saved.");

}
function saveTimer() {
	save();
	setTimeout(saveTimer, config["auto-save-interval"]*1000);
}
if(config["auto-save"]) {
	console.log("Auto save is on.");
	setTimeout(saveTimer, config["auto-save-interval"]*1000);
}

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
	let customActivities = config.customActivities;
	let randStatus = customActivities[Math.floor(Math.random() * customActivities.length)];
	client.user.setActivity(randStatus);
});

// On a read message in the chat, do something!
client.on("message", (message) => {
	ladbot.onMessage(client, message, db);
});
