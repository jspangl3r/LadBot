/** 
 Responsible for handling markov bot activities.
 BIG THANKS to Ethan Witherington, for all of this code is from his project:
 https://github.com/Navigatron/mimic

 Notes:
 The "Navigatron" chain data structure to be used,
 this represents a second-order markov chain:
 {
 	"Word1Word2": {
 		count: x,
 		end: y,
 		next: {
 			"Word3": z,
 			"Word4": w
 		}
 	}
 }	
 */

/** 
 Creates empty chain for a new message
 */
function createChain() {
	return {};
}

/** 
 Adds a message to a possible pre-existing chain.
 I just wish I knew exactly how it works... 
 */
function mergeSentence(chain, msg) {
	// Split the thing
	let words = msg.split(" ");

	// Now iterate through each word and do some chaining magic
	let prepre = "<START>";
	let pre = "<START>";
	for (let i = 0; i < words.length; i++) {
		// Setup some states
		let currentState = prepre + ":" + pre;
		let nextState = words[i];
		// Check to see if chain is lacking entry for current state
		if (!chain[currentState]) {
			chain[currentState] = {
				"count": 0,
				"end": 0,
				"next": {}
			};
		}
		// Now increment count of current state
		chain[currentState].count++;
		// Check to see if nextState has an entry for its next state
		if (!chain[currentState].next[nextState]) {
			chain[currentState].next[nextState] = 0;
		}
		// Now increment the count of the nextState after currentState
		chain[currentState].next[nextState]++;
		// Now change prepre and pre for the next iteration
		prepre = pre;
		pre = nextState;
	}

	// Increase probability of last two words leading to <END>
	let currentState = prepre + ":" + pre;

	// Check to see if we have an entry for currentState
	if (!chain[currentState]) {
		chain[currentState] = {
			"count": 0,
			"end": 0,
			"next": {}
		};
	}

	// Increment count for currentState and the ending state
	chain[currentState].count++;
	chain[currentState].end++;

	// Job's done.
	return chain;
}

/** 
 Generate a cute message from a markov chain.

 Return codes (if not successful):
	 -1 => if generated from an empty chain.
 */
function generateSentence(chain) {
	// Setup some stuff
	let words = ["<START>", "<START>"];
	let nextWord = getNextWord(chain, words);

	// Now, get some words
	while (typeof (nextWord) === "string") {
		words.push(nextWord);
		nextWord = getNextWord(chain, words);
	}

	// Remove the start tokens and check for empty chain 
	words.shift();
	words.shift();
	if (words.length === 0) {
		return -1;
	}

	// Now we know we have some words, so form the sentence:
	let sentence = words.join(" ");

	return sentence;
}

/** 
 Using the magic of probability, determine what the next word should be
 given an array of words.

 Return codes (if not successful):
 	 -1 => there shouldn't be a next word, or
     -2 => not sure what we should do here (empty chain).
 */
function getNextWord(chain, words) {
	// Setup some stuff:
	let wordsCount = words.length;
	let currentState = words[wordsCount - 2] + ":" + words[wordsCount - 1];
	let possibilities = chain[currentState];

	// If this state hasn't been seen before, oh no!
	if (!possibilities) {
		return -2;
	}

	// Determine an index to take
	let index = getRandomInt(1, possibilities.count);
	// Determine if we should take the end option
	if (index <= possibilities.end) {
		return -1;
	}

	// Determine what option to take
	let tooBig;
	let tooSmall = possibilities.end;
	for (let word in possibilities.next) {
		tooBig = tooSmall + possibilities.next[word];
		// See if our index matches with this word:
		if (tooSmall < index && index <= tooBig) {
			return word;
		}
		tooSmall += possibilities.next[word];
	}

	// At this point, return an error
	console.error("That's rough buddy");
}

/** 
 Gets a random integer between [min, max].
 */
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Declare exports:
module.exports = {
	"createChain": createChain,
	"mergeSentence": mergeSentence,
	"generateSentence": generateSentence
}
