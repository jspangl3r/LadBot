const fs = require("fs");

exports.run = (client, message, args) => {
  // Get random mimic and text
  const mimics = JSON.parse(fs.readFileSync(client.config.mimics));
  const randMimic = mimics[Math.floor(Math.random() * mimics.length)];
  const path = `./data/train/datasets/${randMimic}/${randMimic}.json`;
  const dataset = JSON.parse(fs.readFileSync(path));
  const text = dataset[Math.floor(Math.random() * dataset.length)]

  return message.channel.send(`[${randMimic}] ${text}`);
}