/**
 Fetches the latest commit from this repository and messages it in a nice
 Discord embeded message.

 Due to the nature of github's api, I couldn't find a way to get all of
 the data I need from one http request. What I did was the following:
 1) The first http request gets the repo's master branch information,
    which contains a URL to the most recent commit of this branch.
    From this, I grabbed the commit's ID at the end of the URL
 2) Using the commit ID, the second http request gets specific info.
    regarding this commit, such as the commit's message, timestamp, etc.
    (information I want). Using this information, I finally build and send
    the discord embedded message.
 */

const Discord = require("discord.js");
const https = require("https");
const fs = require("fs");

exports.run = (client, message) => {
  // Need this for the first http request
  const options1 = {
    host: "api.github.com",
    path: "/repos/jspangled/LadBot/git/refs/heads/master",
    method: "GET",
    headers: {"user-agent": "node.js"},
  };

  // Setup function for first http request
  let commitID;
  const urlText = "https://api.github.com/repos/jspangled/LadBot/git/commits/";
  const callback1 = (response) => {
    let data = "";
    // Compile data as we get it
    response.on("data", (chunk) => {
      data += chunk;
    });
    // Here we can grab the commit ID and call the next request
    response.on("end", () => {
      commitID = JSON.parse(data).object.url.slice(urlText.length);

      // Call next function with commitID
      nextRequstCall();
    });
  };
  // Actually call first http request
  https.request(options1, callback1).end();

  // Setup function for second http request
  const nextRequstCall = () => {
    let msgText; let commitURL; let
      commitDate;
    const options2 = {
      host: "api.github.com",
      path: `/repos/jspangled/LadBot/git/commits/${commitID}`,
      method: "GET",
      headers: {"user-agent": "node.js"},
    };
    const callback2 = (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      // Here we get the juicy commit information and build the embed
      response.on("end", () => {
        // Setup info. for the embed
        const repoURL = "https://github.com/jspangled/LadBot";
        const dataJ = JSON.parse(data);
        msgText = dataJ.message;
        commitURL = dataJ.html_url;
        commitDate = new Date(dataJ.author.date);
        // Choose a pretty random color
        const color = Math.floor((Math.random() * 16777214) + 1);

        // Lastly, setup the rich embed
        const embed = new Discord.RichEmbed()
            .setTitle("**Recent updates (click me for more details):**")
            .setURL(commitURL)
            .setDescription(`\`\`\`${msgText}\`\`\``)
            .setColor(color)
            .setThumbnail(JSON.parse(fs.readFileSync(client.config.projectpics)).projectPicURL)
            .setFooter("Update release on", JSON.parse(fs.readFileSync(client.config.projectpics)).ladbotPicURL)
            .setTimestamp(commitDate)
            .addField("See more about this project at",
                `[the project page](${repoURL}).`);

        // Send!
        return message.channel.send({embed});
      });
    };
    // Start second request
    https.request(options2, callback2).end();
  };
};
