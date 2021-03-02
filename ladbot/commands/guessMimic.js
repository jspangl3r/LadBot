const fs = require("fs");

exports.run = (client, message, args) => {
  const mimics = JSON.parse(fs.readFileSync(client.config.mimics));

  // Choose a random mimic-er.
  const randMimic = mimics[Math.floor(Math.random() * mimics.length)];
  const path = `./data/train/datasets/${randMimic}/${randMimic}.json`;
  const dataset = JSON.parse(fs.readFileSync(path));
  const text = dataset[Math.floor(Math.random() * dataset.length)];

  // Start a message collector to collect guesses.
  const filter = (msg) => !msg.author.bot;
  const collector = message.channel.createMessageCollector(filter, { time: 15000 });
  message.channel.send(`Guess the mimic:\n"${text}"`);

  // Read through guesses
  let gameOver = false;
  collector.on("collect", (msg) => {
    if (msg.content === randMimic || randMimic.toLowerCase().includes(msg.content.toLowerCase())) {
      gameOver = true;
      collector.stop();
      return msg.reply(`U got it! Mimic was ${randMimic}.`);
    }
  });
  collector.on("end", () => {
    if (!gameOver) {
      return message.channel.send(`Y'all suck, mimic was ${randMimic}`);
    }
  });
}