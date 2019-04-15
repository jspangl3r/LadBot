/*
Brings a nice meme to the channel, as per requested by some lad.
*/

exports.run = (client, message, args) => {
	let adopted = client.config.adopted;
	return message.channel.send(adopted);
}
