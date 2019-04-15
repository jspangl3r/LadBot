/*
Will post a random anime-esque imgur/tenor link to the server.
*/

exports.run = (client, message, args) => {
	const animeLinks = client.config.animeLinks;
	let randLink = animeLinks[Math.floor(Math.random() * animeLinks.length)];
	return message.channel.send(randLink);
}
