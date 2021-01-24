import { Message } from 'discord.js';
import { getDuration } from '../helpers';
import SingletonFactory from '../Singleton';

const setEmbed = {
  color: 0x0099ff,
  description: '',
};

module.exports = {
  name: 'set',
  description: 'Sets a schedule for kanyebot to receive a quote.',
  fn: (message: Message, args: string[]) => {
    // get our schedule
    const schedule = SingletonFactory.getInstance();

    // if no duration is provided
    if (!args[2]) {
      return schedule
        .getCommands()
        .get('error')
        ?.fn(message, 'To set a new schedule for this channel, provide a value: <0-9>h or <30-99>m');
    }

    try {
      // get the duration
      const time = getDuration(args[2]);

      // if this is the same as the previous duration, go to the catch block
      if (time === schedule.getPreviousTime()) throw new Error("I'm already on this schedule!");

      // schedule the job and update the previous time
      schedule.scheduleJob(`*/${time} * * * *`, () => schedule.getCommands().get('quote')?.fn(message, args));
      schedule.setPreviousTime(time);

      // send notifiction to the channel
      setEmbed.description = `I will send a quote to this channel every ${time} minutes.`;
      return message.channel.send({ embed: setEmbed });
    } catch (error) {
      // throw an error
      schedule.getCommands().get('error')?.fn(message, error.message);
    }
  },
};
