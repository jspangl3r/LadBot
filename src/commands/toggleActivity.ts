import { Client } from "discord.js";
import { setActivity } from "../utils";

/**
 * Toggles the client's activity prescence to something random.
 */
export function run(client: Client): void {
  setActivity(client);
  return;
}
