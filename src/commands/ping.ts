import { Message } from 'discord.js';

module.exports = {
  name: 'ping',
  description: 'pong',
  fn: (message: Message, args: string) => {
    message.channel.send('pong');
  },
};
