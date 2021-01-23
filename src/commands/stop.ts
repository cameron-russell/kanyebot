import { Message } from 'discord.js';
import { blueEmbed } from '../helpers';
import SingletonFactory from '../Singleton';

module.exports = {
  name: 'stop',
  description: 'Stops the schedule for kanyebot in this channel.',
  fn: (message: Message, args: string[]) => {
    // get our schedule
    const schedule = SingletonFactory.getInstance();

    try {
      if (!schedule.hasJobs()) throw new Error('I am not on a schedule in this channel!');

      // cancel all jobs
      schedule.cancelAll();

      // send notifiction to the channel
      blueEmbed.description = 'I will no longer send quotes to this channel.';
      return message.channel.send({ embed: blueEmbed });
    } catch (error) {
      // throw an error
      return schedule.getCommands().get('error')?.fn(message, error.message);
    }
  },
};
