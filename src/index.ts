/**
 * Main entry point to the bot.
 */

import { Client } from "discord.js";
import config from "../data/config.json";
import { onMessage } from "./ladbot";
import fs from "fs";
// import config from "ladbot"

// Create a new discord client with the mobile icon discord status.
const client = new Client({
  ws: { properties: { $browser: "Discord iOS" } },
});

// Load up markov database
let db = {};
try {
  db = JSON.parse(fs.readFileSync(config.database).toString());
  console.log("Database loaded.");
} catch (err) {
  console.log(err);
}

/**
 * Setup variables to restart after a certain amount of messages are added to
 * the markov db.
 */
const SAVE_LIMIT = 5;
let ii = 0;
const restart = () => {
  client.destroy();
  client.login(config.token);
  console.log("Bot has been restarted.\n");
};
const save = () => {
  fs.writeFileSync(config.database, JSON.stringify(db));
  console.log("Database has been saved.");
};
const saveTimer = () => {
  save();
  setTimeout(saveTimer, (config as any).auto_save_interval * 1000);
  ii++;
  // Check to see if we should restart
  if (ii === SAVE_LIMIT) {
    ii = 0;
    restart();
  }
};
if ((config as any).auto_save) {
  console.log("Auto save is on.");
  setTimeout(saveTimer, (config as any).auto_save_interval * 1000);
}

/**
 * Export a {@code #commands} map constant containing a mapping for each
 * command name and its module containing the exported {@code #run} function.
 */
export const commands = new Map<string, any>();
fs.readdir("./src/commands", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file: string) => {
    const builtFile = `${file.split(".")[0]}.js`;
    // eslint-disable-next-line
    const props = require(`./commands/${builtFile}`);
    const commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    commands.set(commandName, props);
  });
});

/**
 * Login to discord.
 */
console.log("Logging into discord...");
client.login(config.token);

/**
 * Upon logging in, set a random activity status.
 */
client.on("ready", () => {
  console.log("Logged into discord!");
  const customActivities = JSON.parse(
    fs.readFileSync((config as any).customActivities).toString()
  );
  const randStatus =
    customActivities[Math.floor(Math.random() * customActivities.length)];
  if (client.user) client.user.setActivity(randStatus);
});

/**
 * Upon reading a message, call {@code #onMessage}.
 */
client.on("message", (message) => {
  onMessage(client, message, db);
});
