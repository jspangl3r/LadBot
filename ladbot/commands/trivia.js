/*
Handles a game of trivia using Open Trivia DB:

https://opentdb.com/
*/

const Discord = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");

exports.run = (client, message, args) => {
    // Get categories if no args
    if(args.length == 0) {
        let usage = "```!trivia c``` to display categories\n" +
                    "```!trivia p [category]``` to start a game of a category";
        let msg = "**__" + "Usage" + "__**" + usage;
        return message.channel.send(msg);
    }
    else if(args[0] === "c") {
        let url = "https://opentdb.com/api_category.php";
        fetch(url)
            .then(res => res.json())
            .then(json => callback(json))
        function callback(json) {
            let cs = "";
            json["trivia_categories"].forEach(j => cs += j["name"] + "\n");

            let msg = "**__" + "Trivia Categories" + "__**" + "\n" + cs
            return message.channel.send(msg);
        }
    }
    else if(args[0] === "p"){
        let c = args[1];    // get category
        let scores = [];  // setup scores array (once one of these values)
                            // is 10, the game is over!
                            // FORMAT IDEA : [ {DiscordUser : currentScore}, ... ]

        // Retrieve session token
        console.log(getToken(tCallback));
    }
}

// TODO: solve this with promises
function tCallback(json) {
    console.log(json);
    return json["token"];
}

function getToken(callback) {
    let url = "https://opentdb.com/api_token.php?command=request";
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            callback(json);
        });
}

/*
Simple function to check the scores array for a winner
Returns: a winner if found, null otherwise

TODO: CHANGE to support format
*/
function gameOver(scores) {
    scores.forEach(function check(s) {
        if(s == 10) {
            // upon gameover
            return s;
        }
    });

    // upon game not over
    return null;
}
