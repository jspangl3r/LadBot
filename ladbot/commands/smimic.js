const fs = require("fs");

exports.run = (client, message, args) => {
  let msg;
  try {
    msg = message.content.split(".smimic ")[1].trim();
  }
  catch (e) {
    return message.reply("```!smimimc [entire mimic message with name]```");
  }

  const arr = JSON.parse(fs.readFileSync(client.config.savedMimics));
  for (let i = 0; i < arr.length; i++) {
    if (msg === arr[i]) {
      return message.reply("Bro this mimic is already in here");
    }
  }

  arr.push(msg);
  fs.writeFileSync(client.config.savedMimics, JSON.stringify(arr));
  message.reply("Added mimic message, bot will now restart");

  // Now restart the bot to get updated file
  client.destroy();
  client.login(client.config.token);
  console.log("Bot has been restarted.\n");

  return;
}