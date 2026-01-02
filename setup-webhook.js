// Setup webhook for Vercel deployment
import dotenv from 'dotenv';
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://your-vercel-app.vercel.app/api/webhook';

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN not found in environment variables');
  process.exit(1);
}

async function setWebhook() {
  try {
    console.log('🔧 Setting up webhook...');
    console.log('📍 Webhook URL:', WEBHOOK_URL);
    
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: WEBHOOK_URL
      })
    });
    
    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ Webhook set successfully!');
      console.log('📡 Bot is now ready to receive messages via webhook');
    } else {
      console.error('❌ Failed to set webhook:', result.description);
    }
    
  } catch (error) {
    console.error('❌ Error setting webhook:', error.message);
  }
}

async function getWebhookInfo() {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    const result = await response.json();
    
    console.log('📋 Current webhook info:');
    console.log('   URL:', result.result.url || 'Not set');
    console.log('   Pending updates:', result.result.pending_update_count);
    console.log('   Last error:', result.result.last_error_message || 'None');
    
  } catch (error) {
    console.error('❌ Error getting webhook info:', error.message);
  }
}

// Run setup
console.log('🚀 Telegram Bot Webhook Setup for Vercel');
console.log('==========================================');

await getWebhookInfo();
await setWebhook();
await getWebhookInfo();