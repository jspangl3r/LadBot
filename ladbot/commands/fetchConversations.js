exports.run = (client, message, args) => {
    const async = require("async");
    const fs = require("fs");

    if(message.author.id != client.config.ownerID) {
        return message.reply(" nice try, lol :sunglasses:");
    }

    // Setup counter, average, and a recent message ID to start
    // Also setup conversation arrays
    let counter = 0;
    let fetchMsgID = 586280963315728411;
    let convoText = [];
    let convoObj = [];
    let conversations = []
    // Goal here is to grab 300k messages and determine the average time between each message
    async.whilst(
        function test() {
            return counter < 3000;
        },
        // Grab the last 100 messages from the updating message ID
        function fetch(callback) {
            message.guild.channels.get('96420935283793920').fetchMessages({ limit: 100, before: fetchMsgID })
                .then(function(messages) {
                    let msg, msgText, msgAuthor;
                    let msgArr = messages.array();
                    // Update msgID with the last message in this block
                    fetchMsgID = messages.last().id;
                    let timeOne, timeTwo;

                    // Loop over each fetched message (100 per fetch)
                    for(let x = 0; x < msgArr.length; x++) {
                        msg = msgArr[x];
                        msgText = msg.content;
                        msgAuthor = msg.author;

                        // Only proceed further if valid message
                        if( !(msgText && msgText.charAt(0) !== '!') ) {
                            continue;
                        }

                        // See if new conversation should be made
                        if(convoText.length != 0) {
                            timeOne = msg.createdAt.getMinutes();
                            timeTwo = convoObj[0].createdAt.getMinutes();   // Most recent message in current conversation
                            // If time difference <= 5, add this message to the current conversation array
                            if(Math.abs(timeOne - timeTwo) <= 5) {
                                console.log("Pushing another message onto this conversation");
                                console.log("--------------------------------------------");
                                // See if this message is a consecutive message from the same author. If so, clump the message together with the previous one
                                if(msg.author === convoObj[0].author) {
                                    convoText[0] = msg + ". " + convoText[0];
                                    convoObj.unshift(msg);
                                }
                                else {
                                    convoText.unshift(msgText);
                                    convoObj.unshift(msg);
                                }
                            }
                            // Otherwise, create a new conversation array to build off of
                            else {
                                // Save last convo before making new one
                                conversations.unshift(convoText);
                                console.log("Creating new conversation");
                                console.log(convoText);
                                console.log("--------------------------------------------");
                                convoText = [];
                                convoObj = [];
                                convoText.unshift(msgText);
                                convoObj.unshift(msg);
                            }
                        }
                        // Create new conversation
                        else {
                            console.log("Starting conversation collection");
                            console.log("--------------------------------------------");
                            convoText.unshift(msg.content);
                            convoObj.unshift(msg);
                        }   
                    }
                })
                .catch(console.error);
            // Keep iterating
            counter++;
            setTimeout(callback, 500);
        },
        // On completion
        function callback(err) {
            if(err) {
                console.log(err);
                return;
            }
            // All done, save stuff to config json then restart
            fs.writeFileSync(client.config["conversations"], JSON.stringify(conversations));
            client.destroy();
            client.login(client.config.token);
            console.log("Bot has been restarted.\n");

            return message.channel.send("Conversations accumulated, bot will now restart.");
        }
    );
}   