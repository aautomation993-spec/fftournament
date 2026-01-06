import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: './process.env' });

const app = express();
app.use(cors());
app.use(express.json());

let lastBotMessage = '';

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
const webhookId = webhookUrl.split('/')[5];
const webhookToken = webhookUrl.split('/')[6];
let channelId = null;

const getChannelId = async () => {
  try {
    const response = await axios.get(`https://discord.com/api/webhooks/${webhookId}/${webhookToken}`);
    channelId = response.data.channel_id;
    console.log('Channel ID:', channelId);
  } catch (error) {
    console.error('Error getting channel ID:', error);
  }
};

getChannelId();

app.post('/register', async (req, res) => {
  const { name, email, phone } = req.body;
  console.log('Received registration:', { name, email, phone });

  if (!channelId) {
    res.status(500).json({ message: 'Channel not ready' });
    return;
  }

  try {
    await axios.post(`https://discord.com/api/channels/${channelId}/messages`, {
      content: `New Registration:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}`
    }, {
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    res.status(200).json({ message: 'wait a minute for your registration' }); // Temporary message
  } catch (error) {
    console.error('Error sending to Discord:', error);
    res.status(500).json({ message: 'failed to register' });
  }
});

app.get('/status', async (req, res) => {
  if (!channelId) {
    res.json({ message: '' });
    return;
  }
  try {
    const response = await axios.get(`https://discord.com/api/channels/${channelId}/messages?limit=1`, {
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    const lastMessage = response.data[0];
    if (lastMessage && (lastMessage.content === 'registered' || lastMessage.content === 'failed to register')) {
      res.json({ message: lastMessage.content });
    } else {
      res.json({ message: '' });
    }
  } catch (error) {
    console.error('Error getting last message:', error);
    res.json({ message: '' });
  }
});

app.get('/test-webhook', async (req, res) => {
  try {
    await axios.post(`https://discord.com/api/channels/${channelId}/messages`, {
      content: 'Test message from server'
    }, {
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    res.status(200).json({ message: 'Test message sent to Discord' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send test message' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
