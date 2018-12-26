// This event handles the reading of every message received in the server
// This includes mentions (Cleverbot)

module.exports = (client, message) => {
	// Cleverbot stuff
	var Cleverbot = require("cleverbot-node");
	cleverbot = new Cleverbot;
	cleverbot.configure({botapi: "CCCkuYdUalEL5JP4RAgWQxXU6NA"});

	// Ignore all bots
	if(message.author.bot)
		return;

	// Check to see if the bot was mentioned
	if(message.content.match(client.config.botID)) {
		var msg = message.content.slice(client.config.botID.length+1);

		// Invoke Cleverbot with message text
		message.channel.startTyping();
		cleverbot.write(msg, function (response) {
			message.reply(response.output);
		});
		message.channel.stopTyping();

		return;
	}

	// At this point, ignore messages not starting with the prefix '!'
	if(message.content.indexOf(client.config.prefix) !== 0)
		return;

	// Separate message into args and command
	const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
	const command = args.shift();

	// Get command data from the commands Enmap in index.js
	const cmd = client.commands.get(command);
	
	// If command doesn't exist, silently exit and do nothing
	if(!cmd)
		return;
	
	// Otherwise, run the comand
	cmd.run(client, message, args);
};
