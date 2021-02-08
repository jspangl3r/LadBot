/**
 * Adds a new anime-esque image to one of the bot's databases
 */

const fs = require("fs");

exports.run = (client, message, args) => {
  // Snag the link, do some defensive programming!
  const ERROR = "Make sure to provide a link that ends in .gif, .jpg, .jpeg, .png";
  const link = args[0];
  if (!link) {
    return message.reply(ERROR);
  }

  // Make sure link ends in either .gif, .jpg, or .png
  const end = link.slice(link.length - 4, link.length).trim();
  if (!(end === ".gif" || end === ".jpg" || end === ".png" || end === ".jpeg")) {
    return message.reply(ERROR);
  }

  // Make sure only Travis and Jackson can add
  const authorID = message.author.id;
  const trav = client.config.ids.travID;
  const jack = client.config.ids.jackID;
  if (!(authorID === trav || authorID === jack)) {
    return message.reply("You are not Travis or possibly Jackson :rage:");
  }

  // See if this bitch has already been added
  const arr = JSON.parse(fs.readFileSync(client.config.animelinks));
  for (let i = 0; i < arr.length; i++) {
    if (link === arr[i]) {
      return message.reply("It appears this bitch has already been added.");
    }
  }

  // Now update the animeLink json array in config file
  arr.push(link);
  fs.writeFileSync(client.config.animelinks, JSON.stringify(arr));
  message.reply("Your bitch has been added, the bot will now restart.");

  // Now restart the bot to get updated file
  client.destroy();
  client.login(client.config.token);
  console.log("Bot has been restarted.\n");

  return;
};
