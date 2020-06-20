/**
 Handles a game of trivia using Red-DiscordBot's trivia lists:

 https://github.com/Cog-Creators/Red-DiscordBot
 */

const fs = require("fs");
const yaml = require("js-yaml");
const shuffle = require("shuffle-array");

var cats = ["2015", "2016", "anime", "artandliterature", "boombeach", "cars", "clashroyale", "computers", "disney", "dota2abilities", "dota2items",
            "elements", "entertainment", "finalfantasy", "gameofthrones", "games", "general", "greekmyth", "harrypotter", "leagueoflegends", "leagueults",
            "michaeljackson", "nba", "overwatch", "pokemon", "prince", "solgans", "sports", "starwars", "uscapitals", "usflags", "usmap", "usstateabbreviations",
            "warcraft", "whosthatpokemon", "worldcapitals", "worldflags", "worldmap"];
var repliesBad = ["Oof, answer was ", "No one got it! Answer was ", "Yikes! Answer was ", "Darn! Answer was ",
                  "Better luck next time! Answer was ", "You suck! Answer was ", "No one got it? Wow! Answer was "];
var repliesGood = ["You got it!", "Wow so smart!", "Wow nice one!", "I can't believe it! That's right!", "Holy smokes! You got it!",
                   "Win! +1 to you!", "Goodness me!", "Wowzerz", "My lord.."];
var gameInProg = false;

exports.run = (client, message, args) => {
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

        // Only start a game if another game isn't going on
        if(gameInProg) {
            return message.channel.send("Another game is already going on!");
        }
        else {
            gameInProg = true;
        }

        // Play a game of trivia 
        let scores = {};    // setup scores dict.
        var qsAs = {};      // setup q and a stuff
        var qs = [];
        getQuestions(c, qsAs, qs);
        let gameDone = false;
        let msg = "Starting a game of trivia for category " + "**" + c + "**\n" +
                  "Type \"STOP_GAME\" after a question is displayed to end the game.";
        message.channel.send(msg);
        playRound();
        // Enter game-loop
        function playRound() {
            if(!gameDone) {
                // Attempt to get a question and answer
                let q, a;
                if(qs.length > 0) {
                    q = qs.pop();
                    a = qsAs[q];
                }
                else {
                    let msg = "Oop ~ looks like I'm all out of questions!" +
                              " Try rerunning the command.";
                    message.channel.send(msg);
                    return scoreBoard(scores, message);
                }

                

                // Display question to channel for a round
                message.channel.send(q);
                let roundDone = false;
                
                // Collect messages for 10 seconds
                let filter = (msg) => !msg.author.bot;
                let collector = message.channel.createMessageCollector(filter, { time : 14000 });
                collector.on("collect", (msg) => {
                    // Check for STOP_GAME condition
                    if(msg.content === "STOP_GAME") {
                        gameDone = true;
                        gameInProg = false;
                        message.channel.send("Ending the game -- here are the scores:");
                        return scoreBoard(scores, message);
                     }
                     // Otherwise check answers
                     if(!gameDone) {
                        // Check all possible answers
                        a.forEach( (ans) => {
                            // Check answers
                            if(typeof ans == "string") {
                                ans = ans.toLowerCase();
                            }
                            // Upon reading correct answer
                            if(msg.content.toLowerCase() == ans) {
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
                        })
                     }
                });
                // Upon reaching the timeout
                collector.on("end", (collected) => {
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

/**
 Simple function to display the scoreboard to the channel
 */
function scoreBoard(scores, message) {
    let msg = "\n----------Scores----------\n";
    Object.keys(scores).forEach( (key) => {
        let s = scores[key];
        msg += key + ": " + s + "\n";
    });
    msg += "----------------------------\n";
    return message.channel.send(msg);
}

/**
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

/**
 Simple function to allocate the questions dictionary with 
 some questions and answers
 */
function getQuestions(cat, qsAs, qs) {
    const file = yaml.safeLoad(fs.readFileSync('./data/trivia/' + cat + ".yaml"));
    delete file["AUTHOR"];
    
    // Allocate answers to question answer dict and 
    // allocate questions to the questions array
    Object.keys(file).forEach( (key) => {
        qsAs[key] = file[key];
        qs.push(key);
    });

    shuffle(qs);
}