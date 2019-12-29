/*
Infrastructure file that sets up the bot.
*/

// Stuff we're gonna need
const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const config = require("./data/config.json");
const ladbot = require("./ladbot.js");
const client = new Discord.Client();

/*
Make sure config is attached to client so it is accessible everywhere.
Also, setup a count to determine when to auto-restart the bot.
*/
let count = 0;		
const RESTART_AT = 5;	
client.config = config;

// Load up markov database
let db = { };
try {
	db = JSON.parse(fs.readFileSync(config.database));
	console.log("Database loaded.");
}
catch(err) {
	console.log(err);
}

/*
Setup functions to manage the JSON database saving
These functions can be modified to setup auto-save intervals to your liking
*/
function restart() {
	client.destroy();
	client.login(config.token);
	console.log("Bot has been restarted.\n");
}
function save() {
	fs.writeFileSync(config["database"], JSON.stringify(db));
	console.log("Database has been saved.");
}
function saveTimer() {
	save();
	setTimeout(saveTimer, config["auto-save-interval"]*1000);
	count++;

	// Check to see if we should restart
	if(count == RESTART_AT) {
		count = 0; 	
		restart();
	}
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
	let customActivities = JSON.parse(fs.readFileSync(client.config.customActivities));
	let randStatus = customActivities[Math.floor(Math.random() * customActivities.length)];
	client.user.setActivity(randStatus);
});

// On a read message in the chat, do something
client.on("message", (message) => {
	ladbot.onMessage(client, message, db);
});
