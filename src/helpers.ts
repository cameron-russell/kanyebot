export interface Command {
  name: string;
  description: string;
  fn: Function;
}

export const blueEmbed = {
  color: 0x0099ff,
  description: '',
};

export const errorEmbed = {
  color: 0xce4760,
  description: '',
};

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

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
