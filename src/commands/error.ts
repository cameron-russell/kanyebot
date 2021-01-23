import { Message } from 'discord.js';
import { errorEmbed } from '../helpers';

module.exports = {
  name: 'error',
  description: 'Displays an error message',
  fn: (message: Message, errMessage: string | null = null) => {
    if (errMessage) {
      errorEmbed.description = errMessage;
    } else {
      errorEmbed.description = 'There was an error trying to execute that command!';
    }
    return message.channel.send({ embed: errorEmbed });
  },
};
