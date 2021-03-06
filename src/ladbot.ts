/**
 * Responsible for dealing with message events and some markov stuff.
 */
import { Client, Message } from "discord.js";
import config from "../data/config.json";
import { commands } from "./index";
import { createChain, mergeSentence } from "./markov";
import fs from "fs";

// Get the bot's generated gpt-2 text samples.
const boisDataset = JSON.parse(
  fs.readFileSync("./data/train/datasets/LadBoi/ladboi.json").toString()
);

/**
 * Reacts to message events from any disord server the bot is connected to.
 *
 * Current features:
 * 1) Load a command from commands/
 * 2) If mentioned, pick a text sample from boisDataset
 * 3) Possibly say "shut up" to our boi Matthew.
 *
 * @param client The current {@code Discord.client} instance that is logged in
 * @param message The read {@code Discord.Message}
 * @param db JSON object containing markov chain per discord server, managed by
 *           {@code markov.ts}
 * @returns Either nothing or a message response
 */
export function onMessage(
  client: Client,
  message: Message,
  db: Record<string, any>
): void | Promise<Message> {
  // Ignore all bots
  if (message.author.bot) return;

  // Upon being mentioned, send back random response from boisDataset
  if (message.content.includes(config.ids.botID)) {
    const msg = boisDataset[Math.floor(Math.random() * boisDataset.length)];
    return message.channel.send(msg);
  }

  // Check for Matt message hehe
  if (message.author.id === config.ids.mattID) {
    if (Math.floor(Math.random() * 100) + 1 === 1) {
      return message.reply("Shut up boy");
    }
  }

  // (1/420) chance to reply to anyone with a text sample..
  if (Math.floor(Math.random() * 420) + 1 === 1) {
    const msg = boisDataset[Math.floor(Math.random() * boisDataset.length)];
    return message.reply(msg);
  }

  // Continue adding to the current server's markov chain
  const channelID = message.channel.id;
  const msgText = message.content;
  if (!db[channelID]) {
    db[channelID] = createChain();
  } else if (msgText && !msgText.includes(config.prefix)) {
    mergeSentence(db[channelID], msgText);
  }

  // At this point ignore message not starting with the prefix
  if (!message.content.includes(config.prefix)) return;

  // Attempt to load and execute a command
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const commandName = args.shift();
  if (commandName) {
    const command = commands.get(commandName);
    if (command) {
      try {
        command.run(client, message, args);
      } catch (err) {
        console.error(err);
        return message.channel.send(
          "Caught error dawg <:gFlush:735671709562306562>"
        );
      }
    }
  }
}
