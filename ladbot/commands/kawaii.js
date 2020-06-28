/**
 Will post a random anime-esque imgur/tenor link to the server.
 */

const fs = require("fs");

exports.run = (client, message) => {
  // Get the animelinks array from the config file, then get a random link
  const animelinks = JSON.parse(fs.readFileSync(client.config.animelinks));
  const randLink = animelinks[Math.floor(Math.random() * animelinks.length)];

  // Create embed!
  const embed = {
    embed: {
      title: "So kawaii! (ﾉ>ω<)ﾉ :｡･::･ﾟ’★,｡･::･ﾟ’☆",
      color: 16761035,
      image: {
        url: randLink,
      },
      footer: {
        text: "Thank you Travis and Jackson (◠‿◠✿)",
      },

    },
  };

  return message.channel.send(embed);
};
