import { Message } from 'discord.js';
import { blueEmbed } from '../helpers';
import SingletonFactory from '../Singleton';

module.exports = {
  name: 'random',
  description: 'Sets a random schedule for kanyebot to receive a quote.',
  fn: (message: Message, args: string[]) => {
    // get our schedule
    const schedule = SingletonFactory.getInstance();

    try {
      schedule.setRandomSchedule(() => schedule.getCommands().get('quote')?.fn(message, args));
      // send notifiction to the channel
      blueEmbed.description = `I will send a quote to this channel whenever I want.`;
      return message.channel.send({ embed: blueEmbed });
    } catch (error) {
      // throw an error
      schedule.getCommands().get('error')?.fn(message, error.message);
    }
  },
};
