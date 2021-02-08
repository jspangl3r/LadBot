/**
 * Tree.
 */

const fs = require("fs");

exports.run = (client, message, args) => {
  const trees = JSON.parse(fs.readFileSync(client.config.trees));
  let msg = "";
  let i = 0;
  while (i < 7) {
    let tree = trees[Math.floor(Math.random() * trees.length)];
    if(!msg.includes(tree)) {
      msg += `${tree}. `;
      i++;
    }
  }
  return message.channel.send(msg);
};
