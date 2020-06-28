/**
 Will ping (mention) a user 10 times in an attempt to "wake" the user up.
 */

exports.run = (client, message, args) => {
  const user = args[0];
  for (let i = 0; i < 10; i++) {
    message.channel.send(`Wakeup ${user} !`);
  }
};
