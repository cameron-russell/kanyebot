import { Message } from 'discord.js';
import Schedule from 'node-schedule';
import { Collection } from 'discord.js';

export interface Command {
  name: string;
  description: string;
  fn: Function;
}

export const getDuration = (arg: string): string => {
  switch (arg[arg.length - 1]) {
    case 'h': {
      const time = arg.match(/^(\d{1})(\.\d{1,2})?(?=h$)/)?.[0];
      if (!time) throw new Error('Time must be less than 10 hours!');

      return (Number(time) * 60).toString();
    }

    case 'm': {
      const time = arg.match(/^([3-9]{1})(\d{1})(?=m$)/)?.[0];
      if (!time) throw new Error('Time must be more than 30 minutes!');
      return time;
    }

    default:
      throw new Error('Time needs to be in the format "1h" or "30m" etc.');
  }
};

export const setSchedule = (
  inputTime: string,
  previousTime: string,
  schedule: Schedule.Job,
  commands: Collection<string, Command>,
  message: Message,
  args: string[],
) => {
  try {
    const time = getDuration(inputTime);
    if (time === previousTime) return message.channel.send("I'm already on this schedule!");

    if (schedule) {
      schedule.cancel();
      schedule = Schedule.scheduleJob(`*/${time} * * * *`, () =>
        commands.get('quote')?.fn(message, args),
      );
      previousTime = time;
      return message.channel.send(`I will send a quote to this channel every ${time} minutes.`);
    }
  } catch (error) {
    commands.get('error')?.fn(message, args);
  }
};
