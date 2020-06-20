/**
 Method to collect some amount of messages for a particular user and save them
 to a JSON file. Note the channel we get these messages from depend on where
 this method was called (likely #yunglads text channel).
 */

exports.run = (client, message, args) => {
	// we're going to need these
	const async = require("async");
	const fs = require("fs");
	const config = require("../data/config.json");

	if(message.author.id != config.ownerID) {
		return message.reply(" nice try, lol :sunglasses:");
    }
    
    // some data on the user we're getting messages for
    let authID = args[0].replace("<@!", "").replace(">", "");
    let name = message.author.tag;  // wtf is this
    //console.log(name);

    /**
     currently, there is no way to use the discord search bar (using FROM tag) 
     via the discord js api (or discord api in general), so we'll have to 
     manually filter messages like before.
     */
    let counter = 0;
    let done = false;
    let msgID = 719216519996899420  // set this to a recent msg ID of target
    let userDB = [];
    async.whilst(
        /**  
         grab as many messages as we can for a user.
         it seems like most users on the lads server have no more than 80k.
         */
       function test() {
           return counter < 10000 && done == false;
       },
       // while we fetch
       function fetch(callback) {   
           let options = { limit : 100, before : msgID };
           message.channel.fetchMessages(options)
           .then(messages => {
                let msgArray = messages.array();
                // update msgID with the last message in this block
                try {
                    //console.log(messages);
                    msgID = messages.last().id;
                    // now loop over each fetched message
                    msgArray.forEach(msg => {
                        /**
                         only add a message to our userDB if it belongs to our guy
                         and the message isnt a command
                        */
                        if(msg.author.id === authID && msg.content && msg.content.charAt(0) !== "!") {
                            userDB.push(msg.content);
                        }
                    });
                } 
                catch(err) {
                    // at this point, notify that we're ready to save
                    done = true;
                }
            })
            .catch(console.error);
            // keep iterating
            counter++;
            setTimeout(callback, 500);
       },
       // upon completion
       function callback(err) {
            if(err) {
				console.log(err);
				return;
            }
            // save to disk in gpt-2 format
            let stream = fs.createWriteStream(name + ".json", {flags : "a"});
            userDB.forEach(msg => {
                stream.write(msg);
                stream.write("\n<|endoftext|>\n");
            });
            stream.end()
            console.log("Saved this users messages");
       }
    );
}