import fs from 'fs';
import path from 'path';
import Schedule from 'node-schedule';
import Discord, { Collection } from 'discord.js';
import { Command, getRandomInt } from './helpers';
// create collection of commands
const commands: Collection<string, Command> = new Discord.Collection();

// get files containing command definitions
const commandFiles: string[] = fs
  .readdirSync(path.resolve(__dirname + '/commands'))
  .filter((file) => file.endsWith('.js'));

// assign each command to the collection
for (const file of commandFiles) {
  const cmd: Command = require(`./commands/${file}`);
  commands.set(cmd.name, cmd);
}

class CustomSchedule {
  constructor() {
    this.previousTime = '';
    this.commands = commands;
    this.schedule = Schedule.scheduleJob('', () => console.log('aaa'));
  }

  private previousTime: string;
  private commands: Collection<string, Command>;
  private schedule: Schedule.Job;

  getPreviousTime = (): string => {
    return this.previousTime;
  };

  setPreviousTime = (time: string): void => {
    this.previousTime = time;
  };

  getCommands = (): Collection<string, Command> => {
    return this.commands;
  };

  hasJobs = (): boolean => {
    return Object.keys(Schedule.scheduledJobs).length > 0;
  };

  setRandomSchedule = (fn: Schedule.JobCallback): void => {
    // cancel the schedule;
    this.cancelAll();

    // get a random int
    const randomInt = getRandomInt(1, 60);

    // extend the function to reschedule itself with a random time
    const extendedFunction: Function = (fn: Function) => {
      fn();
      const randomInt = getRandomInt(1, 60);
      console.log('next ' + randomInt);
      this.schedule = Schedule.rescheduleJob(this.schedule, `*/${randomInt} * * * *`);
    };

    // set the rescheduling function as the schedule
    this.schedule = Schedule.scheduleJob(`*/${randomInt} * * * *`, () => extendedFunction(fn));
  };

  scheduleJob = (s: string, fn: Schedule.JobCallback): void => {
    this.cancelAll();
    //schedule a new job;
    this.schedule = Schedule.scheduleJob(s, fn);
  };
  cancelAll = (): void => {
    Object.keys(Schedule.scheduledJobs).forEach((job) => Schedule.cancelJob(job));
  };
}

const SingletonFactory = (function () {
  let instance: CustomSchedule;
  return {
    getInstance: () => {
      if (!instance) {
        instance = new CustomSchedule();
      }
      return instance;
    },
  };
})();

export default SingletonFactory;
