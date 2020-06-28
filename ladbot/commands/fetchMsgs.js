/**
 File used in populating the JSON database of old chat messages.
 Using a semi-recent chat message ID, will loop backwards and fetch 100 messages
 at a time, until the specified counter is maxed.
 Each message grabbed is merged into the text channel's specifc markov master chain.
 */

const async = require("async");
const fs = require("fs");
const markov = require("../markov.js");
const config = require("../data/config.json");

exports.run = (client, message) => {
  // Only run if me
  if (message.author.id !== config.ownerID) {
    return message.reply(" nice try, lol :sunglasses:");
  }

  // Setup the counter, some recent message ID, and the new database
  let counter = 0;
  let msgID = 585972737915224067;
  const db = {};
  async.whilst(
      // We're going to grab the first 300k messages to start things off
      () => counter < 3000,
      // Grab the last 100 messages from the updating message ID
      (callback) => {
        message.channel.fetchMessages({limit: 100, before: msgID})
            .then((messages) => {
              let msgText; let msgAuthor; let
                channelID;
              const msgArray = messages.array();
              // Update msgID with the last message in this block
              msgID = messages.last().id;
              // Now, we loop over each fetched message
              msgArray.forEach((msg) => {
                msgText = msg.content;
                msgID = msg.id;
                msgAuthor = msg.author;
                channelID = msg.channel.id;
                // Only generate a chain from this message if its text only,
                // we aren't looking at another bot's wacky message
                if (msgText && !msgAuthor.bot && msgText.charAt(0) !== "!") {
                  console.log(msgText);
                  // Create new chain
                  if (!db[channelID]) {
                    db[channelID] = markov.createChain();
                  }
                  // Now merge this message into the chain
                  markov.mergeSentence(db[channelID], msgText);
                }
              });
            })
            .catch(console.error);
        // Keep goin
        counter++;
        setTimeout(callback, 500);
      },
      // Call this on completion
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
        // Save it all
        const fileContents = JSON.stringify(db);
        fs.writeFileSync(config.database, fileContents);
        console.log("And now, we're done.");
      },
  );
};
