/** Records, across all saved channel databases, the messages for all lads. */

import { Client, Message, GuildMember } from "discord.js";
import config from "../../data/config.json";
import fs from "fs";

export async function run(
  client: Client,
  message: Message,
  args: string[]
): Promise<void> {
  console.log(message.author.id);
  if (message.author.id !== config.ownerID) return;

  // Get GuildMembers with the "Lad" role
  let lads: GuildMember[] = [];
  await message.guild.members.fetch({ force: true }).then((members) => {
    lads = members.array();

    lads = lads.filter((lad) =>
      lad.roles.cache
        .array()
        .map((role) => role.name)
        .includes("Lad")
    );
    // Collect all messages across all saved channel databases for each lad
    lads.forEach((lad) => {
      let csv = "";

      const db: Record<string, any> = JSON.parse(
        fs.readFileSync(config.database).toString()
      );

      Object.keys(db).forEach((channelID: string) => {
        const channelDB: Record<string, string[]> = db[channelID];
        for (const [key, value] of Object.entries(channelDB)) {
          if (lad.user.id !== key) continue;
          value.forEach((msg) => (csv += `${msg}\n`));
        }
      });

      // Save training data to consistent first name scheme
      let saveName: string = null;
      switch (lad.user.id) {
        case "143837955155296256":
          saveName = "Alan";
          break;
        case "421837193154134037":
          saveName = "Luis";
          break;
        case "147911847482228736":
          saveName = "Bryan";
          break;
        case "160515552194985984":
          saveName = "Robert";
          break;
        case "138109030613778433":
          saveName = "Jackson";
          break;
        case "137791956691582976":
          saveName = "Michael";
          break;
        case "96420505468301312":
          saveName = "Jeremy";
          break;
        case "137738852218568705":
          saveName = "John";
          break;
        case "109179516101906432":
          saveName = "Josh";
          break;
        case "202970812439855105":
          saveName = "Travis";
          break;
        case "132286981299240960":
          saveName = "Zach";
          break;
        case "148954004112670720":
          saveName = "Andrew";
          break;
        case "168101752254627840":
          saveName = "Stuart";
          break;
        case "133039414518480897":
          saveName = "Chris";
          break;
        case "178925535257296896":
          saveName = "Allison";
          break;
        case "167063591986397185":
          saveName = "Daniel";
          break;
        case "148239271810039808":
          saveName = "Asa";
          break;
        case "109097713223639040":
          saveName = "Manny";
          break;
        case "142787044282728448":
          saveName = "Matt";
          break;
        case "192087630006059009":
          saveName = "Nick";
          break;
        case "198175748736024576":
          saveName = "Novo";
          break;
        case "166023291910356992":
          saveName = "Sierra";
          break;
        case "107757816374124544":
          saveName = "Flynn";
          break;
      }
      fs.writeFileSync(
        `./data/train/datasets/${saveName}/${saveName}.csv`,
        csv
      );
    });
  });
}
