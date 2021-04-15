import { Client, Message } from "discord.js";
import axios, { AxiosResponse } from "axios";
import config from "../../data/config.json";
import fs from "fs";

export function run(
  client: Client,
  message: Message,
  args: string[]
): Promise<Message> {
  if (!args[0]) return message.reply("Make sure to enter a search term.");

  const definitionNum = Number.isInteger(parseInt(args[args.length - 1], 10))
    ? parseInt(args[args.length - 1])
    : null;

  const searchTerm = (definitionNum
    ? args.splice(0, args.length - 1)
    : args
  ).join(" ");

  const url = `https://api.urbandictionary.com/v0/define?term=${searchTerm}`;
  axios
    .get(url)
    .then((response) => console.log(response.data))
    .catch((err) => console.log(err));
}
