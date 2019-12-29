/*
Handles a game of trivia using Red-DiscordBot's trivia lists:

https://github.com/Cog-Creators/Red-DiscordBot
*/

const Discord = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");

var cats = ["2015", "2016", "anime", "artandliterature", "boombeach", "cars", "clashroyale", "computers", "disney", "dota2abilities", "dota2items",
            "elements", "entertainment", "finalfantasy", "gameofthrones", "games", "general", "greekmyth", "harrypotter", "leagueoflegends", "leagueults",
            "michaeljackson", "nba", "overwatch", "pokemon", "prince", "solgans", "sports", "starwars", "uscapitals", "usflags", "usmap", "usstateabbreviations",
            "warcraft", "whosthatpokemon", "worldcapitals", "worldflags", "worldmap"];
var repliesBad = ["Oof, answer was ", "No one got it! Answer was ", "Yikes! Answer was ", "Darn! Answer was ",
                  "Better luck next time! Answer was ", "You suck! Answer was ", "No one got it? Wow! Answer was "];
var repliesGood = ["You got it!", "Wow so smart!", "Wow nice one!", "I can't believe it! That's right!", "Holy smokes! You got it!",
                   "Win! +1 to you!"];
var qs = [];

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
        if(!cats.includes(c.toLowerCase())) {
            return message.channel.send("Not a valid category.");
        }

        // Play a game of trivia 
        let scores = {};    // setup scores dict.
        getQuestions(cat);  // setup questions array
        let cNum = cats.indexOf(c) + 9;
        let gameDone = false;
        message.channel.send("Starting a game of trivia for category " + "**" + c + "**");
        playRound();

        // Enter game-loop
        function playRound() {
            if(!gameDone) {
                // Get a question and answer
                let obj = qs.pop();
                let q = entities.decode(obj.question);
                let a = entities.decode(obj.correct_answer.toLowerCase());
                console.log(obj);
                console.log(q);
                console.log(a); 

                // Display question to channel
                message.channel.send(q);
                let roundDone = false;
                
                // Collect messages for 10 seconds
                let filter = (msg) => !msg.author.bot;
                let collector = message.channel.createMessageCollector(filter, { time : 12500 });

                collector.on('collect', (msg) => {
                    // Upon reading correct answer
                    if(msg.content.toLowerCase() === a) {
                        if(!roundDone) {
                            // Incr. user score
                            if(msg.author.username in scores) {
                                scores[msg.author.username] += 1;
                            }
                            else {
                                scores[msg.author.username] = 1;
                            }
                            // Toggle round over
                            roundDone = true;
                            let reply = msg.author + " " + repliesGood[Math.floor(Math.random() * repliesGood.length)];
                            message.channel.send(reply);

                            // Check for game over, toggle gameOver, show scores, and then proceed to exit
                            let res = gameOver(scores);
                            if(res !== undefined) {
                                gameDone = true;
                                message.channel.send("We have a winner - " + res + "! Here are the scores: ");
                                return scoreBoard(scores, message);
                            }
                            // Go to next round, display scores
                            scoreBoard(scores, message);
                        }
                    }
                });
                // Upon reaching the timeout
                collector.on('end', (collected) => {
                    // Only continue if game isn't over yet
                    if(!gameDone) {
                        // If someone already guessed it, don't show answer
                        if(!roundDone) {
                            let reply = repliesBad[Math.floor(Math.random() * repliesBad.length)];
                            message.channel.send(reply + "**" + a + "**");
                        }
                        else {
                            roundDone = false;
                        }
                        // Go to next round, display scores
                        message.channel.send("To the next question :point_down:");
                        playRound();
                    }
                });
            }  
        }
    }
    else {
        let usage = "```!trivia c``` to display categories\n" +
        "```!trivia p [category]``` to start a game of a category";
        let msg = "**__" + "Usage" + "__**" + usage;
        return message.channel.send(msg);
    }
}

function scoreBoard(scores, message) {
    let msg = "\n----------Scores----------\n";
    Object.keys(scores).forEach( (key) => {
        let s = scores[key];
        msg += key + ": " + s + "\n";
    });
    msg += "----------------------------\n";
    return message.channel.send(msg);
}

/*
Simple function to check the scores array for a winner
Returns: a winner if found, undefined otherwise
*/
function gameOver(scores) {
    let winner = undefined
    Object.keys(scores).forEach( (key) => {
        if(scores[key] == 10) {
            // upon game over
            winner = key;
        }
    });

    return winner;
}

function getQuestions(cat) {

}
