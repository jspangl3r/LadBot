/*
Will create a custom, very angry, message composted of random strings.
*/

exports.run = (client, message, args) => {
	const omgs = client.config.omgs;
	var omgMsg = "";
	for(var i = 0; i < 10; i++) {
		omgMsg += omgs[Math.floor(Math.random() * omgs.length)];
	}
	return message.channel.send(omgMsg);
}
