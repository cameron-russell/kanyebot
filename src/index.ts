import Discord, { Client, Message } from 'discord.js';
import SingletonFactory from './Singleton';

require('dotenv').config();

// create client
const client: Client = new Discord.Client();
/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', (message: Message) => {
  // if anyone @'s kanyebot
  if (message.mentions.users.find((user) => user.username === 'kanyebot' && user.bot && !message.author.bot)) {
    // extract command and check if it exists in the collection
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args?.[1] ?? 'commandthatdoesntexist';
    const schedule = SingletonFactory.getInstance();
    const exists = schedule.getCommands().has(command);
    // return if the command doesn't exist
    if (!exists) return;

    // execute the function
    return schedule.getCommands().get(command)?.fn(message, args);
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.BOT_TOKEN);
