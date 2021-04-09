import { Client, Message } from "discord.js";
import { restart } from "../utils";

export function run(client: Client, message: Message): void {
  console.log(client);
  restart(client);
  return;
}
