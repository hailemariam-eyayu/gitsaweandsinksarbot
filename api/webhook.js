// Ethiopian Orthodox Telegram Bot - Vercel Webhook Handler
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getTodayEthiopian, getYesterdayEthiopian, getTomorrowEthiopian, formatEthiopianDate } from '../src/ethiopianCalendar.js';
import { loadData, getDailyReadings } from '../src/dataReader.js';
import { formatDailyMessage, formatWelcomeMessage, formatHelpMessage, formatSubscriptionStatus } from '../src/messageFormatter.js';
import { addUser, subscribeUser, unsubscribeUser, isUserSubscribed, getSubscribedUsers, getStats } from '../src/storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('ERROR: TELEGRAM_BOT_TOKEN environment variable is not set!');
}

// Load data on startup
loadData();

// Send message to Telegram
async function sendMessage(chatId, text, parseMode = 'Markdown') {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: parseMode
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }
  
  return response.json();
}

// Split long messages
function splitMessage(message, maxLength = 4000) {
  if (message.length <= maxLength) {
    return [message];
  }
  
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

// Send daily readings
async function sendDailyReadings(chatId, dateType = 'today') {
  try {
    let ethDate;
    let dateLabel;
    
    switch (dateType) {
      case 'yesterday':
        ethDate = getYesterdayEthiopian();
        dateLabel = 'የትናንት';
        break;
      case 'tomorrow':
        ethDate = getTomorrowEthiopian();
        dateLabel = 'የነገ';
        break;
      default:
        ethDate = getTodayEthiopian();
        dateLabel = 'የዛሬ';
    }
    
    const readings = getDailyReadings(ethDate.month, ethDate.day);
    
    if (!readings.found) {
      await sendMessage(chatId, `⚠️ ለ${dateLabel} ንባብ አልተገኘም።`);
      return true;
    }
    
    const message = formatDailyMessage(readings, ethDate, dateLabel);
    const parts = splitMessage(message);
    
    for (let i = 0; i < parts.length; i++) {
      await sendMessage(chatId, parts[i]);
      // Small delay between parts
      if (i < parts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error sending ${dateType} readings:`, error.message);
    await sendMessage(chatId, '⚠️ ስህተት ተከስቷል። እባክዎ ዳግም ይሞክሩ።');
    return false;
  }
}

// Main webhook handler
export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(200).json({ ok: true });
    }
    
    const chatId = message.chat.id;
    const text = message.text;
    const userId = message.from.id;
    const userName = message.from?.first_name || 'ተጠቃሚ';
    
    console.log(`📨 Received message from ${userName} (${userId}): ${text}`);
    
    // Handle commands
    if (text === '/start') {
      addUser(chatId, {
        firstName: message.from?.first_name,
        lastName: message.from?.last_name,
        username: message.from?.username
      });
      
      await sendMessage(chatId, formatWelcomeMessage());
      
    } else if (text === '/help') {
      await sendMessage(chatId, formatHelpMessage());
      
    } else if (text === '/today') {
      await sendDailyReadings(chatId, 'today');
      
    } else if (text === '/yesterday') {
      await sendDailyReadings(chatId, 'yesterday');
      
    } else if (text === '/tomorrow') {
      await sendDailyReadings(chatId, 'tomorrow');
      
    } else if (text === '/subscribe') {
      subscribeUser(chatId);
      const subscribeMsg = `✅ *ተመዝግበዋል!*

┌─────────────────────────────────────┐
│ 🎯 *ሁኔታ:* ንቁ ተመዝጋቢ               │
│ ⏰ *ጊዜ:* በየቀኑ ጠዋት 6:00 ሰዓት      │
│ 📅 *ይዘት:* ግጽዌ እና ስንክሳር           │
└─────────────────────────────────────┘

በየቀኑ ጠዋት የዕለቱ ንባብ ይላክልዎታል።

🕊️ _ሰላም ይሁንላችሁ!_`;
      
      await sendMessage(chatId, subscribeMsg);
      
    } else if (text === '/unsubscribe') {
      unsubscribeUser(chatId);
      const unsubscribeMsg = `❌ *ምዝገባ ተሰርዟል*

┌─────────────────────────────────────┐
│ 🎯 *ሁኔታ:* ምዝገባ ተሰርዟል             │
│ 📱 *እንደገና ለመመዝገብ:* /subscribe    │
└─────────────────────────────────────┘

እንደገና ለመመዝገብ /subscribe ይላኩ።

🕊️ _ሰላም ይሁንላችሁ!_`;
      
      await sendMessage(chatId, unsubscribeMsg);
      
    } else if (text === '/status') {
      const subscribed = isUserSubscribed(chatId);
      const ethDate = getTodayEthiopian();
      
      let statusMsg = formatSubscriptionStatus(subscribed);
      statusMsg += `\n\n📅 *የዛሬ ኢትዮጵያ ቀን:* ${formatEthiopianDate(ethDate)}`;
      
      await sendMessage(chatId, statusMsg);
      
    } else if (text === '/stats') {
      const stats = getStats();
      const message = `📊 *ስታቲስቲክስ*\n\n` +
                   `👥 *ተመዝጋቢዎች:* ${stats.totalUsers}\n` +
                   `✅ *ንቁ ተመዝጋቢዎች:* ${stats.subscribedUsers}\n` +
                   `📅 *የዛሬ ቀን:* ${formatEthiopianDate(getTodayEthiopian())}`;
      
      await sendMessage(chatId, message);
      
    } else {
      // Unknown command
      await sendMessage(chatId, `🙏 *እንኳን ደህና መጡ!*\n\nየላክልኝን መልእክት ተቀብያለሁ: "${text}"\n\n/help ን በመጠቀም የምችላቸውን ነገሮች ማየት ይችላሉ።`);
    }
    
    res.status(200).json({ ok: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}