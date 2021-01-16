import { Message } from 'discord.js';

module.exports = {
  name: 'error',
  description: 'default error function',
  fn: (message: Message, args: string) => {
    message.channel.send('There was an error trying to execute that command!');
  },
};
