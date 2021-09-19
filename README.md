# LadBot

Using several online and free guides, LadBot is my first attempt at a Discord bot. It is fully written in Node.js (v. 11.something).
While mainly written for customized usage on my friends' Discord server, the bot does feature some utilities that you may find useful, despite most of them being relatively unfinished.

## Utilities (the useful ones)
* **changelog.js** - fetches the latest commit from this repo (by default) and wraps it up in a nice Discord embed message.

* **fetchMsgs.js** - fetches **x** number of messages from a Discord channel. What you do with them is up to you (this bot by default uses these messages to accumulate a second-order markov chain.

* **fetchConversations.js** - fetches, based on a certain time limit, the past "conversations" of a Discord channel's text channel. This is still largely a wip feature and is planned to be used in some form of a smarter chatbot (rather than a markov chain).

* **serverinfo.js** - accumulates detailed information regarding the Discord channel the bot is invoked from, such as the creation date of the server, the region information, number of members (online/offline), etc.

* **urban.js** - fetches a definition for a given word from https://www.urbandictionary.com/, allowing the user to specify up to 10 different definitions (assuming the searched word has up to 10 definitions). Alongside the definition, the author, ratings, and an example  sentence are all thrown into a final Discord embed response message.

* **userinfo.js** - fetches general user data and their relative server data about a user (if no argument is specified, the user defaults to the message's author), such as their nicknamek presence status, Discord join date, relative Discord channel join date, etc.

* **markov.js** - (Not written by me, see below) file responsible for handling markov-related bot activities (responding to mentions in the server). Creates and organizes a second-order markov chain and by using this chain, generates messages from this chain. Note that while this is used as a chatbot, whatever messages the user sends in the mention to the bot aren't actually read nor do they impact what the bot generates from the chain. This is something I hope to update in the future.

## A Thanks
to Ethan Witherington for allowing me to use his **markov** code. You can find his account at https://github.com/Navigatron/
