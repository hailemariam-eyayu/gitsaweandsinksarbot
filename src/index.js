import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import { getTodayEthiopian, formatEthiopianDate } from './ethiopianCalendar.js';
import { loadData, getDailyReadings } from './dataReader.js';
import { 
  formatDailyMessage, 
  formatWelcomeMessage, 
  formatHelpMessage,
  formatSubscriptionStatus 
} from './messageFormatter.js';
import {
  addUser,
  subscribeUser,
  unsubscribeUser,
  isUserSubscribed,
  getSubscribedUsers,
  addChannel,
  removeChannel,
  getChannels,
  getStats
} from './storage.js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('ERROR: TELEGRAM_BOT_TOKEN environment variable is not set!');
  console.log('Please set the TELEGRAM_BOT_TOKEN secret to run the bot.');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

loadData();

async function sendDailyReadings(chatId) {
  try {
    const ethDate = getTodayEthiopian();
    const readings = getDailyReadings(ethDate.month, ethDate.day);
    const message = formatDailyMessage(readings, ethDate);
    
    const maxLength = 4000;
    if (message.length > maxLength) {
      const parts = splitMessage(message, maxLength);
      for (const part of parts) {
        await bot.sendMessage(chatId, part, { parse_mode: 'Markdown' });
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } else {
      await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }
    return true;
  } catch (error) {
    console.error(`Error sending to ${chatId}:`, error.message);
    return false;
  }
}

function splitMessage(message, maxLength) {
  const parts = [];
  let current = '';
  const lines = message.split('\n');
  
  for (const line of lines) {
    if ((current + line + '\n').length > maxLength) {
      if (current) parts.push(current.trim());
      current = line + '\n';
    } else {
      current += line + '\n';
    }
  }
  if (current.trim()) parts.push(current.trim());
  
  return parts;
}

async function broadcastDailyReadings() {
  console.log('Starting daily broadcast...');
  const ethDate = getTodayEthiopian();
  console.log(`Ethiopian date: ${formatEthiopianDate(ethDate)}`);
  
  const users = getSubscribedUsers();
  const channels = getChannels();
  
  let successCount = 0;
  let failCount = 0;
  
  for (const user of users) {
    const success = await sendDailyReadings(user.chatId);
    if (success) successCount++;
    else failCount++;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  for (const channelId of channels) {
    const success = await sendDailyReadings(channelId);
    if (success) successCount++;
    else failCount++;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`Broadcast complete: ${successCount} successful, ${failCount} failed`);
}

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  addUser(chatId, {
    firstName: msg.from?.first_name,
    lastName: msg.from?.last_name,
    username: msg.from?.username
  });
  
  await bot.sendMessage(chatId, formatWelcomeMessage(), { parse_mode: 'Markdown' });
});

bot.onText(/\/help/, async (msg) => {
  await bot.sendMessage(msg.chat.id, formatHelpMessage(), { parse_mode: 'Markdown' });
});

bot.onText(/\/today/, async (msg) => {
  await sendDailyReadings(msg.chat.id);
});

bot.onText(/\/subscribe/, async (msg) => {
  const chatId = msg.chat.id;
  subscribeUser(chatId);
  await bot.sendMessage(chatId, '✅ *ተመዝግበዋል!*\n\nበየቀኑ ጠዋት የዕለቱ ንባብ ይላክልዎታል።', { parse_mode: 'Markdown' });
});

bot.onText(/\/unsubscribe/, async (msg) => {
  const chatId = msg.chat.id;
  unsubscribeUser(chatId);
  await bot.sendMessage(chatId, '❌ *ምዝገባ ተሰርዟል*\n\nእንደገና ለመመዝገብ /subscribe ይላኩ።', { parse_mode: 'Markdown' });
});

bot.onText(/\/status/, async (msg) => {
  const chatId = msg.chat.id;
  const subscribed = isUserSubscribed(chatId);
  const ethDate = getTodayEthiopian();
  
  let statusMsg = formatSubscriptionStatus(subscribed);
  statusMsg += `\n\n📅 *የዛሬ ኢትዮጵያ ቀን:* ${formatEthiopianDate(ethDate)}`;
  
  await bot.sendMessage(chatId, statusMsg, { parse_mode: 'Markdown' });
});

bot.onText(/\/stats/, async (msg) => {
  const stats = getStats();
  const message = `📊 *ስታቲስቲክስ*\n\n` +
    `👥 ጠቅላላ ተጠቃሚዎች: ${stats.totalUsers}\n` +
    `✅ ተመዝጋቢዎች: ${stats.subscribedUsers}\n` +
    `📢 ቻናሎች: ${stats.channels}`;
  
  await bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
});

bot.onText(/\/addchannel (.+)/, async (msg, match) => {
  const channelId = match[1].trim();
  addChannel(channelId);
  await bot.sendMessage(msg.chat.id, `✅ ቻናል ${channelId} ታክሏል!`);
});

bot.onText(/\/removechannel (.+)/, async (msg, match) => {
  const channelId = match[1].trim();
  removeChannel(channelId);
  await bot.sendMessage(msg.chat.id, `❌ ቻናል ${channelId} ተሰርዟል!`);
});

bot.onText(/\/broadcast/, async (msg) => {
  await bot.sendMessage(msg.chat.id, '🔄 ማሰራጨት ተጀምሯል...');
  await broadcastDailyReadings();
  await bot.sendMessage(msg.chat.id, '✅ ማሰራጨት ተጠናቅቋል!');
});

cron.schedule('0 6 * * *', () => {
  console.log('Running scheduled daily broadcast at 6:00 AM');
  broadcastDailyReadings();
}, {
  timezone: 'Africa/Addis_Ababa'
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message);
});

console.log('Ethiopian Orthodox Daily Readings Bot is running!');
console.log('Waiting for messages...');

const ethDate = getTodayEthiopian();
console.log(`Today's Ethiopian date: ${formatEthiopianDate(ethDate)}`);
