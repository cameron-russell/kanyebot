import Discord, { Client, Collection, Message } from 'discord.js';
import fs from 'fs';
import path from 'path';
import Command from './commands/Command-model';

require('dotenv').config();

// create client
const client: Client = new Discord.Client();
const commands: Collection<string, Command> = new Discord.Collection();

const commandFiles: string[] = fs
  .readdirSync(path.resolve(__dirname + '/commands'))
  .filter((file) => file.endsWith('.js') && !file.includes('model'));

for (const file of commandFiles) {
  const cmd: Command = require(`./commands/${file}`);
  commands.set(cmd.name, cmd);
}

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('I am ready!');
});

// // Create an event listener for messages
// client.on('message', (message) => {
//   // If the message is "ping"
//   if (message.content === 'ping') {
//     // Send "pong" to the same channel
//     message.channel.send('pong');
//   }
// });

client.on('message', (message: Message) => {
  if (!message.content.startsWith('.') || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  commands.get(command ?? 'error')?.fn(message, args);
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.BOT_TOKEN);
