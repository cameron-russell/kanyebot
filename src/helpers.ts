import { Message } from 'discord.js';
import SingletonSchedule from './Singleton';

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
      if (!time) throw new Error('Time must be between 30 and 99 minutes!');
      return time;
    }

    default:
      throw new Error('Time needs to be in the format "1h" or "30m" etc.');
  }
};

export const setSchedule = (
  inputTime: string,
  schedule: SingletonSchedule,
  message: Message,
  args: string[],
): boolean => {
  try {
    const time = getDuration(inputTime);

    if (time === schedule.getPreviousTime()) {
      message.channel.send("I'm already on this schedule!");
      return false;
    }

    schedule.scheduleJob(`*/${time} * * * *`, () => schedule.getCommands().get('quote')?.fn(message, args));
    message.channel.send(`I will send a quote to this channel every ${time} minutes.`);
    schedule.setPreviousTime(time);
    return true;
  } catch (error) {
    schedule.getCommands().get('error')?.fn(message, error.message);
    return false;
  }
};
