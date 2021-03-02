/**
 * Main entry point to the bot.
 */

import Discord from "discord.js";
import Enmap from "enmap";
import fs from "fs";
//import config from "ladbot"

// Add mobile icon to discord status.
const client = new Discord.Client({ ws: { properties: { $browser: "Discord iOS" } }});