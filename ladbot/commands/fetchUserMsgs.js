/**
 Method to collect some amount of messages for a particular user and save them
 to a JSON file. Note the channel we get these messages from depend on where
 this method was called (likely #yunglads text channel).
 */

const fs = require("fs");
const async = require("async");

exports.run = (client, message, args) => {
  // Only run if me
  if (message.author.id !== client.config.ownerID) {
    return message.reply(" nice try, lol :sunglasses:");
  }

  // get #yunglads channel
  const yunglads = client.channels.get(client.config.youngladsID);

  // some data on the user we're getting messages for
  // get non-#-non-space name.
  const authID = args[0].replace("<@!", "").replace(">", "");
  const name = message.author.tag.split(" ")[0];

  /**
     currently, there is no way to use the discord search bar (using FROM tag)
     via the discord js api (or discord api in general), so we'll have to
     manually filter messages like before.
     */
  let counter = 0;
  let done = false;
  let msgID = 719216519996899420; // set this to a recent msg ID of target
  const userDB = [];
  async.whilst(
      /**
         grab as many messages as we can for a user.
         it seems like most users on the lads server have no more than 80k.
         */
      () => counter < 1000 && done === false,
      // while we fetch
      (callback) => {
        const options = {limit: 100, before: msgID};
        // fetch from our #yunglads channel
        yunglads.fetchMessages(options)
            .then((messages) => {
              const msgArray = messages.array();
              // update msgID with the last message in this block
              try {
                // console.log(messages);
                msgID = messages.last().id;
                // now loop over each fetched message
                for (let i = 0; i < msgArray.length; i++) {
                  const msg = msgArray[i];
                  /**
                              only add a message to our userDB if it belongs to our guy
                              and the message isnt a command
                              */
                  if (msg.author.id === authID && msg.content && msg.content.charAt(0) !== "!") {
                    // TODO add more filtering
                    if (!msg.content.includes("https://")) {
                      // See if this message is a consecutive message from the same author.
                      // If so, clump the message together with previous
                      if (i > 0 && msg.author === msgArray[i - 1].author) {
                        userDB[0].content = `${msg.content}. ${userDB[0].content}`;
                      } else {
                        userDB.unshift(msg);
                      }
                    }
                  }
                }
              } catch (err) {
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
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
        // save to disk in gpt-2 format
        const stream = fs.createWriteStream(`../learn/train_data/${name}.json`, {flags: "a"});
        userDB.forEach((msg) => {
          stream.write(msg.content);
          stream.write("\n<|endoftext|>\n");
        });
        stream.end();
        console.log("Saved this users messages");
      },
  );
};
