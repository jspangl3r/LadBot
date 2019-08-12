/*
Brings a nice meme to the channel, as per requested by some lad.
*/

exports.run = (client, message, args) => {
	let adopted = "╭━━━━━━━╮ \n┃　　● ══　 █ ┃\n ┃██████████┃ \n┃██████████┃ \n┃██████████┃ \n┃█ ur adopted. █┃\n ┃█ -Mom&Dad █┃ \n┃██████████┃ \n┃██████████┃ \n┃██████████┃ \n┃　　　○　　　 ┃\n ╰━━━━━━━╯"
	return message.channel.send(adopted);
}
