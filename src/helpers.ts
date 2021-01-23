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

      return Math.round(Number(time) * 60).toString();
    }

    case 'm': {
      const time = arg.match(/^([3-9]{1})(\d{1})(?=m$)/)?.[0];
      if (!time) throw new Error('Time must be between 30 and 99 minutes!');
      return Math.round(Number(time)).toString();
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
): string => {
  try {
    // get the duration
    const time = getDuration(inputTime);

    // if this is the same as the previous duration, go to the catch block
    if (time === schedule.getPreviousTime()) throw new Error("I'm already on this schedule!");

    // schedule the job and update the previous time
    schedule.scheduleJob(`*/${time} * * * *`, () => schedule.getCommands().get('quote')?.fn(message, args));
    schedule.setPreviousTime(time);
    return time;
  } catch (error) {
    // propogate the error message
    throw new Error(error.message);
  }
};
