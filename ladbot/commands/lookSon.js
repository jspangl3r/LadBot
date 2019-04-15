/*
Will send a saddening picture of a man and his son pointing to something in the near distance.
*/

exports.run = (client, message, args) => {
	let lookSon1 = client.config.lookSon1;
	let lookSon2 = client.config.lookSon2;
	return message.channel.send(lookSon1 + lookSon2);
}
