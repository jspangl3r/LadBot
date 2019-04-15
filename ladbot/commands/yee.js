/*
Yee
*/

exports.run = (client, message, args) => {
	let yee = client.config.yee;
	return message.channel.send(yee);
}
