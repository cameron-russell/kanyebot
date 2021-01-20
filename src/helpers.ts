export const getDuration = (arg: string): number => {
  switch (arg[arg.length - 1]) {
    case 'h': {
      const time = arg.match(/^(\d{1})(\.\d{1,2})?(?=h$)/)?.[0];
      if (!time) throw new Error('Time must be less than 10 hours!');

      return Number(time) * 60;
    }

    case 'm': {
      const time = arg.match(/^([3-9]{1})(\d{1})(?=m$)/)?.[0];
      if (!time) throw new Error('Time must be more than 30 minutes!');
      return Number(time);
    }

    default:
      throw new Error('Time needs to be in the format "1h" or "30m" etc.');
  }
};
