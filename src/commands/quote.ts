import axios from 'axios';
import { Message } from 'discord.js';

const quoteEmbed = {
  color: 0x0099ff,
  description: '',
  footer: {
    text: '- Kanye West',
  },
};

module.exports = {
  name: 'quote',
  description: 'Gets a random Kanye quote from the Kanye API.',
  fn: async (message: Message, args: string[]) => {
    try {
      const { data } = await axios.get('https://api.kanye.rest');
      if (data?.quote) {
        const embed = quoteEmbed;
        embed.description = `"${data.quote}"`;
        message.channel.send({ embed });
      } else throw new Error();
    } catch {
      message.channel.send('There was an error getting a quote');
    }
  },
};
