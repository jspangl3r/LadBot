import { Client } from "discord.js";
import { restart } from "../utils";

/**
 * Restarts bot.
 */
export function run(client: Client): void {
  restart(client);
  return;
}
