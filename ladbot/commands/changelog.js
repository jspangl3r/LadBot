

exports.run = (client, message, args) => {
	let https = require('https');

	let options1 = {
		host: 'api.github.com',
		path: '/repos/jspangled/LadBot/git/refs/heads/master',
		method: 'GET',
		headers: {'user-agent': 'node.js'}
	};
	
	// Do first part and store it
	let commitID;
	let urlText = "https://api.github.com/repos/jspangled/LadBot/git/commits/";
	let callback1 = (response) => {
		let data = '';

		response.on('data', (chunk) => {
			data += chunk;	
		});

		response.on('end', () => {
			commitID = JSON.parse(data).object.url.slice(urlText.length);
			
			// Call next function with commitID
			nextRequstCall();
		});

	}
	let request1 = https.request(options1, callback1).end();	

	let nextRequstCall = () => {
		// Do second part and store stuff for it
		let msgText, commitURL, commitDate;
		let options2 = {
			host: 'api.github.com',
			path: '/repos/jspangled/LadBot/git/commits/' + commitID,
			method : 'GET',
			headers: {'user-agent': 'node.js'}
		};

		let callback2 = (response) => {
			let data = '';

			response.on('data', (chunk) => {
				data += chunk;
			});

			response.on('end', () => {
				let repoURL = "https://github.com/jspangled/LadBot"; 
				let dataJ = JSON.parse(data);
				msgText = dataJ.message;
				commitURL = dataJ.html_url;
				commitDate = new Date(dataJ.author.date);

				// Now, finally setup discord embed message
				let embed = {
			    	"embed": {
				    "title": "**Recent updates (click me for more details):** ",
				    "description": "```" + msgText + "```",
				    "timestamp": commitDate,
				    "url": commitURL,
				    "color": 16777215,
				    "thumbnail": {
				      "url": client.config.projectPicURL
				    },
				    "footer": {
				      "icon_url": client.config.ladbotPicURL,
				      "text": "Update released on"
				    },
				    "fields": [
				    	{
				    		"name": "See more about this project at",
				    		"value": "[the project page](" + repoURL + ")."
				    	}
				    ]
				  }
				};
				return message.channel.send(embed);

			});
		}
		let request2 = https.request(options2, callback2).end();
	}
}