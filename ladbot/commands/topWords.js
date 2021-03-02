const fs = require("fs");
const async = require("async");

exports.run = async (client, message, args) => {
   // Only run if me
   if (message.author.id !== client.config.ids.ownerID) {
    console.log(client.config.ids.ownerID);
    return message.reply(" nice try, lol :sunglasses:");
  }

  // get #yunglads channel
  const yunglads = client.channels.cache.get(client.config.ids.youngladsID);

  /**
   currently, there is no way to use the discord search bar (using FROM tag)
   via the discord js api (or discord api in general), so we'll have to
   manually filter messages like before.
  
   @args[1] - input oldest msg ID to start from, manually obtained
   */
  let counter = 0;
  let done = false;
  let msgID = parseInt(args[0]);   
  const userDB = [];
  const rankings = new Map();
  async.whilst(
    /**
     grab as many messages as we can for a user.
     set upper bound to a shitton of messages till we error out.
     */
    function test(cb) { cb(null, counter < 10 && done === false); },
    function iter(callback) {
      const options = {limit: 100, after: msgID};
      // fetch from our #yunglads channel
      yunglads.messages.fetch(options)
          .then((messages) => {
            // get our messages array -- filter out bad messages.
            const msgArray = messages.array().reverse();
            if (msgArray.length > 0) {
              // update msgID with the last message in this block
              msgID = messages.first().id;
  
              // loop through each message fetched so far
              for (let i = 0; i < msgArray.length; i++) {
                const msg = msgArray[i];
                // only continue if this is our guy.
                // also do some filtering.
                if (msg.content.charAt(0) !== "!" && !msg.content.includes("https://")) {
                  // add if first message.
                  if (userDB.length < 1) {
                    userDB.unshift(msg);
                  }
                  // chain messages that were sent by same guy.
                  else if (i > 0 && msg.author === msgArray[i-1].author) {
                    userDB[0].content += `. ${msg.content}`;
                  }
                  // add message regardless. we will filter out short messages later.
                  else {
                    userDB.unshift(msg);
                  }

                  // add message's words to rankings.
                  console.log(userDB[0].content);
                }
              }
            } else {
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
    function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(rankings);

      // // save to disk in gpt-2 format, as a .csv
      // message.channel.send(`Now writing messages to ${name}.csv..`);
      // const stream = fs.createWriteStream(`../ladbot/data/train/datasets/${name}.csv`);
      // userDB.forEach((msg) => {
      //   // only add messages of 3 or more words
      //   let content = msg.content.split("\n").join("");
      //   if (content.split(" ").length > 0) {
      //     stream.write(`${content}\n`);
      //   }
      // });
      // stream.end();
      // message.channel.send(`Saved ${name}.csv`);
    },
  );
};