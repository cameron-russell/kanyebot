import { Message } from 'discord.js';

module.exports = {
  name: 'quote',
  description: 'get a quote',
  fn: (message: Message, args: string) => {
    message.channel.send('hi');
  },
};
