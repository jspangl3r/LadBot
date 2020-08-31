/**
 * Add weed.
 */

const fs = require("fs")

exports.run = (client, message, args) => {
  let msg;
  try {
    msg = message.content.split(".addTree ")[1].trim();
  }
  catch(e) {
    return message.reply("```.addTree [tree message]```");
  }

  const arr = JSON.parse(fs.readFileSync(client.config.trees));
  for (let i = 0; i < arr.length; i++) {
    if (msg === arr[i]) {
      return message.reply("Bro this weed message is already in here");
    }
  }

  arr.push(msg);
  fs.writeFileSync(client.config.trees, JSON.stringify(arr));
  message.reply("Added weed message, bot will now restart");

  // Now restart the bot to get updated file
  client.destroy();
  client.login(client.config.token);
  console.log("Bot has been restarted.\n");

  return;
};