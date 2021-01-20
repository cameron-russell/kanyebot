import Discord, { Client, Collection, Message } from 'discord.js';
import fs from 'fs';
import path from 'path';
import Schedule from 'node-schedule';
import { setSchedule, Command, getDuration } from './helpers';

require('dotenv').config();

// create client
const client: Client = new Discord.Client();
let schedule: Schedule.Job;
let previousTime: string;

// create collection of commands
const commands: Collection<string, Command> = new Discord.Collection();

// get files containing command definitions
const commandFiles: string[] = fs
  .readdirSync(path.resolve(__dirname + '/commands'))
  .filter((file) => file.endsWith('.js') && !file.includes('model'));

// assign each command to the collection
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
client.on('message', (message) => {
  const args = message.content.slice(1).trim().split(/ +/);

  //if a bot @'s kanye
  if (
    message.mentions.users.find(
      (user) => user.username === 'kanyebot' && user.bot && !message.author.bot,
    )
  ) {
    // if there is no set command and a value
    if (!args[1] && !args[2]) return;
    console.log(args[1], args[2]);

    if (args[1] === 'set') {
      // attempt to set a schedule
      const success = setSchedule(args[2], previousTime, schedule, commands, message, args);

      // if we set a schedule successfully, update the previous schedule length
      if (success) previousTime = getDuration(args[2]);
    } else if (args[1] === 'stop') {
      // if there is a schedule, clear it
      if (schedule) {
        schedule.cancel();
        return message.channel.send('I will no longer send quotes to this channel.');
      } else return message.channel.send('I am not currently on a schedule!');
    } else {
      return message.channel.send(
        'Command not recognised. To set a new schedule, type "@kanyebot set <[0-9]>h or <[30-99]>m". To clear the schedule, type "@kanyebot stop"',
      );
    }
  }
});

client.on('message', (message: Message) => {
  // if the message doesn't start with a . or the author is the bot, return
  if (!message.content.startsWith('.') || message.author.bot) return;

  // extract command and check if it exists in the collection
  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift()?.toLowerCase() ?? 'commandthatdoesntexist';
  const exists = commands.has(command);

  // return if the command doesn't exist
  if (!exists) return;

  // execute the function
  commands.get(command)?.fn(message, args);
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.BOT_TOKEN);
