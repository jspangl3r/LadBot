/**
 Will create a custom, very angry, message composted of random strings.
 */

exports.run = (client, message, args) => {
	var omgs = ["bro....", "jesus fucking christ...", "fucking shave flynn...",
		"im going to fucking rope...", "ill fucking do it i swear...",
		"nty...", "w.e...", "wtf...", "bruh...", "fucking degenerate...",
		"what a nutter...", "bro...chill...", "fuck...", "fucking fuck...",
		"what the...", "yo niBBA!!!", "bout 2 pop ur ass..", "yo lemme suc..", "bruh i finna",
		"ur ded bro", "fucking jeremy..", "matt head", "god Damn..."];

	let omgMsg = "";
	let omg = "";
	let omg2 = "";
	for (var i = 0; i < 10; i++) {
		omg = omgs[Math.floor(Math.random() * omgs.length)];
		for (var letter of omg) {
			if (Math.random() > 0.75) {
				omg2 += letter.toUpperCase();
			}
			else {
				omg2 += letter;
			}
		}
		omgMsg += omg2 + " ";
		omg2 = "";
		omgs.splice(i, 1);
	}
	return message.channel.send(omgMsg);
}
