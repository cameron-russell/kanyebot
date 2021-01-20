import { Message } from 'discord.js';

module.exports = {
  name: 'error',
  description: 'Displays an error message',
  fn: (message: Message, errMessage: string | null = null) => {
    if (errMessage) {
      return message.channel.send(errMessage);
    }
    message.channel.send('There was an error trying to execute that command!');
  },
};
