const fs = require("fs");

/* TODOs
 * 1) Improve text generation: "?." -> "?", detect more "bad cases", etc.
 * 2) Improve variance of samples: have a good distribution of samples,
 *    allow for length settings: "short", "medium", "long", etc. 
 * 3*) Write script to easily re-produce samples.
 */

exports.run = (client, message, args) => {
  const mimics = JSON.parse(fs.readFileSync(client.config.mimics));

  if(!args[0]) {
    return message.channel.send("```!mimic [name]\n\n" +
    "Current mimics: " +  mimics.join(", ") + "```");
  }

  // Get users name and filename
  let name;
  let lowerc = args[0].toLowerCase();
  mimics.forEach(m => {
    if (m.toLowerCase().includes(lowerc) || lowerc.includes(m.toLowerCase())) {
      name = m;
    }
  });
  
  // Ship
  if (name) {
    // See if their dataset exists
    const path = `./data/train/datasets/${name}/${name}.json`;
    // Load and send a random message 
    try {
      const dataset = JSON.parse(fs.readFileSync(path));
      const text = dataset[Math.floor(Math.random() * dataset.length)];
      return message.channel.send(`[${name}] ${text}`);
    }
    catch(e) {
      console.log(e);
    }
  }
  else {
    return message.channel.send("Don't have any data on this user yet. gimme a bit");
  } 
}; 