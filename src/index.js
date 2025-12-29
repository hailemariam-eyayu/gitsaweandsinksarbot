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
  await bot.sendMessage(msg.chat.id, '📡 <b>MANUAL BROADCAST: በመላክ ላይ...</b>', { parse_mode: 'HTML' });
  
  try {
    const result = await broadcastDailyReadings();
    await bot.sendMessage(msg.chat.id, `✅ <b>MANUAL BROADCAST ተጠናቅቋል!</b>\n\n📊 የተላኩ: ${result.totalSent}\n❌ ስህተቶች: ${result.totalErrors}\n\n<i>Note: This was a manual broadcast. Scheduled broadcasts happen automatically at 6:00 AM daily.</i>`, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Manual broadcast error:', error);
    await bot.sendMessage(msg.chat.id, '❌ <b>MANUAL BROADCAST ላይ ስህተት ተከስቷል!</b>', { parse_mode: 'HTML' });
  }
});

cron.schedule('0 6 * * *', async () => {
  console.log('🕕 SCHEDULED BROADCAST: Running daily broadcast at 6:00 AM Ethiopian time');
  console.log('📡 This ONLY sends to subscribed users - other bot functions unchanged');
  
  try {
    // Get today's readings first
    const ethDate = getTodayEthiopian();
    const readings = getDailyReadings(ethDate.month, ethDate.day);
    
    if (!readings.found) {
      console.log('❌ No readings found for today, skipping scheduled broadcast');
      return;
    }
    
    // Get ONLY subscribed users (not affecting other functionality)
    const subscribedUsers = getSubscribedUsers();
    const channels = getChannels();
    
    console.log(`📡 SCHEDULED BROADCAST: Sending to ${subscribedUsers.length} subscribed users and ${channels.length} channels`);
    
    let successCount = 0;
    let failCount = 0;
    
    // Send ONLY to subscribed users
    for (const user of subscribedUsers) {
      try {
        const success = await sendDailyReadings(user.chatId);
        if (success) {
          successCount++;
          console.log(`✅ SCHEDULED: Sent to user ${user.chatId} (${user.firstName || 'Unknown'})`);
        } else {
          failCount++;
        }
        // Rate limiting for scheduled broadcasts
        await new Promise(resolve => setTimeout(resolve, 150));
      } catch (error) {
        failCount++;
        console.error(`❌ SCHEDULED: Failed to send to user ${user.chatId}:`, error.message);
      }
    }
    
    // Send to channels
    for (const channelId of channels) {
      try {
        const success = await sendDailyReadings(channelId);
        if (success) {
          successCount++;
          console.log(`✅ SCHEDULED: Sent to channel ${channelId}`);
        } else {
          failCount++;
        }
        // Rate limiting for channels
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        failCount++;
        console.error(`❌ SCHEDULED: Failed to send to channel ${channelId}:`, error.message);
      }
    }
    
    console.log(`✅ SCHEDULED BROADCAST COMPLETE: ${successCount} sent, ${failCount} failed`);
    console.log(`📅 Ethiopian date: ${formatEthiopianDate(ethDate)}`);
    
  } catch (error) {
    console.error('❌ SCHEDULED BROADCAST ERROR:', error);
  }
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
