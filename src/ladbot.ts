/** Responsible for dealing with message events and some markov stuff. */

import { Client, Message } from "discord.js";
import { validMessage, randomItemFromArr } from "./utils";
import { createChain, mergeSentence } from "./markov";
import { commands } from "./index";
import config from "../data/config.json";
import fs from "fs";

// Lads info.
const lads = JSON.parse(fs.readFileSync(config.lads).toString());

// Get the bot's generated gpt-2 text samples.
const boisDataset = JSON.parse(
  fs.readFileSync("./data/train/datasets/Lad/lad.json").toString()
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
 * @param db JSON object containing messages sorted by user per guild.
 * @param markovDB JSON object containing markov chain per discord server, managed by
 *                 {@code markov.ts}
 * @returns Either nothing or a message response
 */
export function onMessage(
  client: Client,
  message: Message,
  db: Record<string, any>,
  markovDB: Record<string, any>
): void | Promise<Message> {
  // Ignore all bots
  if (message.author.bot) return;

  // Upon being mentioned, send back random response from boisDataset
  if (message.content.includes(config.discordID)) {
    const msg = randomItemFromArr(boisDataset);
    message.channel.send(msg);
  }

  // Check for Matt message hehe
  if (message.author.id === lads.Matt.id) {
    if (Math.floor(Math.random() * 100) + 1 === 1) {
      message.reply("Shut up boy");
    }
  }

  // (1/1000) chance to reply to anyone with a text sample..
  if (Math.floor(Math.random() * 1000) + 1 === 1) {
    const msg = randomItemFromArr(boisDataset);
    message.reply(msg);
  }

  // Add to guild messages db and to the markov db
  const channelID = message.channel.id;
  if (db[channelID]) {
    if (validMessage(message)) {
      if (!db[channelID][message.author.id]) {
        db[channelID][message.author.id] = [message.content];
      } else {
        db[channelID][message.author.id].unshift(message.content);
      }
    }
  }
  if (!markovDB[channelID]) {
    markovDB[channelID] = createChain();
  } else if (message.content && !message.content.includes(config.prefix)) {
    mergeSentence(markovDB[channelID], message.content);
  }

  // At this point ignore message not starting with the prefix
  if (!message.content.includes(config.prefix)) return;

  // Attempt to load and execute a command. Pass in the current discord client,
  // message caught, and any args
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
