/** Main entry point to the bot. */

import { Client, Intents } from "discord.js";
import { randomItemFromArr, restart } from "./utils";
import { onMessage } from "./ladbot";
import config from "../data/config.json";
import fs from "fs";

// Create a new discord client with the mobile icon discord status.
const client = new Client({
  ws: { intents: Intents.ALL, properties: { $browser: "Discord iOS" } },
});

// Load up databases
let db = {};
let markovDB = {};
try {
  db = JSON.parse(fs.readFileSync(config.database).toString());
  markovDB = JSON.parse(fs.readFileSync(config.markovDatabase).toString());
  console.log("Databases loaded.");
} catch (err) {
  console.log(err);
}

/**
 * Setup variables to restart after a certain amount of messages are added to
 * the databases.
 *
 * // TODO: saving while fetching all messages can mess with the saved database.
 */
const SAVE_LIMIT = 5;
let ii = 0;
const save = () => {
  fs.writeFileSync(config.database, JSON.stringify(db));
  fs.writeFileSync(config.markovDatabase, JSON.stringify(markovDB));
  console.log("Both databases saved.");
};
const saveTimer = () => {
  save();
  setTimeout(saveTimer, (config as any).auto_save_interval * 1000);
  ii++;
  // Check to see if we should restart
  if (ii === SAVE_LIMIT) {
    ii = 0;
    restart(client);
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
  const randStatus = randomItemFromArr(customActivities);
  if (client.user) client.user.setActivity(randStatus);
});

/**
 * Upon reading a message, call {@code #onMessage}.
 */
client.on("message", (message) => {
  onMessage(client, message, db, markovDB);
});
