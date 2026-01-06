import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: './process.env' });

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  console.log(`Message received: "${message.content}" from ${message.author.tag}`);
  if (message.author.bot) return; // Ignore bot messages

  // Check if the message starts with "New Registration:"
  if (message.content.startsWith('New Registration:')) {
    // Send a message asking for validation
    await message.channel.send('Please reply with "valid" or "invalid" to confirm registration.');
  }

  // Check if the message is "valid" or "invalid"
  if (message.content.toLowerCase().trim() === 'valid') {
    console.log('Responding with registered');
    await message.channel.send('registered');
  } else if (message.content.toLowerCase().trim() === 'invalid') {
    console.log('Responding with failed to register');
    await message.channel.send('failed to register');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

