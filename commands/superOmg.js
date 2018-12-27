// Will create a custom, very angry, message composted of random strings

exports.run = (client, message, args) => {
	const omgs = ["bro....", "jesus fucking christ...", "fucking shave flynn...",
				  "im going to fucking rope...", "ill fucking do it i swear...",
			      "nty...", "w.e...", "wtf...", "bruh...", "fucking degenerate...",
			      "what a nutter...", "bro...chill...", "*fuck*...", "fucking *fuck...*",
				  "what the..."];
	
	var omgMsg = "";
	for(var i = 0; i < 10; i++) {
		omgMsg += omgs[Math.floor(Math.random() * omgs.length)];
	}
	
	return message.channel.send(omgMsg);
}
