import { Client } from "discord.js";
import { restart } from "../utils";

export function run(client: Client): void {
  restart(client);
  return;
}
