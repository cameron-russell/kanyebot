import fs from 'fs';
import path from 'path';
import Schedule from 'node-schedule';
import Discord, { Collection } from 'discord.js';
import { Command } from './helpers';
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

export default class SingletonSchedule {
  constructor() {
    this.previousTime = '';
    this.commands = commands;
  }

  private previousTime: string;
  private commands: Collection<string, Command>;

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

  scheduleJob = (s: string, fn: Schedule.JobCallback): void => {
    this.cancelAll();
    console.log('setting a new job');
    //schedule a new job;
    Schedule.scheduleJob(s, fn);
  };
  cancelAll = (): void => {
    Object.keys(Schedule.scheduledJobs).forEach((job) => Schedule.cancelJob(job));
  };
}
