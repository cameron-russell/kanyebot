import { Message } from 'discord.js';
import { Command } from '../helpers';
import fs from 'fs';
import path from 'path';

// get files containing command definitions
const commandFiles: string[] = fs
  .readdirSync(path.resolve(__dirname))
  .filter((file) => file.endsWith('.js') && !file.includes('error') && !file.includes('help'));

const commands = [{ name: `help`, value: 'Displays this message box.', inline: true }];
commandFiles.forEach((file, index) => {
  const cmd: Command = require(`./${file}`);
  commands.push({ name: cmd.name, value: cmd.description, inline: index % 2 === 0 });
});

const helpEmbed = {
  color: '#70e000',
  title: 'Available commands:',
  fields: commands,
};

module.exports = {
  name: 'help',
  description: 'Displays this message box.',
  fn: (message: Message, args: string[]) => {
    message.channel.send({ embed: helpEmbed });
  },
};
