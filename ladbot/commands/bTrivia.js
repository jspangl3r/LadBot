/**
 * Hopefully a better version of trivia. The current version is quite clunky and doesn't
 * utilize the power and cleanliness of functions :(~)
 */

const fs = require("fs");
const yaml = require("js-yaml");
const shuffle = require("shuffle-array");

const cats = ["2015", "2016", "anime", "artandliterature", "boombeach", "cars", "clashroyale", "computers", "disney", "dota2abilities", "dota2items",
  "elements", "entertainment", "finalfantasy", "gameofthrones", "games", "general", "greekmyth", "harrypotter", "leagueoflegends", "leagueults",
  "michaeljackson", "nba", "overwatch", "pokemon", "prince", "solgans", "sports", "starwars", "uscapitals", "usflags", "usmap", "usstateabbreviations",
  "warcraft", "whosthatpokemon", "worldcapitals", "worldflags", "worldmap"];
const repliesBad = ["Oof, answer was ", "No one got it! Answer was ", "Yikes! Answer was ", "Darn! Answer was ",
  "Better luck next time! Answer was ", "You suck! Answer was ", "No one got it? Wow! Answer was "];
const repliesGood = ["You got it!", "Wow so smart!", "Wow nice one!", "I can't believe it! That's right!", "Holy smokes! You got it!",
  "Win! +1 to you!", "Goodness me!", "Wowzerz", "My lord.."];

exports.run = (client, message, args) => {

};

/**
 Simple function to display the scoreboard to the channel
 */
function scoreBoard(scores, message) {
  let msg = "\n----------Scores----------\n";
  Object.keys(scores).forEach((key) => {
    const s = scores[key];
    msg += `${key}: ${s}\n`;
  });
  msg += "----------------------------\n";
  return message.channel.send(msg);
}

/**
 Simple function to check the scores array for a winner
 Returns: a winner if found, undefined otherwise
 */
function gameOver(scores) {
  let winner;
  Object.keys(scores).forEach((key) => {
    if (scores[key] === 10) {
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
  const file = yaml.safeLoad(fs.readFileSync(`./data/trivia/${cat}.yaml`));
  delete file.AUTHOR;

  // Allocate answers to question answer dict and
  // allocate questions to the questions array
  Object.keys(file).forEach((key) => {
    qsAs[key] = file[key];
    qs.push(key);
  });

  shuffle(qs);
}