/*
Creates a visualization of the current youtube videos present on our
youtube channel that've been made throughout the years

WIP
*/

exports.run = (client, message, args) => {
	const Discord = require("discord.js");
	const https = require("https");
	const fs = require("fs");

    // Parse initial args
    if(args[0] === 'h') {
        return message.channel.send("!ladhub [h (help) or p (list playlists)]");
    }

    // For HTTP request #1 - getting recent video
    let options1 = {
         host: 'www.googleapis.com',
         path: '/youtube/v3/search?key=' + client.config.youtubeAPIKey + '&channelId=UCNRqzTdFiMfxWmgsTHwDjxQ&part=snippet,id&order=date&maxResults=1',
         method: 'GET'
     };
    let options2 = {
        host: 'www.googleapis.com',
        path: '/youtube/v3/playlists?part=snippet&channelId=UCNRqzTdFiMfxWmgsTHwDjxQ&key=' + client.config.youtubeAPIKey,
        method: 'GET'
    };

    // First callback function - get most recent video
    let callback1 = (response) => {
		let data = '';
		// Compile data as we get it
		response.on('data', (chunk) => {
			data += chunk;
		});
        response.on('end', () => {
            // let recentVidJ = JSON.parse(data)["items"][0];
            // let recentVidE = new Discord.RichEmbed()
            //     .setColor("#c4302b")
            //     .setDescription("```" + "The Young Lads Youtube stuff" + "```")
            //     .setThumbnail(JSON.parse(fs.readFileSync(client.config.projectpics))["ytPicURL"])
            //     .addBlankField()
            //     .addField("Usage:", "How to use this thing, command parameters, etc.")
            //     .addBlankField()
            //     .addField("Most recent video:", '['  + '"' + recentVidJ.snippet.title + '"' + ']' +
            //             "("  + "https://www.youtube.com/watch?v=" + recentVidJ.id.videoId + ")" +
            //              " : published on " + new Date(recentVidJ.snippet.publishedAt).toDateString())
            //     .setImage(recentVidJ.snippet.thumbnails.high.url)
            //     .setFooter("Description: " + recentVidJ.snippet.description);

            // nextHttpRequest(recentVidE);
            return message.channel.send("Not done yet! ~:)");
        });

    }
    // Call request1
    try {
        let request1 = https.request(options1, callback1).end();
    }
    catch(err) {
        console.log(error);
    }

    // Function for second http request
    let nextHttpRequest = (recentVidE) => {
        // Second callback function - get playlist stuff
        let playlistData = [];
        let callback2 = (response) => {
            let data = '';
            // Compile data as we get it
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                return message.channel.send({embed:recentVidE});
            });
         }

        // Call request2
        try {
            let request2 = https.request(options2, callback2).end();
        }
        catch(err) {
            console.log(err);
        }
    }
}
