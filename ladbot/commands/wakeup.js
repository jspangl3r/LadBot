/*
Will ping (mention) a user 10 times in an attempt to "wake" the user up.
*/

exports.run = (client, message, args) => {
	var user = args[0];
	for(var i = 0; i < 10; i++) {
		message.channel.send("Wakeup " + user + " !");
	}
	return;
}
