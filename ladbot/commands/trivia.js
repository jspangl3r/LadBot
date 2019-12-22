/*
Handles a game of trivia using Open Trivia DB:

https://opentdb.com/
*/

const Discord = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");
const axios = require("axios");
const Entities = require("html-entities").AllHtmlEntities;
const entities = new Entities();

// opentb api token
var TOKEN = undefined;
var cats = [];
var qs = []
var scores = [];
var repliesBad = ["Oof, answer was ", "No one got it! Answer was ", "Yikes! Answer was ", "Darn! Answer was ",
                  "Better luck next time! Answer was ", "You suck! Answer was ", "No one got it? Wow! Answer was "];
var repliesGood = ["You got it!", "Wow so smart!", "Wow nice one!", "I can't believe it! That's right!", "Holy smokes! You got it!",
                   "Win! +1 to you!"];

// Get this token and trivia categories upon loading command
let gt = (async () => getToken())();
let gc = (async () => getCats())();

exports.run = async (client, message, args) => {
    // Get categories if no args
    if(args.length == 0) {
        let usage = "```!trivia c``` to display categories\n" +
            "```!trivia p [category]``` to start a game of a category";
        let msg = "**__" + "Usage" + "__**" + usage;
        return message.channel.send(msg);
    }
    else if(args[0] === "c") {
        let cs = "";
        cats.forEach(c => cs += c + "\n");
        let msg = "**__" + "Trivia Categories" + "__**" + "\n" + cs
        return message.channel.send(msg);
    }
    else if(args[0] === "p") {
        // Get full category, if needed
        let c = args[1];    
        let i = 2;
        while(args[i] !== undefined) {
            c += " " + args[i];
            i += 1;
        }
        // Check for valid cateogry
        if(!c) {
            return message.channel.send("Make sure to select a category.");
        }   
        /*
        To account for its popularity, let 'entertainment: japanese anime & manga'
        be recognizable by just 'anime'        
        */
        if(c.toLowerCase() === "anime") {
            c = "entertainment: japanese anime & manga";
        }                    
        if(!cats.includes(c.toLowerCase())) {
            return message.channel.send("Not a valid category.");
        }

        // Play a game of trivia 
        let scores = [];    // setup scores array (once one of these values is 10, the game is over!)
                            // FORMAT IDEA : [ {DiscordUser : currentScore}, ... ]
        let cNum = cats.indexOf(c) + 9;
        let url = "https://opentdb.com/api.php?amount=10&category=" + cNum + "&type=multiple&token=" + TOKEN + ""
        await getQuestions(url);    // allocate 50 questions to boot
        message.channel.send("Starting a game of trivia for category " + "**" + c + "**");
        message.channel.send("**-------------------------------------------------------------------------------**")
        playRound();

        // Enter game-loop
        function playRound() {
            // Get a question and answer
            let obj = qs.pop();
            let q = entities.decode(obj.question);
            let a = entities.decode(obj.correct_answer.toLowerCase());
            console.log(q);
            console.log(a);

            message.channel.send(q);
            let id = -1;
            message.channel.fetchMessages({ limit : 1 }).then(messagess => {
                let msg = messages.first();
                if(msg.author.bot) {
                    id = msg.id;
                }
            });
            let done = false;
            
            // Collect messages for 10 seconds
            let filter = (msg) => !msg.author.bot;
            let collector = message.channel.createMessageCollector(filter, { time : 20000 });
            collector.on('collect', (msg) => {
                if(msg.content.toLowerCase() === a) {
                    if(!done) {
                        done = true;
                        let reply = repliesGood[Math.floor(Math.random() * repliesGood.length)];
                        message.channel.send(reply);
                    }
                    else {
                        message.channel.send("Someone already got it bro");
                    }
                }
            });
            collector.on('end', (collected) => {
                if(!done) {
                    let reply = repliesBad[Math.floor(Math.random() * repliesBad.length)];
                    message.channel.send(reply + "**" + a + "**");
                }
                // Go to next round, display scores
                message.channel.send("To the next question :point_down:");
                playRound();
            });
        }    
    }
    else {
        let usage = "```!trivia c``` to display categories\n" +
        "```!trivia p [category]``` to start a game of a category";
        let msg = "**__" + "Usage" + "__**" + usage;
        return message.channel.send(msg);
    }
}


/*
Return a new session token for a game of trivia

Expects  json:
{"response_code":0,"response_message":"Token Generated Successfully!","token":"fa8032fff0e42a091c94484ca23bc246e117dac3eddb619d6ea39989c55b7f10"}
*/
function getToken() {
    let url = "https://opentdb.com/api_token.php?command=request";
    axios.get(url)
        .then((response) => {
            let t = response.data.token
            // See if we should set the global token value
            if (t !== undefined || t !== "") {
                TOKEN = t;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

function getCats() {
    let url = "https://opentdb.com/api_category.php"
    axios.get(url)
        .then((response) => {
            let cs = response.data.trivia_categories;

            if (cs !== undefined || t !== "") {
                cs.forEach(j => cs += cats.push(j["name"].toLowerCase()));
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

async function getQuestions(url) {
    await axios.get(url)
              .then((response) => {
                  let arr = response.data.results;

                  if (arr !== undefined) {
                        qs = arr;
                  }   
              })
              .catch((error) => {
                  console.log(error);
              });
}

/*
Simple function to check the scores array for a winner
Returns: a winner if found, null otherwise

TODO: CHANGE to support format
*/
function gameOver(scores) {
    scores.forEach(function check(s) {
        if (s == 10) {
            // upon gameover
            return s;
        }
    });

    // upon game not over
    return null;
}

